import Exception, { ERR_CLI } from "nd-error";
import { Colorize } from "nd-helper";
import LoggerService, { LOGGER_CLI_BUILDER } from "nd-logger";

import Command from "./Command";
import CommandlineEvent, { Default } from "./CommandlineEvent";
import { ICommandCallbackResult } from "./ICommand";
import Option from "./Option";

export default class Commandline {
  get name() {
    return this._name;
  }
  get description() {
    return this._description;
  }

  private _globalOptions: Map<string, Option>;
  private _commands: Map<string, Command>;

  private async executeGlobalOptions(opts: string[]) {
    LoggerService.log(LOGGER_CLI_BUILDER, `start check global option`);

    let callback: ICommandCallbackResult;

    await opts.forEach(async (_o, i) => {
      if (!this.isOption(_o)) return;

      LoggerService.log(LOGGER_CLI_BUILDER, `try ${_o} option ?`);
      const o = _o.replace("--", "");
      if (this._globalOptions.has(o)) {
        const option = this._globalOptions.get(o) as Option;
        if (option.needParam) {
          callback = await option.execute(this, opts[i + 1]);
          this._event.emit("globalOption", option, opts[i + 1]);
          opts.splice(i, 2);
        } else {
          callback = await option.execute(this, undefined);
          this._event.emit("globalOption", option);
          opts.splice(i, 1);
        }
      }
    });

    return { arguments: opts, callback };
  }

  private finish() {
    this.event.emit("end");
  }

  set event(event: CommandlineEvent) {
    this.event.removeAllListeners(); // remove all old listeners
    this.event.emit("destory", undefined);
    this._event = event;
    this.event.emit("initial", undefined);
  }

  get event() {
    return this._event;
  }

  // TODO: Add support command option and subcommand option
  private async travisArgumentPath(args: string[]): Promise<ICommandCallbackResult> {
    let skip = [];
    let c: Command | undefined;
    let callback: ICommandCallbackResult;

    let i = 0;
    for await (const arg of args) {
      if (arg !== "") LoggerService.log(LOGGER_CLI_BUILDER, `current travis argument is ${arg}`);

      if (c) {
        LoggerService.log(
          LOGGER_CLI_BUILDER,
          `get command '${Colorize.important(c.name)}' and it ${c.needParam ? "need params" : "no need param"}`,
        );
        LoggerService.log(LOGGER_CLI_BUILDER, `${c.name} might have subcommand(${arg}) ?`);
        const s = c.getSub(arg);
        // const otherArgs = args.slice(i);

        if (s) {
          LoggerService.log(LOGGER_CLI_BUILDER, `${c.name} have subcommand`);

          if (s.needParam) {
            callback = await s.execute(this, args[i + 1]); // next
            this._event.emit("subcommand", s, args[i + 1]);
            skip.push(i + 1); // skip next args
          } else {
            callback = await s.execute(this, undefined);
            this._event.emit("subcommand", s);
          }

          LoggerService.log(LOGGER_CLI_BUILDER, `${c.name} ${s.name} has been executed; remove in cache`);
          c = undefined;
        } else {
          LoggerService.log(LOGGER_CLI_BUILDER, `${c.name} doesn't have any subcommand`);

          if (c.needParam) {
            callback = await c.execute(this, args[i + 1]); // next
            this._event.emit("command", c, args[i + 1]);
            skip.push(i + 1); // skip next args
          } else {
            callback = await c.execute(this, undefined);
            this._event.emit("command", c);
          }

          LoggerService.log(LOGGER_CLI_BUILDER, `${c.name} has been executed; remove in cache`);
          c = undefined;
        }
      }

      if (skip.includes(i)) {
        LoggerService.log(LOGGER_CLI_BUILDER, `skip argument ${arg}`);
        skip = skip.filter(s => s !== i); // remove element of i
        return;
      }

      if (i === 0 && this.isOption(arg)) {
        LoggerService.log(LOGGER_CLI_BUILDER, `option look like to appear before command set`);
        throw Exception.build(ERR_CLI).description("invalid option and command");
      }

      // no command in first args
      c = this.isCommand(arg);
      if (i === 0 && !c) {
        LoggerService.log(LOGGER_CLI_BUILDER, `you didn't input valid root command in first argument`);
        throw Exception.build(ERR_CLI).description("invalid option and command");
      }

      i++;
    }

    return callback;
  }

  private isOption(a: string) {
    return /^--.*/.test(a);
  }

  private isCommand(a: string) {
    return this._commands.get(a);
  }

  constructor(private _name: string, private _description: string, private _event: CommandlineEvent = Default) {
    this._globalOptions = new Map();
    this._commands = new Map();

    LoggerService.log(LOGGER_CLI_BUILDER, `try to build ${this._name} commandline`);
  }

  public option(option: Option) {
    this._globalOptions.set(option.name, option);
  }

  public command(cmd: Command) {
    this._commands.set(cmd.name, cmd);
  }

  public async run(_args: string[]) {
    const node = _args[0];
    const file = _args[1];

    const args = _args.slice(2);

    LoggerService.log(LOGGER_CLI_BUILDER, `node path       ${node}`);
    LoggerService.log(LOGGER_CLI_BUILDER, `file path       ${file}`);

    LoggerService.log(LOGGER_CLI_BUILDER, `input arguments      ${args}`);

    const global = await this.executeGlobalOptions(args);
    if (global.callback && typeof global.callback === "function") {
      const isEnd = global.callback();
      if (isEnd === true) return this.finish();
    }

    LoggerService.log(LOGGER_CLI_BUILDER, `after resolve global ${args}`);

    args.push(""); // push empty string
    const callback = await this.travisArgumentPath(global.arguments);
    if (callback && typeof callback === "function") {
      const isEnd = callback();
      if (isEnd === true) return this.finish();
    }

    return this.finish();
  }
}

import Exception, { ERR_CLI } from "nd-error";
import LoggerService, { Colorize, LOGGER_CLI_BUILDER } from "nd-logger";

import { CommandApi } from "..";

import Command from "./Command";
import CommandlineEvent, { Default } from "./CommandlineEvent";
import { ICommandCallback, ICommandCallbackResult } from "./ICommand";
import Option from "./Option";
import Optionable, { IOptionable } from "./Optionable";

export default class Commandline implements IOptionable {
  get name() {
    return this._name;
  }
  get description() {
    return this._description;
  }

  private _callback?: ICommandCallback;
  private _globalOptions: Map<string, Option>;
  private _commands: Map<string, Command>;

  private async executeGlobalOptions(opts: string[]) {
    LoggerService.log(LOGGER_CLI_BUILDER, `start check global option`);

    const callback: ICommandCallbackResult[] = [];

    await opts.forEach(async (_o, i) => {
      if (!this.isOption(_o)) return;

      LoggerService.log(LOGGER_CLI_BUILDER, `try ${_o} option ?`);
      const o = _o.replace("--", "");
      if (this._globalOptions.has(o)) {
        const option = this._globalOptions.get(o) as Option;
        if (option.needParam) {
          callback.push(await option.execute(this, opts[i + 1]));
          this._event.emit("globalOption", option, opts[i + 1]);
          opts.splice(i, 2);
        } else {
          callback.push(await option.execute(this, undefined));
          this._event.emit("globalOption", option);
          opts.splice(i, 1);
        }
      }
    });

    return { arguments: opts, callback };
  }

  private finish() {
    LoggerService.log(LOGGER_CLI_BUILDER, "start emit end process event !!");
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

  private async travisArgumentPath(args: string[]): Promise<ICommandCallbackResult> {
    let skip: Array<number> = [];
    let c: Command | undefined;
    let callback: ICommandCallbackResult;

    let i = 0;
    for await (const arg of args) {
      if (arg !== "") LoggerService.log(LOGGER_CLI_BUILDER, `current travis argument is ${arg}`);
      const next = args[i + 1];
      if (next !== "") LoggerService.log(LOGGER_CLI_BUILDER, `next travis argument is ${next}`);

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
          this.travisOptionPath(s, args);
          LoggerService.log(LOGGER_CLI_BUILDER, `updated config from options`);

          if (s.needParam) {
            if (!this.isParam(next))
              throw Exception.build(ERR_CLI).description(`${c.name} ${s.name} is require parameter`);
            LoggerService.log(LOGGER_CLI_BUILDER, `need parameter; pass ${next} as subcommand parameter`);
            callback = await s.execute(this, next);
            this._event.emit("subcommand", s, next);
            skip.push(i + 1); // skip next args
          } else {
            LoggerService.log(LOGGER_CLI_BUILDER, `no parameter required`);
            callback = await s.execute(this, undefined);
            this._event.emit("subcommand", s);
          }

          LoggerService.log(LOGGER_CLI_BUILDER, `${c.name} ${s.name} has been executed; remove in cache`);
          c = undefined;
        } else {
          LoggerService.log(LOGGER_CLI_BUILDER, `${c.name} doesn't have any subcommand`);
          this.travisOptionPath(c, args);
          LoggerService.log(LOGGER_CLI_BUILDER, `updated config from options`);

          if (c.needParam) {
            if (!this.isParam(arg)) throw Exception.build(ERR_CLI).description(`${c.name} is require parameter`);
            LoggerService.log(LOGGER_CLI_BUILDER, `need parameter; pass ${arg} as command parameter`);
            callback = await c.execute(this, arg);
            this._event.emit("command", c);
            skip.push(i + 1); // skip next args
          } else {
            LoggerService.log(LOGGER_CLI_BUILDER, `no parameter required`);
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
        continue;
      }

      if (i === 0 && this.isOption(arg)) {
        LoggerService.log(LOGGER_CLI_BUILDER, `option look like to appear before primary command set`);
        throw Exception.build(ERR_CLI).description(
          `Invalid command format... learn more at ${Colorize.appname(this.name)} ${Colorize.option("--help")}`,
        );
      }

      // no command in first args
      c = this.isCommand(arg);
      if (i === 0 && !c) {
        LoggerService.log(LOGGER_CLI_BUILDER, `you didn't input valid root command in first argument`);
        LoggerService.log(LOGGER_CLI_BUILDER, `try to call default callback with arguments '${arg}'`);

        if (this._callback) {
          if (!this.isParam(arg)) throw Exception.build(ERR_CLI).description(`${this.name} is require parameter`);
          callback = this._callback({ self: this, name: "default", value: arg, apis: CommandApi.get() });
        } else
          throw Exception.build(ERR_CLI).description(
            `Invalid command format... learn more at ${Colorize.appname(this.name)} ${Colorize.option("--help")}`,
          );
      }

      i++;
    }

    return callback;
  }

  private travisOptionPath(c: Optionable, opts: string[]) {
    LoggerService.log(LOGGER_CLI_BUILDER, `start check local option`);

    opts.forEach((_o, i) => {
      if (!this.isOption(_o)) return;

      const o = _o.replace("--", "");

      LoggerService.log(LOGGER_CLI_BUILDER, `try is ${o} is a option of ${c.name} ?`);

      const option = c.getOption(o);
      if (option) {
        LoggerService.log(LOGGER_CLI_BUILDER, `${option.name} is a part of ${c.name}`);
        if (option.needParam) {
          if (!this.isParam(opts[i + 1]))
            throw Exception.build(ERR_CLI).description(`${option.name} is required parameter`);
          LoggerService.log(LOGGER_CLI_BUILDER, `option need parameter; which is ${opts[i + 1]}`);
          option.execute(this, opts[i + 1]);
          this._event.emit("option", option, opts[i + 1]);
          opts.splice(i, 2);
        } else {
          LoggerService.log(LOGGER_CLI_BUILDER, `option doesn't need any parameter`);
          option.execute(this, undefined);
          this._event.emit("option", option);
          opts.splice(i, 1);
        }
      } else {
        LoggerService.log(LOGGER_CLI_BUILDER, `cannot find ${_o} on ${c.name}`);
      }
    });
  }

  private isOption(a: string) {
    return /^--.*/.test(a);
  }

  private isCommand(a: string) {
    return this._commands.get(a);
  }

  private isParam(a?: string) {
    return a !== undefined && a !== null && !this.isOption(a) && a !== "";
  }

  constructor(private _name: string, private _description: string, private _event: CommandlineEvent = Default) {
    this._globalOptions = new Map();
    this._commands = new Map();

    LoggerService.log(LOGGER_CLI_BUILDER, `try to build ${this._name} commandline`);
  }

  public option(option: Option) {
    this._globalOptions.set(option.name, option);
    return this;
  }

  public command(cmd: Command) {
    this._commands.set(cmd.name, cmd);
  }

  public callback(callback: ICommandCallback) {
    this._callback = callback;
  }

  public async run(_args: string[]) {
    const node = _args[0];
    const file = _args[1];

    const args = _args.slice(2);

    LoggerService.log(LOGGER_CLI_BUILDER, `node path       ${node}`);
    LoggerService.log(LOGGER_CLI_BUILDER, `file path       ${file}`);

    LoggerService.log(LOGGER_CLI_BUILDER, `input arguments      ${args}`);

    const global = await this.executeGlobalOptions(args);
    if (global.callback.length > 0) {
      LoggerService.log(LOGGER_CLI_BUILDER, `run global callback`);
      global.callback.forEach(c => {
        if (c && typeof c === "function") {
          const isEnd = c();
          if (isEnd === true) return this.finish();
        }
      });
    }

    LoggerService.log(LOGGER_CLI_BUILDER, `after resolve global`);

    args.push(""); // push empty string
    const callback = await this.travisArgumentPath(global.arguments);
    if (callback && typeof callback === "function") {
      const isEnd = callback();
      if (isEnd === true) return this.finish();
    }

    return this.finish();
  }
}

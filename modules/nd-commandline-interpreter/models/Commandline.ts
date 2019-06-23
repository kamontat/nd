import Exception, { CLI_Exception } from "nd-error";
import { Colorize } from "nd-helper";
import LoggerService, { LOGGER_CLI_BUILDER } from "nd-logger";

import Command from "./Command";
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

    let callback: (() => void) | undefined | void = () => {};

    await opts.forEach(async (_o, i) => {
      LoggerService.log(LOGGER_CLI_BUILDER, `try ${_o} option ?`);
      const o = _o.replace("--", "");
      if (this._globalOptions.has(o)) {
        const option = this._globalOptions.get(o) as Option;
        if (option.needParam) {
          LoggerService.log(LOGGER_CLI_BUILDER, `resolve as option with params`);
          callback = await option.execute(this, opts[i + 1]);
          opts.splice(i, 2);
        } else {
          LoggerService.log(LOGGER_CLI_BUILDER, `resolve as option without params`);
          callback = await option.execute(this, undefined);
          opts.splice(i, 1);
        }
      }
    });

    return { arguments: opts, callback };
  }

  private async travisArgumentPath(args: string[]) {
    let skip = false;
    let c: Command | undefined;
    let callback: (() => void) | undefined | void = () => {};

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
        LoggerService.log(LOGGER_CLI_BUILDER, `${c.name} ${s ? "have subcommand" : "doesn't have any subcommand"}`);

        if (s) {
          if (s.needParam) {
            callback = await s.execute(this, args[i + 1]); // next
            skip = true; // skip next args
          } else callback = await s.execute(this, undefined);

          LoggerService.log(LOGGER_CLI_BUILDER, `${c.name} ${s.name} has beed executed; remove in cache`);
          c = undefined;
        } else {
          if (c.needParam) {
            callback = await c.execute(this, args[i + 1]); // next
            skip = true; // skip next args
          } else callback = await c.execute(this, undefined);

          LoggerService.log(LOGGER_CLI_BUILDER, `${c.name} has beed executed; remove in cache`);
          c = undefined;
        }
      }

      if (skip) {
        LoggerService.log(LOGGER_CLI_BUILDER, `skip argument ${arg}`);
        skip = false;
        return;
      }

      if (i === 0 && this.isOption(arg)) {
        LoggerService.log(LOGGER_CLI_BUILDER, `option look like to appear before command set`);
        throw Exception.build(CLI_Exception).description("invalid option and command");
      }

      // no command in first args
      c = this.isCommand(arg);
      if (i === 0 && !c) {
        LoggerService.log(LOGGER_CLI_BUILDER, `you didn't input valid root command in first argument`);
        throw Exception.build(CLI_Exception).description("invalid option and command");
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

  constructor(private _name: string, private _description: string) {
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
    if (global.callback && typeof global.callback === "function") global.callback();
    LoggerService.log(LOGGER_CLI_BUILDER, `after resolve global ${args}`);

    args.push(""); // push empty string
    const callback = await this.travisArgumentPath(global.arguments);
    if (callback && typeof callback === "function") callback();
  }
}

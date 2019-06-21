import LoggerService, { LOGGER_CLI_BUILDER } from "../../nd-logger";

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

  private executeGlobalOptions(opts: string[]): string[] {
    LoggerService.log(LOGGER_CLI_BUILDER, `try to map global options of ${opts.length === 0 ? "empty" : opts}`);

    opts.forEach((_o, i) => {
      const o = _o.replace("--", "");
      if (this._globalOptions.has(o)) {
        (this._globalOptions.get(o) as Option).execute(this, undefined);
        opts.splice(i, 1);
      }
    });

    return opts;
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

  public run(_args: string[]) {
    const node = _args[0];
    const file = _args[1];

    let args = _args.slice(2);

    LoggerService.log(LOGGER_CLI_BUILDER, `node path       ${node}`);
    LoggerService.log(LOGGER_CLI_BUILDER, `file path       ${file}`);

    LoggerService.log(LOGGER_CLI_BUILDER, `input arguments      ${args}`);
    args = this.executeGlobalOptions(args);
    LoggerService.log(LOGGER_CLI_BUILDER, `after resolve global ${args}`);
  }
}

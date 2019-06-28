import LoggerService, { LOGGER_CLI_CONFIG } from "nd-logger";

export default class CommandlineConfig {
  private constructor() {
    this._config = new Map();
  }
  private _config: Map<string, string | boolean | number>;
  private static instance?: CommandlineConfig;

  public get(name: string) {
    LoggerService.log(LOGGER_CLI_CONFIG, `Commandline config get ${name}`);
    return this._config.get(name);
  }

  public set(name: string, value: string | boolean | number) {
    LoggerService.log(LOGGER_CLI_CONFIG, `Commandline config set ${name} to ${value}`);
    this._config.set(name, value);
  }

  public static CONST() {
    if (!CommandlineConfig.instance) {
      CommandlineConfig.instance = new CommandlineConfig();
    }

    return CommandlineConfig.instance;
  }
}

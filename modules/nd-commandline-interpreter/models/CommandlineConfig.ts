import LoggerService, { LOGGER_CLI_CONFIG } from "nd-logger";

export default class CommandlineConfig {
  private constructor() {
    this._config = new Map();
  }
  private _config: Map<string, string | boolean | number>;
  private static instance?: CommandlineConfig;

  public get<T>(name: string, defaultValue?: T) {
    const value = this._config.get(name);
    if (value === undefined && defaultValue) {
      LoggerService.log(LOGGER_CLI_CONFIG, `load default config value instead; ${defaultValue}`);
      return defaultValue;
    }
    LoggerService.log(LOGGER_CLI_CONFIG, `get config of '${name}' is ${value}`);
    return (value as unknown) as T;
  }

  public set(name: string, value: string | boolean | number) {
    LoggerService.log(LOGGER_CLI_CONFIG, `set config of '${name}' to '${value}'`);
    this._config.set(name, value);
  }

  public static CONST() {
    if (!CommandlineConfig.instance) {
      CommandlineConfig.instance = new CommandlineConfig();
    }

    return CommandlineConfig.instance;
  }
}

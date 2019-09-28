import LoggerService, { LOGGER_CLI_CONFIG } from "@nd/logger";

export default class CommandlineConfig {
  private static instance?: CommandlineConfig;
  private _config: Map<string, string | boolean | number>;
  private constructor() {
    this._config = new Map();
  }

  public static CONST() {
    if (!CommandlineConfig.instance) {
      CommandlineConfig.instance = new CommandlineConfig();
    }

    return CommandlineConfig.instance;
  }

  public get<T>(name: string, defaultValue?: T) {
    const value = this._config.get(name);
    if (value === undefined && defaultValue !== undefined) {
      LoggerService.log(LOGGER_CLI_CONFIG, `load default ${name} config value instead; ${defaultValue}`);
      return defaultValue;
    }
    LoggerService.log(LOGGER_CLI_CONFIG, `get config of '${name}' is ${value}`);
    return (value as unknown) as T;
  }

  public has(name: string) {
    return this._config.has(name);
  }

  public set(name: string, value: string | boolean | number) {
    if (typeof value === "string") {
      LoggerService.log(LOGGER_CLI_CONFIG, `set '${value}' as [string] to '${name}'`);
      this._config.set(name, value);
    } else if (typeof value === "boolean") {
      LoggerService.log(LOGGER_CLI_CONFIG, `set '${value}' as [boolean] to '${name}'`);
      this._config.set(name, value);
    } else if (typeof value === "number") {
      if (!isNaN(value) && !isFinite(value)) {
        LoggerService.log(LOGGER_CLI_CONFIG, `set '${value}' as [number] to '${name}'`);
        this._config.set(name, value);
      }
    }
  }
}

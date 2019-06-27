import Event from "events";
import fs from "fs";
import Exception, { ERR_CFG } from "nd-error";
import LoggerService, { LOGGER_CONFIG } from "nd-logger";
import { resolve } from "path";
import readline from "readline";

import { ConfigKey, ConfigSchema, IConfiguration } from "./interface";

export class Configuration extends Event implements IConfiguration {
  private constructor() {
    super();
  }

  private _object: ConfigSchema = {
    "mode": "production",
    "version": "v1",
    "output": true,
    "output.color": true,
    "output.file": true,
    "output.level": "2",
    "novel.location": ".",
    "novel.export": false, // not implement yet
  };

  private static o: Configuration;

  public load(_path: string) {
    const file = resolve(`${_path}/config.ndc`); // load config
    LoggerService.log(LOGGER_CONFIG, `start load config from ${file}`);
    return new Promise<Configuration>((res, rej) => {
      try {
        const reader = readline.createInterface({
          input: fs.createReadStream(file),
        });

        reader.on("line", line => {
          if (line === undefined || line === null || line === "") return;

          const _line = line.split("#"); // remove all space
          // with comment
          if (_line.length > 1) {
            if (_line[0].trim() === "") {
              LoggerService.log(LOGGER_CONFIG, `auto detect comment line '${_line[1]}'`);
              return;
            }
            line = _line[0]; // remove # inline comment
            LoggerService.log(LOGGER_CONFIG, `auto detect inline comment '${_line[1]}'`);
          }
          const _arr = line.split("=");
          if (_arr.length !== 2) {
            LoggerService.log(LOGGER_CONFIG, `ignore this line ${line}`);
            return;
          }
          const key = _arr[0];
          const value = _arr[1].trim();

          if (!key || !value) throw new Error("invalid config format");
          LoggerService.log(LOGGER_CONFIG, `build config of ${key}=${value}`);

          Configuration.CONST().set(key as ConfigKey, value);
        });

        reader.on("close", () => {
          res(Configuration.CONST());
        });

        reader.on("SIGINT", rej);
        reader.on("SIGCONT", rej);
        reader.on("SIGTSTP", rej);
      } catch (e) {
        rej(Exception.cast(e, { base: ERR_CFG }));
      }
    });
  }

  public get(key: ConfigKey) {
    return this._object[key];
  }

  public set(key: ConfigKey, value?: string) {
    if (!value) return;
    const old = this._object[key];
    if (old !== value) {
      this._object[key] = value as never; // might change to anythings else
      this.emit(key, value);
    }
  }

  public static CONST(): Configuration {
    if (!Configuration.o) {
      Configuration.o = new Configuration();
    }
    return Configuration.o;
  }
}

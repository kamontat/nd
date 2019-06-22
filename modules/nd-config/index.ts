import fs from "fs";
import LoggerService, { LOGGER_CONFIG } from "nd-logger";
import readline from "readline";

import Package from "./package.json";

type ConfigKey =
  | "mode"
  | "version"
  | "output"
  | "output.color"
  | "output.file"
  | "output.level"
  | "novel.location"
  | "novel.export";

interface ConfigSchema {
  mode: "development" | "production";
  version: "v1";
  output: boolean;
  "output.color": boolean;
  "output.file": boolean;
  "output.level": "0" | "1" | "2";
  "novel.location": string;
  "novel.export": boolean;
}

class Configuration {
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

  public load(path: string) {
    LoggerService.log(LOGGER_CONFIG, `start load config from ${path}`);

    const reader = readline.createInterface({
      input: fs.createReadStream(path),
    });

    reader.on("line", line => {
      if (line === undefined || line === null || line === "") return;

      const _arr = line.split("=");
      const key = _arr[0];
      const value = _arr[1];

      if (!key || !value) throw new Error("invalid config format");
      LoggerService.log(LOGGER_CONFIG, `build config of ${key}=${value}`);

      Configuration.CONST().set(key as ConfigKey, value);
    });

    return new Promise<Configuration>((res, rej) => {
      reader.on("close", () => {
        res(Configuration.CONST());
      });

      reader.on("SIGINT", rej);
      reader.on("SIGCONT", rej);
      reader.on("SIGTSTP", rej);
    });
  }

  public get(key: ConfigKey) {
    return this._object[key];
  }

  public set(key: ConfigKey, value?: string) {
    if (!value) return;
    this._object[key] = value as never; // might change to anythings else
  }

  public static CONST(): Configuration {
    if (!Configuration.o) {
      Configuration.o = new Configuration();
    }
    return Configuration.o;
  }
}

export const load = Configuration.CONST().load;
export { Package };

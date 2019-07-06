import { defaultEditor } from "env-editor";
import Event from "events";
import fs from "fs";
import Exception, { ERR_CFG, ERR_CLI } from "nd-error";
import LoggerService, { LOGGER_CONFIG } from "nd-logger";
import open from "open";
import { resolve } from "path";
import readline, { ReadLine } from "readline";

import { BACKUP_NAME } from "../constants/file";

import { ConfigKey, ConfigSchema, IConfiguration } from "./interface";

export class Configuration extends Event implements IConfiguration {
  private filepath: string = "./config.ndc";

  private generateContent() {
    return Object.keys(this._object).reduce((p, k) => {
      const v = this.get(k as any);
      return `${p}${k}=${v}\n`;
    }, "");
  }
  private static o: Configuration;

  protected constructor() {
    super();
    this._object = this.restore();
  }

  protected _object: ConfigSchema;

  public path(_open: boolean) {
    return new Promise<string>(res => {
      if (_open) {
        LoggerService.log(LOGGER_CONFIG, `try to open config in default editor`);
        const editor = defaultEditor();
        LoggerService.log(LOGGER_CONFIG, `get default editor is ${editor.name}`);

        return open(this.filepath, { wait: true, app: editor.paths[0] })
          .then(() => {
            return res(this.filepath);
          })
          .catch(e => {
            Exception.cast(e, { base: ERR_CLI })
              .print(LOGGER_CONFIG)
              .exit();
          });
      }
      return res(this.filepath);
    });
  }

  public load(_path: string) {
    this.filepath = resolve(`${_path}/config.ndc`); // load config
    LoggerService.log(LOGGER_CONFIG, `start load config from ${this.filepath}`);
    return new Promise<Configuration>((res, rej) => {
      try {
        const reader = readline.createInterface({
          input: fs.createReadStream(this.filepath),
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

  public save(backup: boolean) {
    if (backup) {
      fs.renameSync(this.filepath, BACKUP_NAME(this.filepath));
    }

    LoggerService.log(LOGGER_CONFIG, `start saving configuration file to ${this.filepath}`);
    const content = this.generateContent();
    LoggerService.log(LOGGER_CONFIG, `content in the file should be ${content}`);
    fs.writeFileSync(this.filepath, content);
    LoggerService.log(LOGGER_CONFIG, `file has been saved`);
  }

  public saveAsync(backup: boolean) {
    LoggerService.log(LOGGER_CONFIG, `start async saving configuration file to ${this.filepath}`);
    const content = this.generateContent();
    LoggerService.log(LOGGER_CONFIG, `content in the file should be ${content}`);

    return new Promise<void>((res, rej) => {
      if (backup) {
        fs.rename(this.filepath, BACKUP_NAME(this.filepath), err => {
          if (err) return rej(err);
          else {
            LoggerService.log(LOGGER_CONFIG, `backup file has been created`);
            return res();
          }
        });
      }
    }).then(() => {
      return new Promise<this>((res, rej) => {
        fs.writeFile(this.filepath, content, err => {
          if (err) return rej(err);
          else {
            LoggerService.log(LOGGER_CONFIG, `file has been saved`);
            return res(this);
          }
        });
      });
    });
  }

  public start(rl: ReadLine): Promise<this> {
    const questionPromise = (q: string) => {
      return new Promise<string>(res => {
        rl.question(q, res);
      });
    };

    return questionPromise("? create").then(answer => {
      LoggerService.log(LOGGER_CONFIG, `create something answer is ${answer}`);

      return new Promise<this>(res => res(this));
    });
  }

  public restore(): ConfigSchema {
    this._object = {
      "mode": "production",
      "version": "v1",
      "output.color": true,
      "output.file": true,
      "output.level": "2",
      "novel.location": ".",
      "novel.export": false, // not implement yet
    };

    return this._object;
  }

  public static CONST(): Configuration {
    if (!Configuration.o) {
      Configuration.o = new Configuration();
    }
    return Configuration.o;
  }
}

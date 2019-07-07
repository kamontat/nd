import { defaultEditor } from "env-editor";
import Event from "events";
import fs from "fs";
import Exception, { ERR_CFG, ERR_CLI } from "nd-error";
import { Colorize } from "nd-helper";
import LoggerService, { LOGGER_CONFIG } from "nd-logger";
import open from "open";
import { resolve } from "path";
import readline, { ReadLine } from "readline";

import { ConfigParser } from "../apis/parser";
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
        if (!fs.existsSync(this.filepath)) {
          LoggerService.log(LOGGER_CONFIG, `configuration file not exist, create new one`);

          fs.mkdirSync(_path, { recursive: true }); // create directory and subdirectory if not exist
          this.save(false);
        }

        const reader = readline.createInterface({
          input: fs.createReadStream(this.filepath),
        });

        reader.on("line", line => {
          if (line === undefined || line === null || line === "") return;

          const result = ConfigParser(line);
          if (!result) throw Exception.build(ERR_CFG).description("invalid config format");
          if (result instanceof Array) result.forEach(r => Configuration.CONST().set(r.key, r.value));
          else Configuration.CONST().set(result.key, result.value);
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

  public regex(reg: string) {
    const result: { [key: string]: any } = {};
    // full string of config
    const _t = this.get(reg as ConfigKey);
    if (_t) {
      result[reg] = _t;
      return result;
    }

    const keys = Object.keys(this._object);
    const matches = keys.filter(k => new RegExp(reg).test(k));
    matches.forEach(m => (result[m] = this.get(m as ConfigKey)));
    return result;
  }

  public set(key: ConfigKey, value?: string) {
    if (!value) return;

    const old = this._object[key];
    if (old !== value) {
      LoggerService.log(LOGGER_CONFIG, `update config of ${key} to ${value} (old=${old})`);

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
      } else {
        return res();
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
        rl.question(Colorize.format`{dim ?} {greenBright ${q}}: `, answer => {
          LoggerService.log(LOGGER_CONFIG, `the answer of ${q} is ${answer}`);
          return res(answer);
        });
      });
    };

    const end = () => {
      return new Promise<this>(res => {
        rl.close(); // stop listen key event
        res(this);
      });
    };

    return questionPromise("Input your token")
      .then(token => {
        this.set("auth.token", token);
        return questionPromise("Input your name");
      })
      .then(name => {
        this.set("auth.name", name);
        return questionPromise("Input your salt");
      })
      .then(salt => {
        this.set("auth.salt", salt);
        return end();
      });
  }

  public restore(): ConfigSchema {
    this._object = {
      "mode": "production",
      "version": "v1",
      "auth.token": "please_enter_your_token",
      "auth.name": "please_enter_your_name",
      "auth.salt": "please_enter_your_salt",
      "output.color": true,
      "output.file": true,
      "output.level": "1",
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

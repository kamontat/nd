import fs from "fs";
import LoggerService, { LOGGER_FILE } from "nd-logger";
import { ThreadManager } from "nd-thread";
import path from "path";
import util from "util";

import { ErrorCallback, ErrorManager, ErrorType } from "./ErrorManager";

interface IFileOption {
  force?: boolean;
}

interface IMultithreadValue {
  content: string;
  filename: string;
  opts: IFileOption;
}

export class FileManager extends ThreadManager<undefined, IMultithreadValue, undefined> {
  public get path() {
    return this.directory;
  }

  private _error: ErrorManager;

  constructor(private directory: string, name?: string, thread?: number) {
    super(thread);

    this._error = new ErrorManager();
    if (name) this.directory = this.buildPath(name); // append name to directory
  }

  public load() {
    if (!fs.existsSync(this.directory)) {
      LoggerService.log(LOGGER_FILE, `base directory is not exist (${this.directory})`);
      fs.mkdirSync(this.directory, { recursive: true });
    } else {
      const lists = fs.readdirSync(this.directory);
      if (lists.length > 0) this._error.execute("folder-not-empty", { path: this.directory, again: () => this.load() });
    }
  }

  public move(fileName: string, nextFileName: string) {
    const current = path.isAbsolute(fileName) ? fileName : path.resolve(this.directory, fileName);
    const next = path.isAbsolute(nextFileName) ? nextFileName : path.resolve(this.directory, nextFileName);

    LoggerService.log(LOGGER_FILE, `change file name from ${current} to ${next}`);

    const move = util.promisify(fs.rename);
    return move(current, next);
  }

  public moveSync(fileName: string, nextFileName: string) {
    const current = path.isAbsolute(fileName) ? fileName : path.resolve(this.directory, fileName);
    const next = path.isAbsolute(nextFileName) ? nextFileName : path.resolve(this.directory, nextFileName);

    LoggerService.log(LOGGER_FILE, `change file name from ${current} to ${next}`);

    return fs.renameSync(current, next);
  }

  public name(name?: string) {
    if (!name) return;

    this.directory = this.buildPath(name); // append name to directory

    if (!fs.existsSync(this.directory)) {
      LoggerService.log(LOGGER_FILE, `extend directory is not exist (${this.directory})`);
      fs.mkdirSync(this.directory, { recursive: true });
    } else {
      const lists = fs.readdirSync(this.directory);
      if (lists.length > 0)
        this._error.execute("folder-not-empty", {
          path: this.directory,
          again: () => {
            this.load();
          },
        });
    }
  }

  public onError(type: ErrorType, callback: ErrorCallback) {
    this._error.set(type, callback);
  }

  /**
   * this method for single thread loading
   *
   * @param content file content
   * @param fileName filename (without path)
   * @param _opts saving option
   */
  public save(content: string, fileName: string, _opts?: IFileOption) {
    const opts = Object.assign({ force: false }, _opts);
    LoggerService.log(LOGGER_FILE, `save async file with option=%O`, opts);

    const isExist = util.promisify(fs.exists);
    const writeFile = util.promisify(fs.writeFile);

    const p = this.buildPath(fileName);

    return isExist(p).then(exist => {
      if (exist && opts.force) {
        LoggerService.log(LOGGER_FILE, `force save file even it already exist`);
        return writeFile(p, content, { encoding: "utf8", mode: 0o666, flag: "w" });
      } else if (!exist) {
        LoggerService.log(LOGGER_FILE, `save file to path=${p}`);
        return writeFile(p, content, { encoding: "utf8", mode: 0o666, flag: "w" });
      } else {
        LoggerService.log(LOGGER_FILE, `file already exist`);
        this._error.execute("file-exist", { path: p });
        return new Promise((_, rej) => rej(new Error("cannot save file because it already exist")));
      }
    }) as Promise<undefined>;
  }

  /**
   * same as save but with sync function
   *
   * @param content
   * @param fileName
   * @param _opts
   * @see FileManager.save method
   */
  public saveSync(content: string, fileName: string, _opts?: IFileOption) {
    const opts = Object.assign({ force: false }, _opts);
    LoggerService.log(LOGGER_FILE, `save sync file with option=%O`, opts);

    const p = this.buildPath(fileName);
    if (!fs.existsSync(p) || opts.force) {
      fs.writeFileSync(p, content, { encoding: "utf8", mode: 0o666, flag: "w" });
    } else {
      LoggerService.log(LOGGER_FILE, `file already exist`);
      this._error.execute("file-exist", { path: p });
    }
  }

  protected transform(t: IMultithreadValue) {
    return this.save(t.content, t.filename, t.opts);
  }

  private buildPath(name?: string) {
    if (!name) return this.directory;
    return path.resolve(this.directory, name);
  }
}

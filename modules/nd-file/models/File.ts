import fs from "fs";
import LoggerService, { LOGGER_FILE } from "nd-logger";
import path from "path";
import util from "util";

import { ErrorCallback, ErrorManager, ErrorType } from "../manager/ErrorManager";

interface IForceFileOption {
  force: true;
  tmp?: string;
}

interface INormalFileOption {
  force?: false;
}

type IFileOption = IForceFileOption | INormalFileOption;

export interface IWriteFileOption {
  content: string;
  filename: string;
  opts?: IFileOption;
}

export interface IReadFileOption {
  alias?: string;
  filename: string;
}

export default class File {
  public get directory() {
    return this._directory;
  }

  private _error: ErrorManager;

  constructor(private _directory: string, name?: string) {
    this._error = new ErrorManager();
    if (name) this._directory = this.buildPath(name); // append name to directory
  }

  /**
   * This method is for load current directory to file system.
   * You must call this method before perform any action on this object.
   *
   * Except: If you already called name() is work as the same thing
   */
  public load() {
    if (!fs.existsSync(this.directory)) {
      LoggerService.log(LOGGER_FILE, `base directory is not exist (${this.directory})`);
      fs.mkdirSync(this.directory, { recursive: true });
    } else {
      const lists = fs.readdirSync(this.directory);
      if (lists.length > 0) this._error.execute("folder-not-empty", { path: this.directory, again: () => this.load() });
    }
  }

  /**
   * If you call this method. load() is a optional because this method already combine load()
   * @param name
   */
  public name(name?: string) {
    if (!name) return;

    this._directory = this.buildPath(name); // append name to directory
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
   * this will read content from the file and return the object of that content with filename is a key
   *
   * @param _obj read file object is a requirement value needed to read files
   *
   */
  public read(_obj: IReadFileOption) {
    const readFile = util.promisify(fs.readFile);
    return readFile(this.buildPath(_obj.filename)).then(b => {
      // key of object
      const k = _obj.alias ? _obj.alias : _obj.filename;
      // value of object
      const v = b.toString("utf8");
      // assign to object
      const o: { [key: string]: string } = {};
      o[k] = v;
      return o;
    });
  }

  /**
   * this is a read as sync task
   *
   * @param _obj reading object for readSync
   */
  public readSync(_obj: IReadFileOption) {
    const b = fs.readFileSync(this.buildPath(_obj.filename));
    // key of object
    const k = _obj.alias ? _obj.alias : _obj.filename;
    // value of object
    const v = b.toString("utf8");
    // assign to object
    const o: { [key: string]: string } = {};
    o[k] = v;
    return o;
  }

  /**
   * rename file from 'fileName' to 'nextFileName'
   *
   * @param fileName FROM file name; only file name with extension only
   * @param nextFileName TO file name;
   *
   * @returns promise is a Promise of void
   */
  public rename(fileName: string, nextFileName: string) {
    const current = path.isAbsolute(fileName) ? fileName : path.resolve(this.directory, fileName);
    const next = path.isAbsolute(nextFileName) ? nextFileName : path.resolve(this.directory, nextFileName);

    LoggerService.log(LOGGER_FILE, `change file name from ${current} to ${next}`);

    const move = util.promisify(fs.rename);
    return move(current, next);
  }

  /**
   * rename file from 'fileName' to 'nextFileName'
   *
   * @param fileName FROM file name; only file name with extension only
   * @param nextFileName TO file name;
   */
  public renameSync(fileName: string, nextFileName: string) {
    const current = path.isAbsolute(fileName) ? fileName : path.resolve(this.directory, fileName);
    const next = path.isAbsolute(nextFileName) ? nextFileName : path.resolve(this.directory, nextFileName);

    LoggerService.log(LOGGER_FILE, `change file name from ${current} to ${next}`);

    return fs.renameSync(current, next);
  }

  /**
   * this method will write some content from object and write to the file system
   *
   * @param _obj write file object is require to use this and write to the file
   *
   * @return promise is a Promise of void
   */
  public write(_obj: IWriteFileOption) {
    const obj = Object.assign({ opts: { force: false, encoding: "utf8", mode: 0o666, flag: "w" } }, _obj);
    LoggerService.log(LOGGER_FILE, `save async file with option=%O`, obj.opts);

    const isExist = util.promisify(fs.exists);
    const writeFile = util.promisify(fs.writeFile);

    const p = this.buildPath(obj.filename);

    return isExist(p).then(exist => {
      if (exist && obj.opts.force) {
        if (obj.opts.tmp) {
          const newPath = path.resolve(path.dirname(p), obj.opts.tmp);
          LoggerService.log(LOGGER_FILE, `force save file but create cache at ${newPath}`);
          return this.rename(p, newPath).then(() => writeFile(p, obj.content, obj.opts));
        } else {
          LoggerService.log(LOGGER_FILE, `hard force save file`);
          return writeFile(p, obj.content, obj.opts);
        }
      } else if (!exist) {
        LoggerService.log(LOGGER_FILE, `save file to path=${p}`);
        return writeFile(p, obj.content, obj.opts);
      } else {
        LoggerService.log(LOGGER_FILE, `file already exist`);
        this._error.execute("file-exist", { path: p });
        return new Promise((_, rej) => rej(new Error("cannot save file because it already exist")));
      }
    }) as Promise<void>;
  }

  private buildPath(name?: string) {
    if (!name) return this.directory;
    return path.resolve(this.directory, name);
  }
}

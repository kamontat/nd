import fs from "fs";
import LoggerService, { LOGGER_FILE } from "nd-logger";
import path from "path";

import { ErrorCallback, ErrorManager, ErrorType } from "./ErrorManager";

export class FileManager {
  private _error: ErrorManager;

  public get path() {
    return this.directory;
  }

  constructor(private directory: string, name?: string) {
    this._error = new ErrorManager();
    if (name) this.directory = this.buildPath(name); // append name to directory
  }

  public load() {
    if (!fs.existsSync(this.directory)) {
      LoggerService.log(LOGGER_FILE, `base directory is not exist (${this.directory})`);
      fs.mkdirSync(this.directory, { recursive: true });
    } else {
      const lists = fs.readdirSync(this.directory);
      if (lists.length > 0) this._error.execute("folder-not-empty", this.directory);
    }
  }

  public name(name?: string) {
    if (!name) return;

    this.directory = this.buildPath(name); // append name to directory

    if (!fs.existsSync(this.directory)) {
      LoggerService.log(LOGGER_FILE, `extend directory is not exist (${this.directory})`);
      fs.mkdirSync(this.directory, { recursive: true });
    } else {
      const lists = fs.readdirSync(this.directory);
      if (lists.length > 0) this._error.execute("folder-not-empty", this.directory);
    }
  }

  public onError(type: ErrorType, callback: ErrorCallback) {
    this._error.set(type, callback);
  }

  public save(content: string, fileName: string, opts?: { force?: boolean }) {
    const defaultOptions = {
      force: false,
      ...opts,
    };

    LoggerService.log(LOGGER_FILE, `save to file with option=%O`, defaultOptions);

    const p = this.buildPath(fileName);
    if (!fs.existsSync(p) || defaultOptions.force) {
      LoggerService.log(LOGGER_FILE, `force save file even it already exist`);
      fs.writeFileSync(p, content, { encoding: "utf8", mode: 0o666, flag: "w" });
    } else {
      LoggerService.log(LOGGER_FILE, `file already exist`);
      this._error.execute("file-exist", p);
    }
  }

  private buildPath(name: string) {
    return path.resolve(this.directory, name);
  }
}

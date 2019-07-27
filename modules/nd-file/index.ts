import fs from "fs";
import LoggerService, { LOGGER_FILE } from "nd-logger";
import path from "path";

import Package from "./package.json";

type ErrorType = "folder-not-empty" | "file-exist" | "folder-not-found";
type ErrorCallback = (path: string) => void;

const EmptyCallback = () => {};

export default class FileManager {
  private _errors: Map<ErrorType, ErrorCallback>;

  public get path() {
    return this.directory;
  }

  constructor(private directory: string, name?: string) {
    this._errors = new Map();

    if (name) this.directory = this.buildPath(name); // append name to directory

    if (!fs.existsSync(this.directory)) {
      LoggerService.log(LOGGER_FILE, `base directory is not exist (${this.directory})`);
      fs.mkdirSync(this.directory, { recursive: true });
    } else {
      const lists = fs.readdirSync(this.directory);
      if (lists.length > 0) this._emitError("folder-not-empty");
    }
  }

  public name(name?: string) {
    if (!name) return;

    this.directory = this.buildPath(name); // append name to directory

    if (!fs.existsSync(this.directory)) {
      LoggerService.log(LOGGER_FILE, `extend directory is not exist (${this.directory})`);
      fs.mkdirSync(this.directory, { recursive: true });
    }
  }

  public onError(type: ErrorType, callback: ErrorCallback) {
    this._errors.set(type, callback);
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
      this._emitError("file-exist", p);
    }
  }

  private _emitError(type: ErrorType, p?: string) {
    if (this._errors.has(type)) {
      const callback = this._errors.get(type) || EmptyCallback;
      callback(p || this.directory);
    }
  }

  private buildPath(name: string) {
    return path.resolve(this.directory, name);
  }
}

export { Package };

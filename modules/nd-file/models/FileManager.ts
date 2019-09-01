import ExceptionService, { ERR_FLE } from "nd-error";
import LoggerService, { LOGGER_FILE } from "nd-logger";
import path from "path";

import { FileType } from "./enum";
import {
  FileInput,
  FindOptions,
  IFileFileInput,
  IFileOutput,
  IFindFileInput,
  IFindInput,
  ILoadOptions,
  RenameOptions,
  WriteOption,
} from "./interface/defined";

export abstract class FileManager {
  public get directory() {
    return this._directory;
  }
  public get loaded() {
    return this._loaded;
  }

  public get type() {
    return this._type;
  }

  protected _loaded: boolean;
  protected _type: FileType;

  constructor(protected _directory: string, input?: FileInput) {
    if (!input) {
      LoggerService.log(LOGGER_FILE, `fallback to DIR since no file type exist`);
      this._type = FileType.DIR;
    } else {
      LoggerService.log(LOGGER_FILE, `custom type input`);
      this._type = input.type;
      this._directory = this.buildPath(input.name);
    }

    LoggerService.log(LOGGER_FILE, `start ${this._type} ${this._directory} on file manager`);

    this._loaded = false;
  }

  public abstract find(input: IFindFileInput, opts?: FindOptions): string[] | Promise<string[]>;

  public join(name: string) {
    return this.buildPath(name);
  }

  public abstract load(opts?: ILoadOptions): any;

  public name(input: FileInput, opts?: ILoadOptions): any {
    if (this.isFile(input)) {
      throw ExceptionService.build(ERR_FLE, "[TECH] you input is already files; cannot load with name()");
    }

    this._type = input.type;
    this._directory = this.buildPath(input.name);

    return this.load(opts);
  }

  public abstract read(input?: IFileFileInput): string | Promise<string>;

  public abstract rename(input: string, output: string, opts?: RenameOptions): boolean | Promise<boolean>;

  public reset(_directory: string, input?: FileInput) {
    this._directory = _directory;
    if (!input) {
      this._type = FileType.DIR;
    } else {
      this._type = input.type;
      this._directory = this.buildPath(input.name);
    }

    return this;
  }

  public toString() {
    return `${this.type}: ${this.directory}`;
  }

  public abstract write(content: string, fileName?: string, opts?: WriteOption): boolean | Promise<boolean>;
  public abstract write(content: string, opts?: WriteOption): boolean | Promise<boolean>;

  /**
   * To implement this class, you must call this method in load()
   */
  protected _load() {
    this._loaded = true;
  }

  protected buildPath(name?: string) {
    if (!name) return this.directory;
    return path.resolve(this.directory, name);
  }

  protected isFile(input?: FileInput) {
    return this.type === FileType.FILE && input !== undefined;
  }

  /**
   * @param opts is a client options input
   * @param def is a default option incase client didn't input anything
   */
  protected options<O>(opts: O | undefined, def: O) {
    return Object.assign(def, opts);
  }

  protected abstract walk(directory?: IFindInput, limit?: number): IFileOutput[] | Promise<IFileOutput[]>;
}

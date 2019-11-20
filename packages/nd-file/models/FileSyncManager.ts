import fs from "fs";
import ExceptionService, { ERR_FLE } from "@nd/error";
import LoggerService, { LOGGER_FILE } from "@nd/logger";
import path from "path";

import { FileLoadResult, FileType } from "./enum";
import { FileManager } from "./FileManager";
import {
  _IFindInput,
  FileInput,
  FindOptions,
  IFileFileInput,
  IFileOutput,
  IFindFileInput,
  IFindInput,
  ILoadOptions,
  INotForceWriteOption,
  IRenameOptions,
  WriteOption,
} from "./interface/defined";
import { IFileSyncManager } from "./interface/IFileSyncManager";

export default class FileSyncManager extends FileManager implements IFileSyncManager {
  constructor(directory: string, input?: FileInput) {
    super(directory, input);
  }

  // cannot use for find file content
  // this is only for find files in directory
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public find(input: IFindFileInput, opts?: FindOptions): any {
    if (this.type === FileType.FILE) throw ExceptionService.build(ERR_FLE, "cannot find content in type files");

    const options = this.options(opts, { recursive: true, limit: 3 });

    const lists = options.recursive
      ? this.walk({ type: input.type }, options.limit)
      : this.walk({ type: input.type }, 1);
    return lists.filter(f => input.name.test(f.path));
  }

  public load(opts?: ILoadOptions) {
    this._load();

    LoggerService.log(LOGGER_FILE, `loading... new directory to filesystem`);

    const options = this.options(opts, { create: true, tmp: undefined });
    const isExist = fs.existsSync(this.directory);
    LoggerService.log(LOGGER_FILE, `directory is ${isExist ? "already" : "not"} exist`);
    if (isExist) {
      if (this.type === FileType.FILE) {
        const content = this.read();
        if (content.length > 0) return FileLoadResult.NotEmp;
        else return FileLoadResult.Emp;
      } else if (this.type === FileType.DIR) {
        const lists = fs.readdirSync(this.directory);
        if (lists.length > 0) {
          if (options.tmp) {
            LoggerService.log(LOGGER_FILE, `option tmp exist; create caches folder first`);
            // caches file first
            this.rename(path.basename(this.directory), options.tmp, { recursive: true, once: true });
            fs.mkdirSync(this.directory, { recursive: true });
            return FileLoadResult.Ext; // exist
          }
          return FileLoadResult.NotEmp;
        } else return FileLoadResult.Emp;
      } else return FileLoadResult.Err;
    } else {
      if (options.create) {
        if (this.type === FileType.DIR) {
          LoggerService.log(LOGGER_FILE, `creating... directory: ${this.directory}`);
          fs.mkdirSync(this.directory, { recursive: true });
          return FileLoadResult.Ext; // exist
        } else {
          return FileLoadResult.NotExt; // not exist
        }
      } else {
        return FileLoadResult.NotExt; // not exist
      }
    }
  }

  public read(input?: IFileFileInput): string {
    if (!input) {
      // find all directory and sub directory
      return fs.readFileSync(this.directory).toString("utf8"); // read content in file
    } else {
      return fs.readFileSync(this.buildPath(input.name)).toString("utf8"); // read content in file
    }
  }

  public rename(input: string, output: string, opts?: IRenameOptions) {
    const options = this.options(opts, { recursive: false, once: false });
    LoggerService.log(LOGGER_FILE, `rename ${input} to ${output} with options %O`, options);

    let finalDirectory = "";
    let dir = this.directory;

    const p = this.buildPath(input);
    if (fs.existsSync(p)) {
      LoggerService.log(LOGGER_FILE, `input value is exist in file system; include that too`);
      dir = p;
    }

    const __array = dir.split(path.sep);
    const __last = __array.pop();
    if (!options.recursive) {
      if (__last) finalDirectory = __last.replace(input, output);
      else return false;
    } else {
      let limit = options.once ? 1 : -1;

      // recursive replacing string path
      const __newArray = __array.reverse().map(v => {
        // not replace anything
        if (limit === 0) return v;
        // reduce limit
        else if (limit > 0) {
          limit--;
        }
        // replace
        return v.replace(input, output);
      });

      // build path from replacing array
      finalDirectory = __newArray.reverse().join(path.sep);
    }

    LoggerService.log(LOGGER_FILE, `rename ${dir} => ${finalDirectory}`);
    fs.renameSync(dir, finalDirectory);
    return true;
  }

  public write(content: string, fileName?: string | WriteOption, opts?: WriteOption) {
    const defaultOption = {
      force: false,
    };

    let __options: WriteOption;
    let directory = this.directory;

    if (fileName === undefined) {
      __options = defaultOption as INotForceWriteOption; // pass only 1 param
    } else if (typeof fileName === "string") {
      directory = this.buildPath(fileName);
      __options = this.options(opts, defaultOption) as WriteOption; // pass 2 or 3 with fileName and/or options
    } else {
      __options = this.options(this.options(opts, fileName), defaultOption) as WriteOption; // pass 2 with only options
    }

    LoggerService.log(LOGGER_FILE, `write() to file with option %O`, __options);

    const exist = fs.existsSync(directory);
    // force create
    if (exist && __options.force) {
      if (__options.tmp) {
        const basename = path.basename(directory); // filename
        const tmpname = __options.tmp; // new filename

        LoggerService.log(LOGGER_FILE, `converting... ${basename} => ${tmpname} at ${path.dirname(directory)}`); // create caches to new path tmp first
        const createCachesResponse = this.rename(basename, tmpname, { recursive: false });
        if (!createCachesResponse) {
          LoggerService.log(LOGGER_FILE, `cannot create caches cause by some reason`);
          return false;
        }
      }

      // write content
      fs.writeFileSync(directory, content);
      return true;
      // save to content
    } else if (!exist) {
      fs.writeFileSync(directory, content);
      return true;
    } else {
      // error
      throw ExceptionService.build(
        ERR_FLE,
        `cannot normally save content to file (${directory}) because it already exist, you might consider to add --force ?`,
      );
    }
  }

  protected walk(opts?: IFindInput, limit?: number) {
    if (limit === 0) return [];

    const o = this.options(opts, { type: undefined, name: this.directory }) as _IFindInput;

    return fs.readdirSync(o.name).reduce((files: IFileOutput[], file: string) => {
      const current = path.join(o.name, file); // can be file | subdirectory
      const fileStat = fs.statSync(current);

      const _type = fileStat.isDirectory() ? FileType.DIR : FileType.FILE; // not support symbol-link

      if (o.type === undefined) {
        // load both file | directory
        files.push({ path: current, type: _type });
      } else if (o.type === _type) {
        // load only mtaches file type
        files.push({ path: current, type: _type });
      }

      // recursive subdirectory
      if (_type === FileType.DIR) {
        files.push(...this.walk(o, limit ? limit - 1 : undefined));
      }

      return files;
    }, []);
  }
}

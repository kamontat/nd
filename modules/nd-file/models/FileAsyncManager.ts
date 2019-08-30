import {
  exists as _exists,
  mkdir as _mkdir,
  readdir as _readdir,
  readFile as _readFile,
  rename as _rename,
  stat as _stat,
  writeFile as _writeFile,
} from "fs";
import ExceptionService, { ERR_FLE } from "nd-error";
import LoggerService, { LOGGER_FILE } from "nd-logger";
import { basename as getBasename, dirname as getDirname, join, sep } from "path";
import { promisify } from "util";

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
import { IFileASyncManager } from "./interface/IFileAsyncManager";

export default class FileASyncManager extends FileManager implements IFileASyncManager {
  constructor(directory: string, input?: FileInput) {
    super(directory, input);
  }

  public async find(input: IFindFileInput, opts?: FindOptions): Promise<any[]> {
    if (this.type === FileType.FILE) throw ExceptionService.build(ERR_FLE, "cannot find content in type files");

    const options = this.options(opts, { recursive: true, limit: 3 });

    const lists = options.recursive
      ? await this.walk({ type: input.type }, options.limit)
      : await this.walk({ type: input.type }, 1);

    return lists.filter(f => input.name.test(f.path));
  }

  public async load(opts?: ILoadOptions) {
    this._load();

    LoggerService.log(LOGGER_FILE, `loading... new directory to filesystem`);

    const exist = promisify(_exists);
    const readdir = promisify(_readdir);
    const mkdir = promisify(_mkdir);

    const options = this.options(opts, { create: true, tmp: undefined });
    const isExist = await exist(this.directory);
    LoggerService.log(LOGGER_FILE, `directory is ${isExist ? "already" : "not"} exist`);

    if (isExist) {
      if (this.type === FileType.FILE) {
        const content = await this.read();
        if (content.length > 0) return FileLoadResult.NotEmp;
        else return FileLoadResult.Emp;
      } else if (this.type === FileType.DIR) {
        const lists = await readdir(this.directory);
        if (lists.length > 0) {
          if (options.tmp) {
            LoggerService.log(LOGGER_FILE, `option tmp exist; create caches folder first`);
            // caches file first
            await this.rename(getBasename(this.directory), options.tmp, { recursive: true, once: true });
            await mkdir(this.directory, { recursive: true });
            return FileLoadResult.Ext; // exist
          }
          return FileLoadResult.NotEmp;
        } else return FileLoadResult.Emp;
      } else {
        return FileLoadResult.Err; // unknown result
      }
    } else {
      if (options.create) {
        if (this.type === FileType.DIR) {
          LoggerService.log(LOGGER_FILE, `creating... directory: ${this.directory}`);
          await mkdir(this.directory, { recursive: true });
          return FileLoadResult.Ext; // exist
        } else {
          return FileLoadResult.NotExt; // not exist
        }
      } else {
        return FileLoadResult.NotExt; // not exist
      }
    }
  }

  public async read(input?: IFileFileInput): Promise<string> {
    const readFile = promisify(_readFile);
    const directory = input ? this.buildPath(input.name) : this.directory;
    const buffer = await readFile(directory);
    return buffer.toString("utf8");
  }

  public async rename(input: string, output: string, opts?: IRenameOptions) {
    const options = this.options(opts, { recursive: false, once: false });
    LoggerService.log(LOGGER_FILE, `rename ${input} to ${output} with options %O`, options);

    const exist = promisify(_exists);
    const rename = promisify(_rename);

    let finalDirectory = "";
    let dir = this.directory;

    const p = this.buildPath(input);
    const isExist = await exist(p);

    if (isExist) {
      LoggerService.log(LOGGER_FILE, `input value is exist in file system; include that too`);
      dir = p;
    }

    const __array = dir.split(sep);
    const __last = __array.pop();

    if (!options.recursive) {
      if (__last) finalDirectory = __last.replace(input, output);
      else {
        LoggerService.log(LOGGER_FILE, "cannot get latest path for recursive rename");
        return false;
      }
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
      finalDirectory = __newArray.reverse().join(sep);
    }

    LoggerService.log(LOGGER_FILE, `rename ${dir} => ${finalDirectory}`);
    await rename(dir, finalDirectory);

    return true;
  }

  public async write(content: string, fileName?: string | WriteOption, opts?: WriteOption) {
    const defaultOption = {
      force: false,
    };

    const exist = promisify(_exists);
    const write = promisify(_writeFile);

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

    const isExist = await exist(directory);
    // force create
    if (isExist && __options.force) {
      if (__options.tmp) {
        const basename = getBasename(directory); // filename
        const tmpname = __options.tmp; // new filename

        LoggerService.log(LOGGER_FILE, `converting... ${basename} => ${tmpname} at ${getDirname(directory)}`); // create caches to new path tmp first

        const createCachesResponse = await this.rename(basename, tmpname, { recursive: false });
        if (!createCachesResponse) {
          LoggerService.log(LOGGER_FILE, `cannot create caches cause by some reason`);
          return false;
        }
      }

      // write content
      await write(directory, content);
      return true;
      // save to content
    } else if (!exist) {
      await write(directory, content);
      return true;
    } else {
      // error
      throw ExceptionService.build(
        ERR_FLE,
        `cannot normally save content to file (${directory}) because it already exist, you might consider to add --force ?`,
      );
    }
  }

  protected async walk(directory?: IFindInput, limit?: number) {
    if (limit === 0) return [];

    const readdir = promisify(_readdir);
    const stat = promisify(_stat);

    const o = this.options(directory, { type: undefined, name: this.directory }) as _IFindInput;

    const list = await readdir(o.name);
    return list.reduce(async (_files, file) => {
      const files = await _files;
      const current = join(o.name, file);
      const fileStat = await stat(current);
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
        const __recursiveResults = await this.walk(o, limit ? limit - 1 : undefined);
        files.push(...__recursiveResults);
      }

      return files;
    }, new Promise<Array<IFileOutput>>(res => res([])));
  }
}

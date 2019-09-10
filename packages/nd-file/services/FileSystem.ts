import { IException } from "nd-error";
import LoggerService, { LOGGER_FILE } from "nd-logger";
import { ThreadManager } from "nd-thread";

import { FileAction, FileType } from "../models/enum";
import FileASyncManager from "../models/FileAsyncManager";
import { FileInput, ILoadOptions } from "../models/interface/defined";
import { IFileASyncManager } from "../models/interface/IFileAsyncManager";

import { SystemAdder } from "./interface";
import SystemResponse from "./SystemResponse";

export default class extends ThreadManager<string, SystemAdder, undefined, SystemResponse, undefined> {
  public get directory() {
    return this.manager.directory;
  }
  private manager: IFileASyncManager;

  constructor(directory: string, thread?: number) {
    super(thread);
    this.manager = new FileASyncManager(directory);
  }

  public append(input: FileInput, opts?: ILoadOptions) {
    return this.manager.name(input, opts);
  }

  public async run() {
    if (!this.manager.loaded) await this.manager.load({ create: true, tmp: undefined });

    return this._each(async elem => {
      // LoggerService.log(LOGGER_FILE, `start file system ran: ${elem}`);

      if (elem.value.action === FileAction.READ) {
        return this.manager
          .read({ name: elem.value.name, type: FileType.FILE })
          .then(content =>
            this.promify(this.setOption(SystemResponse.singleton().__set(elem.key, elem.value, content))),
          );
      } else if (elem.value.action === FileAction.WRITE) {
        return this.manager
          .write(elem.value.content, elem.value.name, elem.value.opts)
          .then(content =>
            this.promify(this.setOption(SystemResponse.singleton().__set(elem.key, elem.value, content))),
          );
      }
    }).then(() => this.option(SystemResponse.singleton()));
  }

  private promify<T>(v: T, err?: IException) {
    return new Promise<T>((res, rej) => {
      if (err) rej(err);
      else res(v);
    });
  }
}

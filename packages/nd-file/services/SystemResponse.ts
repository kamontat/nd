import ExceptionService, { ERR_FLE } from "@nd/error";
import LoggerService, { LOGGER_FILE } from "@nd/logger";

import { FileAction } from "../models/enum";

import { SystemAdder } from "./interface";

interface IResponseFromRead {
  action: FileAction.READ;
  filename: string;
  result: string;
}

interface IResponseFromWrite {
  action: FileAction.WRITE;
  filename: string;
  result: boolean;
}

type Response = IResponseFromWrite | IResponseFromRead;

type Alias = string;

export default class SystemResponse {
  private static instance: SystemResponse;
  private map: Map<Alias, Response>;

  constructor() {
    this.map = new Map();
  }

  public static singleton() {
    if (!SystemResponse.instance) SystemResponse.instance = new SystemResponse();

    return SystemResponse.instance;
  }

  public __set(key: string, value: SystemAdder, result: boolean | string) {
    if (this.map.has(key)) {
      LoggerService.warn(LOGGER_FILE, `cannot set ${key} to response from file system; it seem to be already exist.`);
    } else {
      this.map.set(key, { action: value.action, filename: value.name, result } as Response);
    }

    return this;
  }

  public get(alias: string) {
    if (this.map.has(alias)) {
      return this.map.get(alias) as Response;
    } else {
      throw ExceptionService.build(ERR_FLE, `[TECH] this alias '${alias}' is not exist from system response`);
    }
  }
}

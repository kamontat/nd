import LoggerService from "nd-logger";
import Logger from "nd-logger/models/Logger";

import { ERR_GNL } from "../constants";

import { IExceptionState } from "./IExceptionState";

declare var __NODE_ENV__: string;

export default class Exception extends Error {
  public get warn() {
    this._exit = false;
    return this;
  }

  private env: string;

  private printProduction<T extends Logger>(log: T) {
    if (this._exit) LoggerService.error(log, this.message);
    else LoggerService.warn(log, this.message);
    return this;
  }

  constructor(private _code: IExceptionState, description?: string, private _exit: boolean = true) {
    super(``);

    this.name = _code.code;
    this.message = _code.buildMessage(description);
    this.env = __NODE_ENV__;
  }

  public description(d: string) {
    this.message = d; // override message with description
    return this;
  }

  public print<T extends Logger>(log: T) {
    if (this.env === "production") return this.printProduction(log);
    if (this._exit) LoggerService.error(log, "%O", this);
    else LoggerService.warn(log, "%O", this);
    return this;
  }

  public exit(code: number = 1) {
    if (this._exit) process.exit(code);
  }

  public static cast<T extends Error>(e: T, opts?: { base?: IExceptionState }): Exception {
    if (e instanceof Exception) return e;
    return new Exception(!opts || !opts.base ? ERR_GNL : opts.base, e.message);
  }
}

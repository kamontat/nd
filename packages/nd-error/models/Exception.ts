import LoggerService from "nd-logger";
import Logger from "nd-logger/models/Logger";

import { ERR_GNL } from "../constants";

import { IExceptionState, MessageType } from "./IExceptionState";

declare var __NODE_ENV__: string;

export default class Exception extends Error {
  public get warn() {
    this._exit = false;
    this.message = this._code.buildMessage(MessageType.WARNING, this._description);
    return this;
  }

  private _description: string;
  private env: string;

  constructor(private _code: IExceptionState, description?: string | Error, private _exit: boolean = true) {
    super(``);

    this.env = __NODE_ENV__;
    if (description === undefined || description === null) this._description = `Error: ${_code.name}`;
    else if (typeof description === "string") this._description = description || "";
    else
      this._description =
        this.env === "production"
          ? (description as Error).message
          : `${(description as Error).message}\n${(description as Error).stack}`;

    this.name = _code.code;
    this.message = _code.buildMessage(_exit ? MessageType.ERROR : MessageType.WARNING, this._description);
  }

  public static cast<T extends Error>(e: T, opts?: { base?: IExceptionState }): Exception {
    if (e instanceof Exception) return e;

    return new Exception(!opts || !opts.base ? ERR_GNL : opts.base, e);
  }

  public description(d: string) {
    this.message = d; // override message with description
    return this;
  }

  public exit(code: number = 1) {
    if (this._exit) process.exit(code);
  }

  public print<T extends Logger>(log: T) {
    if (this.env === "production") return this.printProduction(log);
    if (this._exit) LoggerService.error(log, "%O", this);
    else LoggerService.warn(log, "%O", this);
    return this;
  }

  private printProduction<T extends Logger>(log: T) {
    if (this._exit) LoggerService.error(log, this.message);
    else LoggerService.warn(log, this.message);
    return this;
  }
}

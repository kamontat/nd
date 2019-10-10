import LoggerService, { Logger } from "@nd/logger";
import { RandomUtils } from "@nd/helper";

import { ERR_GNL } from "../constants";

import { IExceptionState, MessageType } from "./IExceptionState";

declare let __NODE_ENV__: string;
const NODE_ENV = process.env.NODE_ENV === "test" ? "" : __NODE_ENV__;

export default class Exception extends Error {
  public get warn() {
    this._exit = false;
    this.message = this._code.buildMessage(MessageType.WARNING, this._description);
    return this;
  }

  public get isWarn() {
    return !this._exit;
  }

  public get id() {
    return this._id;
  }

  private _id: string;
  private _description: string | undefined;
  private env: string;

  constructor(private _code: IExceptionState, description?: string | Error, private _exit: boolean = true) {
    super(``);
    this._id = RandomUtils.RandomString(30);

    this.env = NODE_ENV;

    if (description instanceof Error)
      this._description = this.env === "production" ? description.message : description.stack;
    else this._description = description;

    this.name = _code.code;
    this.message = _code.buildMessage(_exit ? MessageType.ERROR : MessageType.WARNING, this._description);
  }

  public static cast<T extends Error>(e: T, opts?: { base?: IExceptionState }): Exception {
    if (e instanceof Exception) return new Exception(e._code, e._description, e._exit);

    return new Exception(!opts || !opts.base ? ERR_GNL : opts.base, e);
  }

  public description(d: string) {
    this.message = d; // override message with description
    return this;
  }

  public exit(code = 1) {
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

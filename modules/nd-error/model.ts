import LoggerService from "nd-logger";
import Logger from "nd-logger/models/Logger";

import { ERR_GNL, ExceptionState } from "./constants";

export default class Exception extends Error {
  constructor(private _code: ExceptionState) {
    super(``);

    this.name = _code.code;
    this.message = Exception.buildMessage(_code);
  }

  public description(d: string) {
    this.message = d; // override message with description
    return this;
  }

  public print<T extends Logger>(log: T) {
    if (this._code.exit) LoggerService.error(log, "%O", this);
    else LoggerService.warn(log, "%O", this);
    return this;
  }

  public exit(code: number = 1) {
    if (this._code.exit) process.exit(code);
  }

  public static cast<T extends Error>(e: T, opts?: { base?: ExceptionState }): Exception {
    if (e instanceof Exception) return e;
    const exp = new Exception(!opts || !opts.base ? ERR_GNL : opts.base);
    exp.description(e.message);
    return exp;
  }

  public static buildMessage(exp: ExceptionState) {
    return `${exp.name}`;
  }

  public static build(code: ExceptionState) {
    return new Exception(code);
  }
}

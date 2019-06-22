import LoggerService from "nd-logger";
import Logger from "nd-logger/models/Logger";

import { ExceptionState } from "./constants";

export default class Exception extends Error {
  constructor(_code: ExceptionState) {
    super(``);

    this.name = _code.name;
    this.message = Exception.buildMessage(_code);
  }

  public description(d: string) {
    this.message = d; // override message with description
    return this;
  }

  public print(log: Logger) {
    LoggerService.error(log, "%O", this);
    return this;
  }

  public exit(code: number = 1) {
    process.exit(code);
  }

  public static buildMessage(exp: ExceptionState) {
    return `${exp.code}: ${exp.name}`;
  }

  public static build(code: ExceptionState) {
    return new Exception(code);
  }
}

import debug from "debug";
import { config } from "nd-config";

import CheckerUtils from "../apis/checker";
import Logger from "../models/Logger";

export default class LoggerService {
  public static console = {
    log(message?: any, ...other: any[]) {
      const level = config.get("output.level");
      if (level !== "0" && debug.enabled("nd:*")) console.log(message, ...other);
    },
  };

  public static disable() {
    debug.disable();
  }

  public static enable(name: string) {
    debug.enable(name);
  }

  public static error<T extends Logger>(log: T, message: any, ...args: any[]) {
    log
      .stderr()
      .extend("error")
      .debug(message, ...args);
  }

  public static level(level: number | string) {
    if (CheckerUtils.CheckWithNumber(0, level)) this.disable();
    else if (CheckerUtils.CheckWithNumber(1, level)) this.enable("nd*warn,nd*error");
    // print everything in nd command
    else if (CheckerUtils.CheckWithNumber(2, level)) this.enable("nd:*");
    // print everything of all nd command and libraries
    else if (CheckerUtils.CheckWithNumber(3, level)) this.enable("*");
  }

  public static log<T extends Logger>(log: T, message: any, ...args: any[]) {
    log.stdlog().debug(message, ...args);
  }

  public static warn<T extends Logger>(log: T, message: any, ...args: any[]) {
    log
      .stdlog()
      .extend("warn")
      .debug(message, ...args);
  }
}

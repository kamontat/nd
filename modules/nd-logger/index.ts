import debug from "debug";
import { config } from "nd-config";

import Logger from "./models/Logger";
import Package from "./package.json";

export default class LoggerService {
  public static console = {
    log(message?: any, ...other: any[]) {
      const level = config.get("output.level");
      if (level !== "0" && debug.enabled("nd:*")) console.log(message, ...other);
    },
  };

  public static log<T extends Logger>(log: T, message: any, ...args: any[]) {
    log.stdlog().debug(message, ...args);
  }

  public static warn<T extends Logger>(log: T, message: any, ...args: any[]) {
    log
      .stdlog()
      .extend("warn")
      .debug(message, ...args);
  }

  public static error<T extends Logger>(log: T, message: any, ...args: any[]) {
    log
      .stderr()
      .extend("error")
      .debug(message, ...args);
  }

  public static enable(name: string) {
    debug.enable(name);
  }

  public static disable() {
    debug.disable();
  }
}

export * from "./constants";

export { Package };

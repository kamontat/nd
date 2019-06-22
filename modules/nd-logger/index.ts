import debug from "debug";
import { config } from "nd-config";

import Logger from "./models/Logger";
import Package from "./package.json";

export default class LoggerService {
  public static console = {
    log(message?: any, ...other: any[]) {
      const level = config.get("output.level");
      if (level !== "0") console.log(message, ...other);
    },
  };

  public static log(log: Logger, message: any, ...args: any[]) {
    log.debug.log = console.log.bind(console);

    log.debug(message, ...args);
  }

  public static warn(log: Logger, message: any, ...args: any[]) {
    log.extend("warn").debug(message, ...args);
  }

  public static error(log: Logger, message: any, ...args: any[]) {
    log.extend("error").debug(message, ...args);
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

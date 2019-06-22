import Logger from "./models/Logger";
import Package from "./package.json";

export default class LoggerService {
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
}

export * from "./constants";

export { Package };

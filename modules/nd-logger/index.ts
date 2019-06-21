import Logger from "./models/Logger";
import Package from "./package.json";

export default class LoggerService {
  public static log(log: Logger, message: string) {
    log.debug.log = console.log.bind(console);
    log.debug(message);
  }

  public static warn(log: Logger, message: string) {
    log.debug(message);
  }

  public static error(log: Logger, message: string) {
    log.debug(message);
  }
}

export * from "./constants";

export { Package };

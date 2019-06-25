import debug, { Debugger } from "debug";

export default class Logger {
  private _logger: Debugger;
  constructor(namespace: string) {
    this._logger = debug(namespace);
  }

  public extend(namespace: string) {
    return new Logger(`${this._logger.namespace}:${namespace}`); // create new logger instance
  }

  public debug(format: any, ...args: any[]) {
    return this._logger(format, ...args);
  }

  get stdlog() {
    this._logger.log = console.log.bind(console);
    return this;
  }

  get stderr() {
    this._logger.log = console.error.bind(console);
    return this;
  }

  get enabled() {
    return this._logger.enabled;
  }
}

import debug, { Debugger } from "debug";

export type LoggerLevel = 0 | 1 | 2 | 3;

export default class Logger {
  get enabled() {
    return this._logger.enabled;
  }

  private _logger: Debugger;

  constructor(namespace: string) {
    this._logger = debug(namespace);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public debug(format: any, ...args: any[]) {
    return this._logger(format, ...args);
  }

  public extend(namespace: string) {
    return new Logger(`${this._logger.namespace}:${namespace}`); // create new logger instance
  }

  public stderr() {
    this._logger.log = console.error.bind(console);
    return this;
  }

  public stdlog() {
    this._logger.log = console.log.bind(console);
    return this;
  }
}

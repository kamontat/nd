import Logger from "../Logger";

type Callback = (event: LoggerEvent, format: any, ...args: any[]) => void;

export type LoggerEvent = "extend" | "debug";

export default class LoggerMock extends Logger {
  constructor(private callback: Callback) {
    super("nd:test");
  }

  public extend(namespace: string) {
    this.callback("extend", namespace);
    return new LoggerMock(this.callback); // create new logger instance
  }

  public debug(format: any, ...args: any[]) {
    return this.callback("debug", format, ...args);
  }
}
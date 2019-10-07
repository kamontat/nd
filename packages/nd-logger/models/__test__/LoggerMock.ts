import Logger from "../Logger";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Callback = (event: LoggerEvent, format: any, ...args: any[]) => void;

export type LoggerEvent = "extend" | "debug" | "stdlog" | "stderr";

export default class LoggerMock extends Logger {
  constructor(private callback: Callback) {
    super("nd:test");
  }

  public stdlog() {
    this.callback("stdlog", "");
    return super.stdlog();
  }

  public stderr() {
    this.callback("stderr", "");
    return super.stderr();
  }

  public extend(namespace: string) {
    this.callback("extend", namespace);
    return new LoggerMock(this.callback); // create new logger instance
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public debug(format: any, ...args: any[]) {
    super.debug(format, ...args); // try to called super too
    return this.callback("debug", format, ...args);
  }
}

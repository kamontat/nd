import Logger from "../Logger";

type Callback = (format: any, ...args: any[]) => void;

export default class LoggerMock extends Logger {
  constructor(private callback: Callback) {
    super("nd:test");
  }

  public debug(format: any, ...args: any[]) {
    return this.callback(format, ...args);
  }
}

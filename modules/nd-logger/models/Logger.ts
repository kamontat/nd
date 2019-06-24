import debug from "debug";

export default class Logger {
  protected debugger = debug;

  constructor(private _root: string) {}

  public extend(namespace: string) {
    return new Logger(`${this._root}:${namespace}`);
  }

  get debug() {
    return this.debugger(this._root);
  }
}

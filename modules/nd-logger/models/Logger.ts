import debug from "debug";

export default class Logger {
  constructor(private _root: string) {}

  public extend(namespace: string) {
    return new Logger(`${this._root}:${namespace}`);
  }

  get debug() {
    return debug(this._root);
  }
}

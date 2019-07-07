import LoggerService from "nd-logger";

interface Obj<V = string> {
  [key: string]: V;
}

type TransformFn = (key: string) => string;

export class ObjectTable {
  private title?: TransformFn;

  constructor(private _obj: Obj) {}

  public transformTitle(transform: TransformFn) {
    this.title = transform;
  }

  public build() {
    LoggerService.console.log();
  }
}

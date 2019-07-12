export interface IResponse<T> {
  readonly link: string;
  readonly file: string;

  code: number; // http status code
  result?: T; // should change to Html object

  isQuery(): boolean;

  copy<N>(): IResponse<N>;
}

export class Response<T = string> implements IResponse<T> {
  private _code: number;
  private _result?: T;

  set code(num: number) {
    this._code = num;
  }

  set result(res: T | undefined) {
    this._result = res;
  }

  get code() {
    return this._code;
  }

  get link() {
    return this._link;
  }

  get file() {
    return this._file;
  }

  get result(): T | undefined {
    return this._result;
  }

  constructor(private _link: string, private _file: string) {
    this._code = -1;
  }

  public isQuery() {
    return this._code !== -1;
  }

  public toString() {
    return `${this._link} (${this._code})`;
  }

  public copy<N>() {
    return {
      code: this.code,
      file: this.file,
      link: this.link,
    } as IResponse<N>;
  }

  public static HttpStatusCode = {
    OK: 200,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
  };
}

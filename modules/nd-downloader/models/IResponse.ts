export interface IResponse {
  readonly link: string;
  readonly file: string;

  code: number; // http status code
  result?: string; // should change to Html object

  isQuery(): boolean;
}

export class Response implements IResponse {
  private _code: number;
  private _result?: string;

  set code(num: number) {
    this._code = num;
  }

  set result(res: string | undefined) {
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

  get result(): string | undefined {
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

  public static HttpStatusCode = {
    OK: 200,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
  };
}

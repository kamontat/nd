import { IncomingHttpHeaders } from "http";

export interface IResponse<T> {
  code: number; // http status code
  readonly file: string;

  headers?: IncomingHttpHeaders;
  readonly link: string;
  result?: T; // should change to Html object

  copy<N>(): IResponse<N>;

  isQuery(): boolean;
}

export class Response<T = string> implements IResponse<T> {
  set code(num: number) {
    this._code = num;
  }

  get code() {
    return this._code;
  }

  get file() {
    return this._file;
  }

  set headers(h: IncomingHttpHeaders | undefined) {
    this._headers = h;
  }

  get headers() {
    return this._headers;
  }

  get link() {
    return this._link;
  }

  set result(res: T | undefined) {
    this._result = res;
  }

  get result(): T | undefined {
    return this._result;
  }

  public static HttpStatusCode = {
    OK: 200,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
  };
  private _code: number;

  private _headers?: IncomingHttpHeaders;
  private _result?: T;

  constructor(private _link: string, private _file: string) {
    this._code = -1;
  }

  public copy<N>() {
    return {
      code: this.code,
      file: this.file,
      link: this.link,
    } as IResponse<N>;
  }

  public isQuery() {
    return this._code !== -1;
  }

  public toString() {
    return `${this._link} (${this._code})`;
  }
}

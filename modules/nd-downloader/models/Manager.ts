import { IncomingMessage } from "http";
import ndDecoder from "nd-decoder";
import ExceptionService, { ERR_DWL } from "nd-error";
import LoggerService, { LOGGER_DOWNLOADER_DECODER, LOGGER_DOWNLOADER_MANAGER } from "nd-logger";
import { DeprecatedThreadManager } from "nd-thread";

import { HttpGet } from "../apis/HttpGet";

import { IResponse, Response } from "./IResponse";
import { IManagerEvent, ManagerEvent } from "./ManagerEvent";

interface IDownloadManagerVariable {
  completed: number;
  count: number;
  initTime: number;
}

export default class Manager<T> extends DeprecatedThreadManager<IDownloadManagerVariable, string, IResponse<T | string>> {
  public get event() {
    return this._event;
  }

  private _builder?: (r: IResponse<string>) => IResponse<T>;

  constructor(thread?: number, private _event: IManagerEvent<string> = new ManagerEvent()) {
    super(thread);
  }

  public add(link: string) {
    const res = new Response(link);
    this.event.emit("add", res);
    return super.add(link);
  }

  public build(buildingFn: (r: IResponse<string>) => IResponse<T>) {
    this._builder = buildingFn;
  }

  public run() {
    this.initVariable({ count: 0, completed: 0, initTime: +new Date() });
    return super.run();
  }

  protected transform(link: string, variable: IDownloadManagerVariable) {
    return this._download(link, this._variable || { count: 0, initTime: +new Date() }).then(value => {
      variable.completed++;

      let response: IResponse<T | string> = value.iresponse;

      response.headers = value.res.headers; // set header
      response.code = value.res.statusCode || -1; // set status code
      response.result = value.data; // set body

      this.event.emit("downloaded", response as IResponse<string>, variable.completed, this.size);

      if (this._builder) {
        LoggerService.log(LOGGER_DOWNLOADER_MANAGER, `start build own result`);

        response = this._builder(response as IResponse<string>);
        // This log is too long
        // LoggerService.log(LOGGER_DOWNLOADER_MANAGER, `build result: %O`, response.result);
      }

      return new Promise<IResponse<T | string>>(res => res(response));
    });
  }

  private _download(link: string, opts: { count: number; initTime: number }) {
    return new Promise<{ data: string; iresponse: IResponse<string>; res: IncomingMessage }>((res, rej) => {
      let start = +new Date(); // start

      HttpGet(link, response => {
        this.event.emit("header", response.headers);
        const contenttype = response.headers["content-type"] as string;
        const encode = contenttype.substring(contenttype.indexOf("=") + 1);
        LoggerService.log(LOGGER_DOWNLOADER_DECODER, `string encode format is ${encode}`);

        if (response.statusCode !== Response.HttpStatusCode.OK)
          return rej(
            ExceptionService.build(ERR_DWL).description(`downloading code is not ok (${response.statusCode})`),
          );

        let rawData = "";

        // when data received
        response.on("data", (chunk: Buffer) => {
          const str = ndDecoder(chunk, encode as any);

          const chunkSize = Buffer.byteLength(str);

          // LoggerService.log(LOGGER_DOWNLOADER, `${opts.count} + ${chunkSize}`);
          this.event.emit("downloading", opts.count, chunkSize, +new Date() - start, +new Date() - opts.initTime);
          start = +new Date(); // update start

          opts.count += chunkSize;

          rawData += str;
        });

        // when received whole data
        response.on("end", () => {
          res({ data: rawData, res: response, iresponse: new Response(link) });
        });
      }).on("error", (e: any) => {
        // internet not found; no internet
        if (e.code && e.code === "ENOTFOUND" && e.syscall && e.syscall === "getaddrinfo") {
          return rej(ExceptionService.build(ERR_DWL).description("no internet connection"));
        }
        return rej(e);
      });
    });
  }
}

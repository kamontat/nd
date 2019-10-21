import { IncomingMessage } from "http";
import ndDecoder from "@nd/decoder";
import ExceptionService, { ERR_DWL } from "@nd/error";
import LoggerService, { LOGGER_DOWNLOADER_DECODER, LOGGER_DOWNLOADER_MANAGER } from "@nd/logger";
import { ThreadManager } from "@nd/thread";

import { HttpGet } from "../apis/HttpGet";

import { IResponse, Response } from "./IResponse";
import { IManagerEvent, ManagerEvent } from "./ManagerEvent";

interface IDownloadOption {
  completed: number;
  count: number;
}

interface IDownloadOnetimeOption {
  initTime: number;
}

interface IError extends Error {
  code?: string;
  syscall?: string;
}

export default class Manager<T> extends ThreadManager<
  string,
  string,
  IResponse<T | string>,
  IDownloadOption,
  IDownloadOnetimeOption
> {
  public get event() {
    return this._event;
  }
  private _builder?: (r: IResponse<string>) => IResponse<T>;

  private counter: number;

  constructor(thread?: number, private _event: IManagerEvent<string> = new ManagerEvent()) {
    super(thread);

    this.counter = 0;
  }

  public add(link: string) {
    const res = new Response(link);
    this.event.emit("add", res);
    return super.add((this.counter++).toString(), link);
  }

  public build(buildingFn: (r: IResponse<string>) => IResponse<T>) {
    this._builder = buildingFn;
  }

  public run() {
    this.setOptionOnce(this.returnOnetimeOption());
    this.setOption(this.returnOption());
    return super._map(elem => this.transform(elem.value));
  }

  private _download(link: string) {
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
          const str = ndDecoder(chunk, encode as any); // eslint-disable-line @typescript-eslint/no-explicit-any

          const chunkSize = Buffer.byteLength(str);

          // LoggerService.log(LOGGER_DOWNLOADER, `${opts.count} + ${chunkSize}`);
          this.event.emit(
            "downloading",
            this.option(this.returnOption()).count,
            chunkSize,
            +new Date() - start,
            +new Date() - this.optionOnce({ initTime: +new Date() }).initTime,
          );
          start = +new Date(); // update start

          this.option(this.increase("count", chunkSize));

          rawData += str;
        });

        // when received whole data
        response.on("end", () => {
          res({ data: rawData, res: response, iresponse: new Response(link) });
        });
      }).on("error", (e: IError) => {
        // internet not found; no internet
        if (e.code && e.code === "ENOTFOUND" && e.syscall && e.syscall === "getaddrinfo") {
          return rej(ExceptionService.build(ERR_DWL).description("no internet connection"));
        }
        return rej(e);
      });
    });
  }

  private increase(t: "count" | "completed", num: number) {
    const old = this.option({ count: 0, completed: 0 });
    if (t === "count") old.count += num;
    else if (t === "completed") old.completed += num;
    return old;
  }

  private returnOnetimeOption() {
    return { initTime: +new Date() };
  }

  private returnOption() {
    return { count: 0, completed: 0 };
  }

  private transform(link: string) {
    return this._download(link).then(value => {
      this.setOption(this.increase("completed", 1));

      let response: IResponse<T | string> = value.iresponse;

      response.headers = value.res.headers; // set header
      response.code = value.res.statusCode || -1; // set status code
      response.result = value.data; // set body

      this.event.emit(
        "downloaded",
        response as IResponse<string>,
        this.option(this.returnOption()).completed,
        this.size,
      );

      if (this._builder) {
        LoggerService.log(LOGGER_DOWNLOADER_MANAGER, `start build own result`);

        response = this._builder(response as IResponse<string>);
        // This log is too long
        // LoggerService.log(LOGGER_DOWNLOADER_MANAGER, `build result: %O`, response.result);
      }

      return new Promise<IResponse<T | string>>(res => res(response));
    });
  }
}

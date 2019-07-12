import { eachOfLimit } from "async";
import { IncomingMessage } from "http";
import https from "https";
import Exception, { ERR_DWL } from "nd-error";
import LoggerService, { LOGGER_DOWNLOADER_MANAGER } from "nd-logger";

import { IResponse, Response } from "./IResponse";
import { IManagerEvent, ManagerEvent } from "./ManagerEvent";

export default class Manager {
  public get links() {
    return this.responses.map(r => r.link);
  }

  public get size() {
    return this.responses.length;
  }

  public get event() {
    return this._event;
  }
  private _event: IManagerEvent;
  private responses: IResponse[];

  private _userAgent() {
    const rand = Math.ceil(Math.random() * 4); // 1 - 4
    switch (rand) {
      case 1:
        return "Mozilla/5.0 (Windows NT 6.2; rv:20.0) Gecko/20121202 Firefox/20.0";
      case 2:
        return "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKi…7.36 (KHTML, like Gecko) Chrome/41.0.2227.1 Safari/537.36";
      case 3:
        return "Mozilla/5.0 (iPad; U; CPU iPad OS 5_0_1 like Mac OS X; en-…35.1+ (KHTML like Gecko) Version/7.2.0.0 Safari/6533.18.5";
      case 4:
        return "Opera/9.80 (X11; Linux x86_64; U; pl) Presto/2.7.62 Version/11.00";
      default:
        return "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.6; rv:25.0) Gecko/20100101 Firefox/25.0";
    }
  }

  // interface of get https with redirect 301 or 302
  private _get(url: string, callback: (res: IncomingMessage) => void) {
    const agent = this._userAgent();
    LoggerService.log(LOGGER_DOWNLOADER_MANAGER, `Random agent to ${agent}`);

    return https.get(
      url,
      {
        headers: {
          "user-agent": encodeURIComponent(agent),
          "accept": "text/html",
        },
      },
      response => {
        this.event.emit("header", response.headers);

        if (
          (response.statusCode === 300 || response.statusCode === 301 || response.statusCode === 302) &&
          response.headers.location
        ) {
          LoggerService.log(LOGGER_DOWNLOADER_MANAGER, `start redirect to ${response.headers.location}`);
          this._get(response.headers.location, callback);
        } else {
          callback(response);
        }
      },
    );
  }

  private _download(v: IResponse, opts: { count: number; initTime: number }) {
    return new Promise<{ data: string; res: IncomingMessage }>((res, rej) => {
      let start = +new Date(); // start

      this._get(v.link, response => {
        let rawData = "";

        response.on("data", (chunk: string) => {
          const contenttype = response.headers["content-type"] as string;
          const encode = contenttype.substring(contenttype.indexOf("=") + 1);
          LoggerService.log(LOGGER_DOWNLOADER_MANAGER, `Encode content is ${encode}`);

          const chunkSize = Buffer.byteLength(chunk, encode);

          // LoggerService.log(LOGGER_DOWNLOADER, `${opts.count} + ${chunkSize}`);
          this.event.emit("downloading", opts.count, chunkSize, +new Date() - start, +new Date() - opts.initTime);
          start = +new Date(); // update start

          opts.count += chunkSize;

          rawData += chunk;
        });

        response.on("end", () => {
          // console.log(rawData);
          res({ data: rawData, res: response });
        });

        if (response.statusCode !== Response.HttpStatusCode.OK)
          return rej(Exception.build(ERR_DWL).description(`downloading code is not ok (${response.statusCode})`));
      }).on("error", rej);
    });
  }

  constructor(private _thread: number = 2, event: IManagerEvent = new ManagerEvent()) {
    this._event = event;
    this.responses = [];
  }

  public add(link: string, file: string) {
    const res = new Response(link, file);

    this.event.emit("add", res);
    this.responses.push(res);
  }

  public run() {
    // tslint:disable-next-line
    let start = { count: 0, completed: 0, initTime: +new Date() };

    return ((eachOfLimit(this.responses, this._thread, (value, index, callback) => {
      this._download(value, start)
        .then(obj => {
          start.completed++;
          this.responses[index as number].code = obj.res.statusCode || -1;
          this.responses[index as number].result = obj.data;

          this.event.emit("downloaded", this.responses[index as number], start.completed, this.size);
          callback();
        })
        .catch(callback);
    }) as unknown) as Promise<Error | undefined>).then(err => {
      this.event.emit("end", err);
      return new Promise<IResponse[]>((res, rej) => {
        if (err) rej(err);
        else res(this.responses);
      });
    });
  }
}
import Event, { EventEmitter } from "events";
import { IncomingHttpHeaders } from "http";

import { IResponse, Response } from "./IResponse";

type EventType = "add" | "downloaded" | "end" | "header" | "downloading";

export interface IManagerEvent extends EventEmitter {
  emit(event: "add", link: Response): boolean;
  emit(event: "header", headers: IncomingHttpHeaders): boolean;
  emit(event: "downloading", previous: number, current: number, time: number, totalTime: number): boolean; // time as a milisecond
  emit(event: "downloaded", response: IResponse, progress: number, total: number): boolean;
  emit(event: "end", err?: Error): boolean;

  on(event: "add", listener: (link: Response) => void): this;
  on(event: "header", listener: (headers: IncomingHttpHeaders) => void): this;
  on(
    event: "downloading",
    listener: (previous: number, current: number, time: number, totalTime: number) => void,
  ): this;
  on(event: "downloaded", listener: (response: IResponse, progress: number, total: number) => void): this;
  on(event: "end", listener: (err?: Error) => void): this;
}

export class ManagerEvent extends Event implements IManagerEvent {
  constructor() {
    super();
  }

  public emit(event: EventType, ...args: any[]) {
    return super.emit(event, ...args);
  }

  public on(event: EventType, listener: (...args: any[]) => void) {
    return super.on(event, listener);
  }
}

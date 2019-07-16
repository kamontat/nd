import LoggerService, { LOGGER_NOVEL } from "nd-logger";

import { HistoryEvent } from "./HistoryEvent";
import { HistoryNode } from "./HistoryNode";

export class History {
  get event() {
    return {
      added(title: string, value: string) {
        LoggerService.log(LOGGER_NOVEL, `detecting added event ${title}: ${value}`);
      },
      modified(title: string, value: { after: string; before: string }) {
        LoggerService.log(LOGGER_NOVEL, `detecting modified event ${title}: (from ${value.before} => ${value.after})`);
      },
      deleted(title: string, value: string) {
        LoggerService.log(LOGGER_NOVEL, `detecting deleted event ${title}: ${value}`);
      },
    };
  }

  private static instance?: History;

  private nodes: HistoryNode[];
  private constructor() {
    this.nodes = [];
  }

  public static Get() {
    if (!History.instance) History.instance = new History();
    return History.instance;
  }

  public addEvent(event: HistoryEvent) {
    event.addListener("added", this.event.added);
    event.addListener("modified", this.event.modified);
    event.addListener("deleted", this.event.deleted);
  }

  public toString() {
    return this.nodes.reduce((p, c) => `${p}\n${c.toString()}`, "");
  }
}

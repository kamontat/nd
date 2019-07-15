import LoggerService, { LOGGER_NOVEL } from "nd-logger";

import { HistoryEvent } from "./HistoryEvent";
import { HistoryNode } from "./HistoryNode";

export class History {
  get event() {
    return {
      added(title: string, desc: string, value: string) {
        LoggerService.log(LOGGER_NOVEL, `detecting added event ${title}: ${desc} (${value})`);
      },
      modified(title: string, desc: string, value: { before: string; after: string }) {
        LoggerService.log(
          LOGGER_NOVEL,
          `detecting modified event ${title}: ${desc} (from ${value.before} => ${value.after})`,
        );
      },
      deleted(title: string, desc: string, value: string) {
        LoggerService.log(LOGGER_NOVEL, `detecting deleted event ${title}: ${desc} (${value})`);
      },
    };
  }
  private constructor() {
    this.nodes = [];
  }

  private nodes: HistoryNode[];

  private static instance?: History;

  public addEvent(event: HistoryEvent) {
    event.addListener("added", this.event.added);
    event.addListener("modified", this.event.modified);
    event.addListener("deleted", this.event.deleted);
  }

  public toString() {
    return this.nodes.reduce((p, c) => `${p}\n${c.toString()}`, "");
  }

  public static Get() {
    if (!History.instance) History.instance = new History();
    return History.instance;
  }
}

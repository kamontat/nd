import Event from "events";
import LoggerService, { LOGGER_HISTORY } from "@nd/logger";

export type EventType = "added" | "modified" | "deleted";

interface IHistoryEvent {
  emit(event: "added" | "deleted", title: string, value: string): boolean;
  emit(
    event: "modified",
    title: string,
    value: { after: string; before: string }
  ): boolean;
  on(
    event: "added" | "deleted",
    listener: (title: string, value: string) => void
  ): this;
  on(
    event: "modified",
    listener: (title: string, value: { after: string; before: string }) => void
  ): this;
}

export class HistoryEvent extends Event implements IHistoryEvent {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public classify(name: string, value: { after: any; before: any }) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const exist = (v: any) => {
      LoggerService.log(
        LOGGER_HISTORY,
        `try to check is ${v} exist; type ${typeof v}; %O`,
        v
      );

      if (
        v === undefined ||
        v === null ||
        v === "" ||
        v === "undefined" ||
        v === "null"
      ) {
        LoggerService.log(
          LOGGER_HISTORY,
          `undefined object OR undefined string`
        );
        return false;
      } else if (typeof v === undefined || typeof v === "undefined") {
        LoggerService.log(LOGGER_HISTORY, `undefined type`);
        return false;
      } else if (typeof v === "object") {
        if (typeof v.length === "number" && v.length <= 0) {
          LoggerService.log(LOGGER_HISTORY, `empty Array type`);
          return false;
        } else if (v.toString() === "undefined") {
          LoggerService.log(LOGGER_HISTORY, `undefined string of object type`);
          return false;
        } else if (Object.keys(v).length <= 0) {
          LoggerService.log(LOGGER_HISTORY, `empty object type`);
          return false;
        }
      }

      return true;
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const equal = (a: any, b: any) => {
      LoggerService.log(
        LOGGER_HISTORY,
        `try ${a} === ${b} (a=%O), (b=%O)`,
        a,
        b
      );
      if (a.equals && b.equals) {
        LoggerService.log(LOGGER_HISTORY, "check equivalent: equals()");
        return a.equals(b);
      } else {
        LoggerService.log(LOGGER_HISTORY, "check equivalent: normal check");
        return a === b;
      }
    };

    if (!exist(value.before) && exist(value.after))
      this.emit("added", name, value.after);
    else if (exist(value.before) && !exist(value.after))
      this.emit("deleted", name, value.before);
    else if (
      exist(value.before) &&
      exist(value.after) &&
      !equal(value.before, value.after)
    )
      this.emit("modified", name, value);
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public emit(event: EventType, title: string, value: any) {
    return super.emit(event, title, value);
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public on(event: EventType, listener: (title: string, value: any) => void) {
    return super.on(event, listener);
  }
}

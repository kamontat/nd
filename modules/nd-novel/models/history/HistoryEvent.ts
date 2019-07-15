import Event from "events";

export type EventType = "added" | "modified" | "deleted";

interface IHistoryEvent {
  on(event: "added" | "deleted", listener: (title: string, value: string) => void): this;
  on(event: "modified", listener: (title: string, value: { before: string; after: string }) => void): this;

  emit(event: "added" | "deleted", title: string, value: string): boolean;
  emit(event: "modified", title: string, value: { before: string; after: string }): boolean;
}

export class HistoryEvent extends Event implements IHistoryEvent {
  public on(event: EventType, listener: (title: string, value: any) => void) {
    return super.on(event, listener);
  }

  public emit(event: EventType, title: string, value: any) {
    return super.emit(event, title, value);
  }
}

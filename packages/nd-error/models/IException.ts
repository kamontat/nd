import Logger from "@nd/logger/models/Logger";

export interface IException extends Error {
  readonly isExit: boolean;

  description(s: string): this;

  exit(code?: number): void;

  print<T extends Logger>(log: T): this;
}

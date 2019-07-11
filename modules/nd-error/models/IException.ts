import Logger from "modules/nd-logger/models/Logger";

export interface IException extends Error {
  readonly isExit: boolean;

  description(s: string): this;

  print<T extends Logger>(log: T): this;

  exit(code?: number): void;
}

import { EventEmitter } from "events";

export type ConfigKey =
  | "mode"
  | "version"
  | "output.color"
  | "output.file"
  | "output.level"
  | "novel.location"
  | "novel.export";

export interface ConfigSchema {
  mode: "development" | "test" | "production";
  version: "v1";
  "output.color": boolean;
  "output.file": boolean;
  "output.level": "0" | "1" | "2";
  "novel.location": string;
  "novel.export": boolean;
}

export interface IConfiguration extends EventEmitter {
  get(key: ConfigKey): any;

  set(key: ConfigKey, value?: string): void;
}

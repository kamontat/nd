import { EventEmitter } from "events";
import { ReadLine } from "readline";

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
  /**
   * get configuration file absolute path
   */
  path(open: boolean): Promise<string>;

  /**
   * get value in specific config key
   *
   * @param key config key
   */
  get(key: ConfigKey): any;

  /**
   * set configuration value in specific key
   *
   * @param key configuration key
   * @param value configuration value
   */
  set(key: ConfigKey, value?: string): void;

  /**
   * save current configuration to filepath
   *
   * @param backup flag to create backup file
   */
  save(backup: boolean): void;

  /**
   * save current configuration to filepath
   *
   * @param backup flag to create backup file
   * @return this will return promise instead
   */
  saveAsync(backup: boolean): Promise<this>;

  /**
   * restore current configuration to original setting
   */
  restore(): ConfigSchema;

  /**
   * start build configuration via prompt command
   */
  start(rl: ReadLine): Promise<this>;
}

import { EventEmitter } from "events";
import { ReadLine } from "readline";

import { ConfigKey, ConfigSchema, IConfigurationTypeDefined } from "./IConfigurationTypeDefined";

export interface IConfiguration extends IConfigurationTypeDefined, EventEmitter {
  /**
   * get configuration file absolute path
   */
  path(open: boolean): Promise<string>;

  /**
   * similar as get command but this can also pass regex as the parameter
   *
   * @param key ConfigKey or regex of configuration key
   *
   * @example pass key as 'auth.*' or '*' or 'output.level'
   */
  regex(key: string): { [key: string]: any };

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

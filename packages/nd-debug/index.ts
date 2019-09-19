import chalk from "chalk";
import { appendFileSync } from "fs";
import { config } from "nd-config";
import { LOG_DIRECTORY, TMP_DIRECTORY } from "nd-helper";
import LoggerService from "nd-logger";
import { resolve } from "path";

import Package from "./package.json";

export class DebugMode {
  public get location() {
    return this.logs;
  }

  constructor(private logs: string = LOG_DIRECTORY) {}

  public open() {
    config.set("novel.location", TMP_DIRECTORY);
    LoggerService.level(3);
    chalk.level = 0;

    console.log = (...message: string[]) => appendFileSync(resolve(this.logs, "nd.log"), message);
    console.warn = (...message: string[]) => appendFileSync(resolve(this.logs, "nd.warn"), message);
    console.error = (...message: string[]) => appendFileSync(resolve(this.logs, "nd.error"), message);
  }
}

export { Package };

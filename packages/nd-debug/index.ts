import chalk from "chalk";
import { appendFileSync, existsSync, mkdirSync, writeFileSync } from "fs";
import { config } from "@nd/config";
import { LOG_DIRECTORY, ND_TMP_LOCATION, TMP_DIRECTORY } from "@nd/helper";
import LoggerService, { Colorize, LOGGER_DEBUG } from "@nd/logger";
import { dirname, resolve } from "path";

import Package from "./package.json";

export class DebugMode {
  public get location() {
    return this.logs;
  }

  constructor(private logs: string = LOG_DIRECTORY) {
    LoggerService.console.log(
      Colorize.format`{yellow.bold.underline WARNING} You create Debug mode instance. All command will be run as {red.underline.bold DEBUG MODE}
All result will add to Temporary folder instead at ${Colorize.path(ND_TMP_LOCATION)}
  1. Log file will be on ${Colorize.path(this.logs)}
  2. Tmp file will be on ${Colorize.path(TMP_DIRECTORY)}`,
    );
  }

  public open() {
    config.set("novel.location", TMP_DIRECTORY);
    LoggerService.level(3);
    chalk.level = 0;

    console.log = (...message: string[]) => this.save(message, "nd.log");
    console.warn = (...message: string[]) => this.save(message, "nd.warn");
    console.error = (...message: string[]) => this.save(message, "nd.error");
  }

  private save(message: string[], name: string) {
    const filename = resolve(this.logs, name);
    try {
      mkdirSync(dirname(filename), { recursive: true });
    } catch (e) {
      LoggerService.log(LOGGER_DEBUG, "cannot create new directory; this can be happen");
    }

    if (existsSync(filename)) appendFileSync(filename, message);
    else writeFileSync(filename, message);
  }
}

export { Package };

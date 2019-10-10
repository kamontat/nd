import chalk from "chalk";
import { appendFileSync, existsSync, mkdirSync, writeFileSync } from "fs";
import { config } from "@nd/config";
import { LOG_DIRECTORY, ND_TMP_LOCATION, TMP_DIRECTORY } from "@nd/helper";
import LoggerService, { Colorize, LOGGER_DEBUG } from "@nd/logger";
import { dirname, resolve } from "path";

export default class DebugMode {
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

    // disable color
    chalk.level = 0;
    process.env.DEBUG_COLORS = "false";

    console.log = (...message: string[]) => this.save("nd.log", ...message);
    console.warn = (...message: string[]) => this.save("nd.warn", ...message);
    console.error = (...message: string[]) => this.save("nd.error", ...message);
  }

  private save(name: string, ...message: string[]) {
    const filename = resolve(this.logs, name);
    try {
      mkdirSync(dirname(filename), { recursive: true });
    } catch (e) {
      LoggerService.log(LOGGER_DEBUG, "cannot create new directory; this can be happen");
    }

    if (existsSync(filename)) appendFileSync(filename, message.join(" ") + "\n");
    else writeFileSync(filename, message.join(" ") + "\n");
  }
}

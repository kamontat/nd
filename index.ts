// disable color if --no-color appear
((args: string[]) => {
  const i = args.findIndex(v => /^--no-color$/.test(v));
  if (i >= 0) {
    process.env.DEBUG_COLORS = "false";
  } else {
    process.env.DEBUG_COLORS = "true";
  }
})(process.argv);

import chalk from "chalk";
import { Commandline } from "@nd/commandline-interpreter";
import { config } from "@nd/config";
import { InitialFirebaseDatabase } from "@nd/database";
import Exception from "@nd/error";
import LoggerService, { LOGGER_CLI } from "@nd/logger";
import { homedir } from "os";

import { BuildCommandline, UpdateLogInfo } from "@nd/core";
import { Package } from "./src/build/Package";
import { Package as CorePackage } from "@nd/core";

InitialFirebaseDatabase();

const cli = new Commandline(Package.name, Package.description, CorePackage.version);

const home = homedir();

(async () => {
  try {
    // add config handler
    config.on("output.level", (level: number, old: number) => {
      if (level > old) {
        LoggerService.level(level);
        LoggerService.log(LOGGER_CLI, `now output level is ${level} (old=${old})`);
      }
    });

    config.on("output.color", (color: boolean) => {
      LoggerService.log(LOGGER_CLI, `now output color is ${color}(type=${typeof color})`);
      if (color !== true) chalk.enabled = false;
      else chalk.enabled = true;
    });

    UpdateLogInfo(process.argv); // update log info

    const conf = await config.load(`${home}/.nd/config`);
    const commandline = await BuildCommandline(cli, conf);

    await commandline.run(process.argv);
  } catch (e) {
    const err = Exception.cast(e);
    err.print(LOGGER_CLI).exit(1);
  }
})();

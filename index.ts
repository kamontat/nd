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
import { Commandline } from "nd-commandline-interpreter";
import { config } from "nd-config";
import Exception from "nd-error";
import LoggerService, { LOGGER_CLI, LOGGER_ROOT } from "nd-logger";
import { homedir } from "os";

import { Package } from "./src/build/Package";
import { BuildCommandline, UpdateLogInfo } from "./src/nd";

UpdateLogInfo(process.argv);

const cli = new Commandline(Package.name, Package.description);

const home = homedir();

(async () => {
  try {
    config.on("output.level", (level: string) => {
      LoggerService.log(LOGGER_CLI, `now output level is ${level}`);
      UpdateLogInfo(["--level", level]);
    });

    config.on("output.color", (_color: string) => {
      const color = _color === "true";
      LoggerService.log(LOGGER_CLI, `now output color is ${color}`);
      if (!color) chalk.level = 0;
    });

    const conf = await config.load(`${home}/.nd/config`);
    const commandline = await BuildCommandline(cli, conf);

    await commandline.run(process.argv);
  } catch (e) {
    const err = Exception.cast(e);
    err.print(LOGGER_ROOT).exit(1);
  }
})();

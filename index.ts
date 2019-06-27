// disable color if --no-color appear
((args: string[]) => {
  const i = args.findIndex(v => /^--no-color$/.test(v));
  if (i >= 0) {
    // args.splice(i, 1);
    process.env.DEBUG_COLORS = "false";
  } else {
    process.env.DEBUG_COLORS = "true";
  }
})(process.argv);

import { Commandline } from "nd-commandline-interpreter";
import { load } from "nd-config";
import Exception from "nd-error";
import LoggerService, { LOGGER_CLI, LOGGER_ROOT } from "nd-logger";
import { homedir } from "os";

import { Package } from "./src/build/Package";
import { BuildCommandline, UpdateLogInfo } from "./src/nd";

UpdateLogInfo(process.argv);

const cli = new Commandline(Package.name, Package.description);

const home = homedir();
load(`${home}/.nd/config`)
  .then(config => {
    config.on("output.level", (level: string) => {
      LoggerService.log(LOGGER_CLI, `now output level is ${level}`);
      UpdateLogInfo(["--level", level]);
    });

    return BuildCommandline(cli, config);
  })
  .then(cli => {
    return cli.run(process.argv);
  })
  .catch(e => {
    const err = Exception.cast(e);
    err.print(LOGGER_ROOT).exit(1);
  });

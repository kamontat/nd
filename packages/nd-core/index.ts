import Package from "./package.json";

import { Commandline } from "@nd/commandline-interpreter";
import { config, IConfiguration } from "@nd/config";
import LoggerService, { LOGGER_CLI } from "@nd/logger";

import { CCommand, CConfig, CNovel } from "./commands";
import { Help, Level, Version, Debug, Color } from "./options";

// set logger level if --level [0|1|2] appear
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const UpdateLogInfo = (args: any[]) => {
  const i = args.findIndex(v => /^--level$/.test(v));
  if (i >= 0) {
    const v = args[i + 1];
    const n = parseInt(v, 10);

    if (!isNaN(n)) config.set("output.level", n);

    // update log level
    LoggerService.log(LOGGER_CLI, "update output.level via command option");
  }
};

// --------------------------- //
// Start commandline interface //
// --------------------------- //

export const BuildCommandline = async (cli: Commandline, cconfig: IConfiguration) => {
  await Color(cli, cconfig);

  await Debug(cli, cconfig);

  await Help(cli, cconfig);

  await Version(cli, cconfig);

  await Level(cli, cconfig);

  await CConfig(cli, cconfig);

  // FIXME: crash on production
  // CCompletion(cli, config);

  await CCommand(cli, cconfig);

  await CNovel(cli, cconfig);

  return cli;
};

export { Package };

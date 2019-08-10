import { Commandline } from "nd-commandline-interpreter";
import { IConfiguration } from "nd-config";
import LoggerService, { LOGGER_FIREBASE } from "nd-logger";

import { CCommand, CConfig, CNovel } from "./commands";
import { Help, Level, Version } from "./options";

// set logger level if --level [0|1|2] appear
export const UpdateLogInfo = (args: any[]) => {
  const i = args.findIndex(v => /^--level$/.test(v));
  if (i >= 0) {
    const v = args[i + 1];
    // before logger initial in cli
    // console.log(`start update logger level to ${v}`);

    // update log level
    LoggerService.level(v);
  }
};

// --------------------------- //
// Start commandline interface //
// --------------------------- //

export const BuildCommandline = async (cli: Commandline, config: IConfiguration) => {
  await Help(cli, config);

  await Version(cli, config);

  await Level(cli, config);

  await CConfig(cli, config);

  // FIXME: crash on production
  // CCompletion(cli, config);

  await CCommand(cli, config);

  await CNovel(cli, config);

  return cli;
};

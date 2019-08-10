import { Commandline } from "nd-commandline-interpreter";
import { IConfiguration } from "nd-config";
import { DatabaseService } from "nd-database";
import { CheckerUtils } from "nd-helper";
import LoggerService, { LOGGER_CLI, LOGGER_FIREBASE } from "nd-logger";

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
  LoggerService.log(LOGGER_FIREBASE, "START BUILD COMMAND LINE");
  const db = DatabaseService.Get();
  const v = await db.read("command/test");
  LoggerService.log(LOGGER_FIREBASE, "%O", v);

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

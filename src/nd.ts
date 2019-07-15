import { Commandline } from "nd-commandline-interpreter";
import { IConfiguration } from "nd-config";
import LoggerService, { LOGGER_CLI } from "nd-logger";

import { CCommand, CCompletion, CConfig, CNovel } from "./commands";
import { Help, Level, Version } from "./options";

// set logger level if --level [0|1|2] appear
export const UpdateLogInfo = (args: string[]) => {
  const i = args.findIndex(v => /^--level$/.test(v));
  if (i >= 0) {
    const v = args[i + 1];
    // print nothing
    if (v === "0") LoggerService.disable();
    // print only warn and error
    else if (v === "1") LoggerService.enable("nd*warn,nd*error");
    // print everything in nd command
    else if (v === "2") LoggerService.enable("nd:*");
    // print everything of all nd command and libraries
    else if (v === "3") LoggerService.enable("*");
  }
};

// --------------------------- //
// Start commandline interface //
// --------------------------- //

export const BuildCommandline = async (cli: Commandline, config: IConfiguration) => {
  // . realtime update output.level
  config.on("output.level", (level: string) => {
    LoggerService.log(LOGGER_CLI, `now output level is ${level}`);
    UpdateLogInfo(["--level", level]);
  });

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

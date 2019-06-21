import { Command, Commandline, Option, Package as CLIPackage, SubCommand } from "nd-commandline-interpreter";
import { Package as HelperPackage } from "nd-helper";
import LoggerService, { LOGGER_CLI, LOGGER_ROOT, Package as LogPackage } from "nd-logger";
import { Package as SecurityPackage } from "nd-security";

import pjson from "./package.json";
import { HELP_CONTENT, HELP_FOOTER } from "./src/constants/help";

declare var __COMPILE_DATE__: string;

const logVersion = (p: any) => {
  LoggerService.log(LOGGER_ROOT, `Build info ${p.name}@${p.version}`);
};
logVersion(CLIPackage);
logVersion(HelperPackage);
logVersion(LogPackage);
logVersion(SecurityPackage);

const cli = new Commandline(pjson.name, pjson.description);

cli.option(
  Option.build("help", false, self => {
    const date = new Date(__COMPILE_DATE__);
    LoggerService.log(LOGGER_CLI, `${self.name} start --help`);

    console.log(`
${self.name.toUpperCase()} command; ${self.description}
Built at ${date.toLocaleString()}
${HELP_CONTENT(self.name)}
${HELP_FOOTER(self.name)}`);
  }),
);

cli.command(
  Command.build("setting", false, self => {
    LoggerService.log(LOGGER_CLI, `${self.name} start default setting command`);
  })
    .sub(
      SubCommand.build("init", false, self => {
        LoggerService.log(LOGGER_CLI, `${self.name} start initial setting command`);
      }),
    )
    .sub(
      SubCommand.build("path", true, (self: Commandline, name: string, value: string | undefined) => {
        LoggerService.log(LOGGER_CLI, `${self.name} start run ${name} with ${value}`);
      }),
    ),
);

cli.run(process.argv);

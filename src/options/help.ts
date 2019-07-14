import { Commandline, Option } from "nd-commandline-interpreter";
import { IConfiguration } from "nd-config";
import LoggerService, { Colorize, LOGGER_CLI } from "nd-logger";

import { HELP_CONTENT, HELP_FOOTER } from "../constants/content";

declare var __COMPILE_DATE__: string;

export const Help = (cli: Commandline, _: IConfiguration) => {
  cli.option(
    Option.build("help", false, ({ self, apis }) => {
      const date = new Date(__COMPILE_DATE__);
      LoggerService.log(LOGGER_CLI, `${self.name} start --help`);
      LoggerService.console.log(`
${Colorize.appname(self.name.toUpperCase())} command; ${self.description}
Built at ${Colorize.datetime(date.toLocaleString())}
${HELP_CONTENT(self.name)}
${HELP_FOOTER(self.name)}`);
      return apis.end;
    }),
  );
};

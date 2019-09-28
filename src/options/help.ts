import { Commandline, Option } from "@nd/commandline-interpreter";
import { IConfiguration } from "@nd/config";
import LoggerService, { LOGGER_CLI } from "@nd/logger";

import { HELP_CONTENT, HELP_FOOTER, HELP_HEADER } from "../constants/content";

export const Help = (cli: Commandline, _: IConfiguration) => {
  cli.option(
    Option.build("help", false, ({ self, apis }) => {
      LoggerService.log(LOGGER_CLI, `${self.name} start --help`);

      LoggerService.console.log(`
${HELP_HEADER(self.name, self.description)}
${HELP_CONTENT(self.name)}
${HELP_FOOTER(self.name)}`);
      return apis.end;
    }),
  );
};

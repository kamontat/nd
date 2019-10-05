import { Commandline, Option } from "@nd/commandline-interpreter";
import { IConfiguration } from "@nd/config";
import LoggerService, { Colorize } from "@nd/logger";

import { Package } from "@nd/core";

export const Version = (cli: Commandline, _: IConfiguration) => {
  cli.option(
    Option.build("version", false, ({ self, apis }) => {
      LoggerService.console.log(Colorize.format`${self.name}: v${Package.version}`);
      return apis.end;
    }),
  );
};

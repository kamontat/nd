import { Commandline, Option } from "nd-commandline-interpreter";
import { IConfiguration } from "nd-config";
import { Colorize } from "nd-helper";
import LoggerService from "nd-logger";
import { Package } from "src/build/Package";

export const Version = (cli: Commandline, _: IConfiguration) => {
  cli.option(
    Option.build("version", false, ({ self, apis }) => {
      LoggerService.console.log(Colorize.format`${self.name}: v${Package.version}`);
      return apis.end;
    }),
  );
};

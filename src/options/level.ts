import { Commandline, Option } from "nd-commandline-interpreter";
import { IConfiguration } from "nd-config";
import LoggerService, { LOGGER_CLI } from "nd-logger";

export const Level = (cli: Commandline, config: IConfiguration) => {
  cli.option(
    Option.build("level", true, ({ value }) => {
      LoggerService.log(LOGGER_CLI, `try to set log level to ${value}`);
      config.set("output.level", value as any);
    }),
  );
};

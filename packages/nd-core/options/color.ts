import { Commandline, Option } from "@nd/commandline-interpreter";
import { IConfiguration } from "@nd/config";

import LoggerService, { LOGGER_CLI } from "@nd/logger";

export const Color = (cli: Commandline, _: IConfiguration) => {
  cli.option(
    Option.build("color", false, () => {
      LoggerService.log(LOGGER_CLI, "just for mark that color is a global option");
    }),
  );
};

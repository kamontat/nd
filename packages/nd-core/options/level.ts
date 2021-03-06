import { Commandline, Option } from "@nd/commandline-interpreter";
import { IConfiguration } from "@nd/config";
import LoggerService, { LOGGER_CLI } from "@nd/logger";

export const Level = (cli: Commandline, config: IConfiguration) => {
  cli.option(
    Option.build("level", true, ({ value }) => {
      LoggerService.log(LOGGER_CLI, `try to set log level to ${value}`);
      const n = parseInt(value as string, 10);

      // only 0 | 1 | 2 | 3
      if (!isNaN(n)) config.set("output.level", (n % 4) as any); // eslint-disable-line @typescript-eslint/no-explicit-any
    }),
  );
};

import { Commandline, Option } from "@nd/commandline-interpreter";
import { IConfiguration } from "@nd/config";

import { DebugMode } from "@nd/debug";

export const Debug = (cli: Commandline, _: IConfiguration) => {
  cli.option(
    Option.build("debug-mode", false, () => {
      const mode = new DebugMode();
      mode.open();
    }),
  );
};

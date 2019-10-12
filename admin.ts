import { BuildAdminCommandline, Package } from "@nd/admin";
import { Commandline } from "@nd/commandline-interpreter";
import { config } from "@nd/config";
import ExceptionService from "@nd/error";
import LoggerService, { LOGGER_CLI } from "@nd/logger";

declare let __NODE_ENV__: string;
const NODE_ENV = process.env.NODE_ENV === "test" ? "test" : __NODE_ENV__;

const cli = new Commandline(Package.name, Package.description, Package.version);

(async () => {
  // add config handler
  config.on("output.level", (level: number, old: number) => {
    if (level > old) {
      LoggerService.level(level);
      LoggerService.log(LOGGER_CLI, `now output level is ${level} (old=${old})`);
    }
  });

  if (NODE_ENV === "production") config.set("output.level", 1);
  else config.set("output.level", 3);

  try {
    const commandline = await BuildAdminCommandline(cli, { stdin: process.stdin, stdout: process.stdout });
    await commandline.run(process.argv);
  } catch (e) {
    ExceptionService.cast(e)
      .print(LOGGER_CLI)
      .exit(1);
  }
})();

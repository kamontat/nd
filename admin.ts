import { BuildAdminCommandline, Package } from "nd-admin";
import { Commandline } from "nd-commandline-interpreter";
import ExceptionService from "nd-error";
import LoggerService, { LOGGER_CLI } from "nd-logger";

declare var __NODE_ENV__: string;

const cli = new Commandline(Package.name, Package.description);

(async () => {
  if (__NODE_ENV__ === "production") LoggerService.level(1);

  try {
    const commandline = await BuildAdminCommandline(cli, { stdin: process.stdin, stdout: process.stdout });
    await commandline.run(process.argv);
  } catch (e) {
    ExceptionService.cast(e)
      .print(LOGGER_CLI)
      .exit(1);
  }
})();

import { BuildAdminCommmandline, Package } from "nd-admin";
import { Commandline } from "nd-commandline-interpreter";
import LoggerService from "nd-logger";

const cli = new Commandline(Package.name, Package.description);

BuildAdminCommmandline(cli, { stdin: process.stdin, stdout: process.stdout }).then(str => {
  LoggerService.console.log(str);
});

cli.run(process.argv);

import { BuildAdminCommandline, Package } from "nd-admin";
import { Commandline } from "nd-commandline-interpreter";

const cli = new Commandline(Package.name, Package.description);

(async () => {
  const commandline = await BuildAdminCommandline(cli, { stdin: process.stdin, stdout: process.stdout });
  await commandline.run(process.argv);
})();

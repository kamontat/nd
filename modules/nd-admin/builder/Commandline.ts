import ms from "ms";
import { Command, Commandline, Option } from "nd-commandline-interpreter";
import LoggerService, { LOGGER_ADMIN } from "nd-logger";
import { Security } from "nd-security";
import readline from "readline";

import { Package } from "..";

import { HelpMessage, Result } from "./content";

export const BuildAdminCommandline = async (
  cli: Commandline,
  output: { stdin: NodeJS.ReadStream; stdout: NodeJS.WriteStream },
) => {
  LoggerService.log(LOGGER_ADMIN, "Start build admin commandline interface");

  const questionPromise = (rl: readline.Interface, q: string) => {
    return new Promise<string>(res => {
      rl.question(q, res);
    });
  };

  cli.option(
    Option.build("help", false, ({ apis }) => {
      LoggerService.console.log(HelpMessage(Package));

      return apis.end;
    }),
  );

  cli.command(
    Command.build("generate", false, async () => {
      const rl = readline.createInterface({
        input: output.stdin,
        output: output.stdout,
        terminal: true,
      });

      const obj = {
        username: "",
        name: "",
        expire: "",
        when: "",
      };

      const name = await questionPromise(rl, "? Enter customer 'name' id: ");
      obj.name = name;

      const username = await questionPromise(rl, "? Enter customer 'username': ");
      obj.username = username;

      const expired = await questionPromise(rl, "? Enter customer expire date '1h | 24h | 7d | 30d | 1y | 100y': ");
      obj.expire = expired;

      const activated = await questionPromise(rl, "? Enter customer activate date '1ms | 1d | 7d': ");
      obj.when = activated;

      // stop readline
      rl.close();

      // start encrypt the token
      const secure = new Security("v1", obj.name);
      const currentDatetime = +new Date();
      const auth = secure.encrypt({
        username: obj.username,
        issuer: "admin",
        expire: obj.expire as any,
        when: obj.when as any,
      });

      LoggerService.console.log(
        Result({
          token: auth.token,
          salt: auth.salt,
          date: {
            current: currentDatetime,
            expire: ms(auth.exp || ""),
            notBefore: ms(auth.nbf || ""),
          },
          name: auth.name,
          username: obj.username,
          fbname: auth.fbname,
        }),
      );
    }),
  );

  return cli;
};

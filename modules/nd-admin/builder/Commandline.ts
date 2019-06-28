import ms from "ms";
import { Command, Commandline, Option } from "nd-commandline-interpreter";
import { Security } from "nd-security";
import readline from "readline";

import { Package } from "..";

import { HelpMessage, Result } from "./content";

export const BuildAdminCommmandline = (
  cli: Commandline,
  output: { stdin: NodeJS.ReadStream; stdout: NodeJS.WriteStream },
) => {
  return new Promise(res => {
    cli.option(
      Option.build("help", false, ({ apis }) => {
        res(HelpMessage(Package));
        return apis.end;
      }),
    );

    cli.command(
      Command.build("generate", false, () => {
        const obj = {
          username: "",
          name: "",
          expire: "",
          when: "",
        };

        const rl = readline.createInterface({
          input: output.stdin,
          output: output.stdout,
        });

        const questionPromise = (q: string) => {
          return new Promise<string>(res => {
            rl.question(q, res);
          });
        };

        questionPromise("? Enter customer 'name' id: ")
          .then(name => {
            obj.name = name;
            return questionPromise("? Enter customer 'username': ");
          })
          .then(username => {
            obj.username = username;
            return questionPromise("? Enter customer expire date '1h | 24h | 7d | 30d | 1y | 100y': ");
          })
          .then(expire => {
            obj.expire = expire;
            return questionPromise("? Enter customer activate date '1ms | 1d | 7d': ");
          })
          .then(activate => {
            obj.when = activate;
            return new Promise(res => res());
          })
          .then(() => {
            rl.close();

            const secure = new Security("v1", obj.name);

            const currentDatetime = +new Date();
            const auth = secure.encrypt({
              username: obj.username,
              issuer: "admin",
              expire: obj.expire as any,
              when: obj.when as any,
            });

            res(
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
              }),
            );
          });
      }),
    );
  });
};

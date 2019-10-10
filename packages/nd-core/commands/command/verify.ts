import dns from "dns";
import { Commandline } from "@nd/commandline-interpreter";
import { Database } from "@nd/database";
import { Colorize } from "@nd/logger";
import os from "os";
import util from "util";

// const completed = "COMPLETED     :)";
const connected = "CONNECTED     :)";
const installed = "INSTALLED     :)";

const notExist = "NOT EXIST     :(";
const failure = "FAILURE       :(";
// const invalid = "INVALID       :(";

const vRoot = (cli: Commandline) => {
  return cli.name === "" ? false : true;
};

const vSecure = () => {
  try {
    if (require("@nd/security")) {
      return true;
    }
  } catch (e) {
    return false;
  }

  return false;
};

const vInternet = async () => {
  const resolve = util.promisify(dns.resolve);

  try {
    await resolve("www.google.com");
    return true;
  } catch (e) {
    return false;
  }
};

const vDB = () => {
  try {
    new Database(); // just for checking
    return true;
  } catch (e) {
    return false;
  }
};

const vFB = () => {
  try {
    require("firebase/app");
    require("firebase/storage");
    require("firebase/firestore");

    return true;
  } catch (e) {
    return false;
  }
};

export default async (cli: Commandline, opt: { json: boolean }) => {
  if (opt.json) {
    return JSON.stringify({
      computer: {
        os: {
          name: os.type(),
          version: os.release(),
          platform: os.platform(),
        },
        name: os.hostname(),
        home: os.homedir(),
        shell: process.env.SHELL || "unknown",
      },
      verification: {
        root: vRoot(cli),
        security: vSecure(),
        database: vDB(),
        firebase: vFB(),
        internet: await vInternet(),
      },
    });
  }

  const msg = `OS Name:                 ${Colorize.name(`${os.type()} ${os.release()} (${os.platform()})`)}
Computer name:           ${Colorize.name(os.hostname())}
Home directory:          ${Colorize.path(os.homedir())}
Shell:                   ${Colorize.path(process.env.SHELL || "unknown")}
Editor:                  ${Colorize.name(process.env.EDITOR || "unknown")}

# Verification
--------------

Root command:            ${Colorize.boolean(vRoot(cli), installed, notExist)}
Security:                ${Colorize.boolean(vSecure(), installed, notExist)}
Database:                ${Colorize.boolean(vDB(), installed, notExist)}
Firebase:                ${Colorize.boolean(vFB(), installed, notExist)}

Connection:              ${Colorize.boolean(await vInternet(), connected, failure)}
`;

  return msg;
};

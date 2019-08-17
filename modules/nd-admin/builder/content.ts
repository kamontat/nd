import { TimeUtils } from "nd-helper";
import { Colorize } from "nd-logger";

import { Package } from "../../../src/build/Package";

export interface IResultBuilder {
  date: {
    current: number;
    expire: number;
    notBefore: number;
  };
  fbname: string;
  name: string;
  salt: string;
  token: string;
  username: string;
}

export const Result = (config: IResultBuilder) => {
  return Colorize.format`
----------------------------------------------------------
# Result

This is a tutorial for admin user. 
You have responsibility to copy message below to customer with some advice.
You need to add {greenBright.underline ${config.fbname}} to our database to generate the valid users.

Start copy below lines and send to customer

{blueBright.underline ### To customer}

{redBright Token}: ${config.token}
{redBright Salt}: ${config.salt}
{redBright Name}: ${config.name}

{dim ### Information}

username       = {greenBright ${config.username}}

Expired date   = {blueBright ${TimeUtils.FormatDate(TimeUtils.GetDate(config.date.current + config.date.expire))}}
Activated date = {blueBright ${TimeUtils.FormatDate(TimeUtils.GetDate(config.date.current + config.date.notBefore))}}
Created date   = {blueBright ${TimeUtils.FormatDate(TimeUtils.GetDate(config.date.current))}}

## Usage

to setup this token please run '${Package.name} --help'
and go to initial section. Thank you
----------------------------------------------------------`;
};

export const HelpMessage = (pjson: any) => {
  const title = `${Colorize.appname(pjson.name)}: ${pjson.description}\n`;

  return (
    title +
    Colorize.format`
Usage

{dim $} {greenBright ${pjson.name}} {blueBright generate}
{dim $} {greenBright ${pjson.name}} {blueBright firebase} --token <auth.token> --name <auth.name> --salt <auth.salt>

${pjson.name} version: ${pjson.version}
Support ${Package.name} version [${pjson.support.reduce((p: string, c: string) => (p === "" ? c : `${p}, ${c}`), "")}]`
  );
};

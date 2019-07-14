import { TimeUtils } from "nd-helper";
import { Colorize } from "nd-logger";

import { Package } from "../../../src/build/Package";

export interface IResultBuilder {
  token: string;
  salt: string;
  name: string;
  username: string;
  date: {
    current: number;
    expire: number;
    notBefore: number;
  };
}

export const Result = (config: IResultBuilder) => {
  return Colorize.format`
----------------------------------------------------------
# Generate token and salt

{redBright ### TOKEN}

${config.token}

{redBright ### SALT}

${config.salt}

{redBright ### NAME}

${config.name}

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
Usage: {dim $} {greenBright ${pjson.name}} {blueBright generate}

${pjson.name} version: ${pjson.version}
support ${Package.name} version [${pjson.support.reduce((p: string, c: string) => (p === "" ? c : `${p}, ${c}`), "")}]`
  );
};

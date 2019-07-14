import { Package as CLIPackage } from "nd-commandline-interpreter";
import { config, Package as ConfigPackage } from "nd-config";
import { Package as EncoderPackage } from "nd-decoder";
import { Package as DownloaderPackage } from "nd-downloader";
import { Package as ErrorPackage } from "nd-error";
import { Package as FormatterPackage } from "nd-formatter";
import { Package as HelperPackage, TimeUtils } from "nd-helper";
import { Colorize, Package as LogPackage } from "nd-logger";
import { Package as NovelPackage } from "nd-novel";
import { Package as SecurityPackage, Security } from "nd-security";

import { Package as CorePackage } from "../build/Package";

declare var __COMPILE_DATE__: string;

const GLOBAL_OPTION = (name: string) => {
  return Colorize.format`
{bold # Global option}

{gray $} {green ${name}} {cyan --version}                -- short version message
{gray $} {green ${name}} {cyan --help}                   -- this command
{gray $} {green ${name}} {cyan --no-color}               -- disable all color in output log
{gray $} {green ${name}} {cyan --level} {gray <number>}         -- {blue number} can be 0, 1, 2, and 3
                               - 0 is mute every output and 3 is print everything
{gray $} {green ${name}} {cyan --no-file}                -- never create log and temporary files [WIP]
`;
};

const CONFIGURATION = (name: string) => {
  return Colorize.format`
{bold ## Configuration}

{gray $} {green ${name}} {magentaBright config} {magenta [get]}             -- get value from configuration file
     parameter:
       {yellow <key>}                   - {gray [optional]} print value by config key or print all available config
{gray $} {green ${name}} {magentaBright config} {magenta init}              -- create configuration file and setup as new computer
     option:
       {cyan --backup}                - {gray [optional]} create backup before replace configuration file
{gray $} {green ${name}} {magentaBright config} {magenta path}              -- output configuration path
     option:
       {cyan --open}                  - {gray [optional]} instead of print, open configuration file with {blueBright $EDITOR} [ERR]
       {cyan --only}                  - {gray [optional]} output only path name without any prefix or postfix
{gray $} {green ${name}} {magentaBright config} {magenta set}               -- update new configuration value
     parameter:
       {yellow <key>=<value>}           - {gray [required]} key and value to be saved in config file
     option:
       {cyan --backup}                - {gray [optional]} create backup before replace configuration file
`;
};

const NOVEL = (name: string) => {
  return Colorize.format`
{bold ## Novel}

{gray $} {green ${name}} {magentaBright [novel]} {magenta [download]}       -- start download novel from website (auto mode) [WIP]
     parameter:
       {yellow id}                      - {gray [required]} download novel to default location in setting [WIP]
     option:
       {cyan --location} {gray <path>}       - {gray [optional]} location of output folder; {blueBright option} > {blueBright config} > {blueBright current path} [WIP]
       {cyan --replace}               - {gray [optional]} create backup and replace if folder exist [WIP]
       {cyan --change}                - {gray [optional]} print all change and chapter in downloading novel [WIP]
{gray $} {green ${name}} {magentaBright [novel]} {magenta raw}              -- start download novel from website (manual mode) [WIP]
     parameter:
       {yellow id}                      - {gray [required]} download novel to default location in setting [WIP]
     option:
       {cyan --location} {gray <path>}       - {gray [optional]} location of output folder; {blueBright option} > {blueBright config} > {blueBright current path} [WIP]
       {cyan --replace}               - {gray [optional]} create backup and replace if folder exist [WIP]
       {cyan --chapter} {gray <number>}      - {gray [required]} specify chapter number; 
                               - number can be integer, range (e.g. 1-5) or array (e.g. 3,4,5,6) [WIP]
{gray $} {green ${name}} {magentaBright [novel]} {magenta update}           -- update exist local novel [WIP]
     parameter:
       {yellow <location>}              - {gray [required]} {blue location} must be directory with novel resource [WIP]
     option:
       {cyan --change}                - {gray [optional]} print all change and chapter in updating novel [WIP]
       {cyan --recursive} {gray <number>}    - {gray [optional]} {blue number} how deep recursive are.
                               - {underline default is 1 subfolder} [WIP]
{gray $} {green ${name}} {magentaBright [novel]} {magenta fetch}            -- fetch information from novel (support both local and server) [WIP]
     parameter:
       {yellow <id|location>}           - {gray [required]} fetch information base on input type [WIP]
     option:
       {cyan --list}                  - {gray [optional]} list all novel and chapter information [WIP]
       {cyan --history}               - {gray [optional]} list all change and history of novel [WIP]
{gray $} {green ${name}} {magentaBright [novel]} {magenta export}           -- export novel from html to pdf file [WIP]
     parameter:
       {yellow <in>}                    - {gray [required]} {blue in} must be directory with novel resource [WIP]
     option:
       {cyan --out} {gray <location>}        - {gray [optional]} result pdf file location
                               - {underline default is input location} [WIP]
{gray $} {green ${name}} {magentaBright [novel]} {magenta search}           -- search novel information in server [WIP]
     parameter:
       {yellow <type>}                  - {gray [optional]} {blue type} must be novel type
                               - support only [dekd]; {underline default is dekd} [WIP]
     option:
       {cyan --top}                   - {gray [optional]} query only top rank novel [WIP]
       {cyan --name} {gray <name>}           - {gray [optional]} search by novel name [WIP]
       {cyan --writer} {gray <writer>}       - {gray [optional]} search by writer name [WIP]
       {cyan --category} {gray <category>}   - {gray [optional]} search by category (category must be one of accept text) [WIP]
       {cyan --long}                  - {gray [optional]} filter only long novel [WIP]
       {cyan --short}                 - {gray [optional]} filter only short novel [WIP]
       {cyan --end}                   - {gray [optional]} filter only novel that mark end [WIP]
       {cyan --limit} {gray <number>}        - {gray [optional]} update result size [WIP]
                               - {underline default is 15} [WIP]
       {cyan --page} {gray <number>}         - {gray [optional]} pagination [WIP]
                               - {underline default is 1} [WIP]
{gray $} {green ${name}} {magentaBright [novel]} {magenta category}         -- list all category of novel (for searching api) [WIP]
     option:
       {cyan --search} {gray <name>}         - {gray [optional]} search input value inside category database [WIP]
`;
};

const COMMAND = (name: string) => {
  return Colorize.format`
{bold ## Command}

{gray $} {green ${name}} {magentaBright command}                 -- print all information of ${name} command
{gray $} {green ${name}} {magentaBright command} {magenta version}          -- print all version information of ${name} command
     option:
       {cyan --detail}                - {gray [optional]} include libraries and changelog detail
{gray $} {green ${name}} {magentaBright command} {magenta upgrade}          -- download and install if new version release [WIP]
{gray $} {green ${name}} {magentaBright command} {magenta downgrade}        -- download and install with specify version [WIP]
     parameter:
       {yellow <version>}               - {gray [required]} specify version number [WIP]
{gray $} {green ${name}} {magentaBright command} {magenta verify}           -- verify all dependencies and components of the command [WIP]
`;
};

const PS = (_: string) => {
  return Colorize.format`
{gray P.S. [...] mean optional / default command (can be omit)}
{gray P.S. <...> mean variable}`;
};

export const HELP_CONTENT = (name: string) => {
  return GLOBAL_OPTION(name) + CONFIGURATION(name) + NOVEL(name) + COMMAND(name) + PS(name);
};

const LICENSE = (name: string) => {
  return Colorize.format`
{bold END-USER LICENSE AGREEMENT}

BY CLICKING "I AGREE", DOWNLOADING, ACCESSING, INSTALLING, RUNNING OR USING ${name.toUpperCase()} SOFTWARE
YOU AGREE (I) THAT THIS EULA IS A LEGALLY BINDING AND VALID AGREEMENT

LICENSE TO USE THE SOFTWARE. The Software is licensed to You, not sold to You. 
You agree that if the Software requires mandatory activation or email validation, 
You will complete the process providing with accurate information.

You may not {red.underline copy}, {red.underline modify}, {red.underline distribute}, {red.underline sell}, or {red.underline lease} any part of our Services
or included software, nor may you reverse engineer or 
attempt to extract the source code of that software, 
unless laws prohibit those restrictions or you have our written permission.
`;
};

const AUTHOR = (_: string) => {
  return Colorize.format`
Enjoy your days; {blueBright ${CorePackage.author}}`;
};

export const HELP_FOOTER = (name: string) => {
  return LICENSE(name) + AUTHOR(name);
};

export const VERSION = () => {
  return Colorize.format`{dim --------------------------------------}
{yellowBright ${CorePackage.name}}                         : {blueBright ${CorePackage.version}}
{yellowBright ${SecurityPackage.name}}                : {blueBright ${SecurityPackage.version}}
{yellowBright ${CLIPackage.name}} : {blueBright ${CLIPackage.version}}
{yellowBright ${NovelPackage.name}}                   : {blueBright ${NovelPackage.version}}
{yellowBright ${EncoderPackage.name}}                 : {blueBright ${EncoderPackage.version}}
{yellowBright ${LogPackage.name}}                  : {blueBright ${LogPackage.version}}
{yellowBright ${FormatterPackage.name}}               : {blueBright ${LogPackage.version}}
{yellowBright ${DownloaderPackage.name}}              : {blueBright ${DownloaderPackage.version}}
{yellowBright ${HelperPackage.name}}                  : {blueBright ${HelperPackage.version}}
{yellowBright ${ConfigPackage.name}}                  : {blueBright ${ConfigPackage.version}}
{yellowBright ${ErrorPackage.name}}                   : {blueBright ${ErrorPackage.version}}
{dim --------------------------------------}
`;
};

export const VERSION_FULL = () => {
  interface IDependency {
    name: string;
    version: string;
    description?: string;
    changelog?: { [key: string]: string };
  }

  const genInternalDependency = (pjson: { [key: string]: any }) => {
    return {
      name: pjson.name,
      version: pjson.version,
      description: pjson.description,
      changelog: pjson.changelog,
    };
  };

  const dependencies: Array<IDependency> = [];

  // core package
  dependencies.push(genInternalDependency(CorePackage));

  // security package
  dependencies.push(genInternalDependency(SecurityPackage));

  // commandline package
  dependencies.push(genInternalDependency(CLIPackage));

  // novel package
  dependencies.push(genInternalDependency(NovelPackage));

  // encoder package
  dependencies.push(genInternalDependency(EncoderPackage));

  // logger package
  dependencies.push(genInternalDependency(LogPackage));

  // formatter package
  dependencies.push(genInternalDependency(FormatterPackage));

  // downloader package
  dependencies.push(genInternalDependency(DownloaderPackage));

  // helper package
  dependencies.push(genInternalDependency(HelperPackage));

  // config package
  dependencies.push(genInternalDependency(ConfigPackage));

  // error package
  dependencies.push(genInternalDependency(ErrorPackage));

  // NOTES: just disable external dependency because It might have vulnerability
  // external dependency
  // Object.keys(CorePackage.dependencies)
  //   .filter(v => !v.includes("nd-"))
  //   .forEach(name => {
  //     const version = (CorePackage.dependencies as any)[name];
  //     const description = (CorePackage as any).dependency[name];
  //     dependencies.push({
  //       name,
  //       version,
  //       description,
  //     });
  //   });

  let str = dependencies.reduce((p, c) => {
    let s = Colorize.format`{yellowBright ${c.name}}: {dim ${c.description || ""}}\n`;
    if (c.changelog) {
      Object.keys(c.changelog).forEach(k => {
        const v = c.changelog && c.changelog[k];
        s += Colorize.format`  - {blueBright ${k}} {dim ${v || ""}}\n`;
      });
    }

    return p + s;
  }, Colorize.format`{dim --------------------------------------}\n`);
  str += Colorize.format`{dim --------------------------------------}`;
  return str;
};

export const COMMAND_INFORMATION = (name: string) => {
  let result = Colorize.format`
Command name:            {greenBright ${name}}
Command version:         {greenBright ${CorePackage.version}}
Command author:          {greenBright ${CorePackage.author}}
Command date:            {greenBright ${TimeUtils.FormatDate(new Date(__COMPILE_DATE__))}}
`;

  const secure = new Security(config.get("version") as any, config.get("auth.name") as string);

  if (secure.isVerified(config.get("auth.token") as string, config.get("auth.salt") as string)) {
    result += Colorize.format`
Username:                {greenBright ${(secure.response && secure.response.username) || ""}}
Start date:              {greenBright ${TimeUtils.FormatDate(
      TimeUtils.GetDate(secure.response && secure.response.notBefore),
    )}}
Expire date:             {greenBright ${TimeUtils.FormatDate(
      TimeUtils.GetDate(secure.response && secure.response.expire),
    )}}
Issue date:              {greenBright ${TimeUtils.FormatDate(
      TimeUtils.GetDate(secure.response && secure.response.issue),
    )}}
`;
  } else {
    result += Colorize.format`
Authentication           {red.bold FAIL}
`;
  }

  return (
    result +
    Colorize.format`
Authentication token:    {greenBright ${(config.get("auth.token") as string).substr(0, 15)}...}
Authentication salt:     {greenBright ${(config.get("auth.salt") as string).substr(0, 15)}...}
Authentication name:     {greenBright ${config.get("auth.name") as string}}`
  );
};

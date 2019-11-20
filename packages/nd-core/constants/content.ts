import { Package as AdminPackage } from "@nd/admin/standalone";
import { Package as CLIPackage } from "@nd/commandline-interpreter";
import { config, Package as ConfigPackage } from "@nd/config";
import { Package as ContentPackage } from "@nd/content";
import { Package as DatabasePackage } from "@nd/database";
import { Package as EncoderPackage } from "@nd/decoder";
import { Package as DownloaderPackage } from "@nd/downloader";
import { Package as ErrorPackage } from "@nd/error";
import { Package as FilePackage } from "@nd/file";
import { Package as FormatterPackage } from "@nd/formatter";
import { Package as HelperPackage, TimeUtils } from "@nd/helper";
import { Package as HtmlGenPackage } from "@nd/html-generator";
import { Colorize, Package as LogPackage } from "@nd/logger";
import { Package as NovelPackage } from "@nd/novel";
import { Package as ResourcePackage } from "@nd/resource";
import { Package as SecurityPackage, Security } from "@nd/security";
import { Package as ThreadPackage } from "@nd/thread";
import { Package as CorePackage } from "@nd/core";
import { Package as FBasePackage } from "@nd/fbase";
import { Package as AuthPackage } from "@nd/auth";

declare let __COMPILE_DATE__: string;
const COMPILE_DATE = process.env.NODE_ENV === "test" ? "" : __COMPILE_DATE__;

const GLOBAL_OPTION = (name: string) => {
  return Colorize.format`
{bold # Global option}

{gray $} {green ${name}} {cyan --version}                -- short version message
{gray $} {green ${name}} {cyan --help}                   -- this command
{gray $} {green ${name}} {cyan --no-color}               -- disable all color in output log
{gray $} {green ${name}} {cyan --level} {gray <number>}         -- {blue number} can be 0, 1, 2, and 3
                               - 0 is mute every output and 3 is print everything
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
       {cyan --only}                  - {gray [optional]} output only path name without any prefix or postfix
{gray $} {green ${name}} {magentaBright config} {magenta set}               -- update new configuration value
     parameter:
       {yellow <key>=<value>}           - {gray [required]} key and value to be saved in config file
     option:
       {cyan --backup}                - {gray [optional]} create backup before replace configuration file
{gray $} {green ${name}} {magentaBright config} {magenta help}              -- show available subcommand of ${Colorize.command(
    "config",
  )} command
`;
};

const NOVEL = (name: string) => {
  return Colorize.format`
{bold ## Novel}

{gray $} {green ${name}} {magentaBright [novel]} {magenta [download]}       -- start download novel from website (auto mode)
     parameter:
       {yellow id}                      - {gray [required]} download novel to default location in setting
     option:
       {cyan --location} {gray <path>}       - {gray [optional]} location of output folder; {blueBright option} > {blueBright config} > {blueBright current path}
       {cyan --replace}               - {gray [optional]} create backup and replace if folder exist
       {cyan --change}                - {gray [optional]} print all history that occurred on the downloading
       {cyan --chapter}               - {gray [optional]} print all downloaded chapter
       {cyan --thread} {gray <number>}       - {gray [optional]} {blue number} must be the number of thread for download novel
{gray $} {green ${name}} {magentaBright [novel]} {magenta raw}              -- start download novel from website (manual mode)
     parameter:
       {yellow id}                      - {gray [required]} download novel to default location in setting
     option:
       {cyan --thread} {gray <number>}       - {gray [optional]} {blue number} must be the number of thread for download novel
       {cyan --location} {gray <path>}       - {gray [optional]} location of output folder; {blueBright option} > {blueBright config} > {blueBright current path}
       {cyan --chapters} {gray <number>}     - {gray [required]} specify chapter number;
                               - number can be integer, range (e.g. 1-5) or array (e.g. 3,4,5,6)
       {cyan --chapter}               - {gray [optional]} print all downloaded chapter
       {cyan --replace}               - {gray [optional]} create backup and replace if folder exist
       {cyan --change}                - {gray [optional]} print all history that occurred on the downloading
{gray $} {green ${name}} {magentaBright [novel]} {magenta update}           -- update exist local novel
     parameter:
       {yellow <location>}              - {gray [required]} {blue location} must be directory with novel resource
     option:
       {cyan --dry-run}               - {gray [optional]} fetch data only but never save to file system
       {cyan --change}                - {gray [optional]} print all change and chapter in updating novel
       {cyan --no-replace}            - {gray [optional]} the command will replace any updated chapter by default;
                               - this option prevent not to do that
       {cyan --recursive} {gray <number>}    - {gray [optional]} {blue number} how deep recursive are.
                               - {underline default is 1 subfolder} [WIP]
{gray $} {green ${name}} {magentaBright [novel]} {magenta fetch}            -- fetch information from novel (support both local and server)
     parameter:
       {yellow <id|location>}           - {gray [required]} fetch information base on input type
     option:
       {cyan --thread} {gray <number>}       - {gray [optional]} {blue number} must be the number of thread for download novel
       {cyan --chapter}               - {gray [optional]} list all novel and chapter information
       {cyan --fast}                  - {gray [optional]} fetching only index page and receive information ({red.underline ID} only)
                               - this might cause lack of information to print
       {cyan --check}                 - {gray [optional]} compare current novel with the server version
{gray $} {green ${name}} {magentaBright [novel]} {magenta export}           -- export novel from html to pdf file with tools call 'https://wkhtmltopdf.org' [WIP]
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
{gray $} {green ${name}} {magentaBright novel} {magenta help}               -- show available subcommand of ${Colorize.command(
    "novel",
  )} command
`;
};

const COMMAND = (name: string) => {
  return Colorize.format`
{bold ## Command}

{gray $} {green ${name}} {magentaBright command} {magenta [verify]}         -- verify all dependencies and components of the command
     option:
       {cyan --json}                  - {gray [optional]} change output to valid JSON format instead
{gray $} {green ${name}} {magentaBright command} {magenta version}          -- print all version information of ${name} command
     option:
       {cyan --detail}                - {gray [optional]} include libraries and changelog detail
{gray $} {green ${name}} {magentaBright command} {magenta upgrade}          -- download and install if new version release [WIP]
{gray $} {green ${name}} {magentaBright command} {magenta downgrade}        -- download and install with specify version [WIP]
     parameter:
       {yellow <version>}               - {gray [required]} specify version number [WIP]
{gray $} {green ${name}} {magentaBright command} {magenta help}             -- show available subcommand of ${Colorize.command(
    "command",
  )} command
`;
};

const PS = (_: string) => {
  return Colorize.format`
{gray P.S. [...] mean optional / default command (can be omit)}
{gray P.S. <...> mean variable}`;
};

export const HELP_CONFIGURATION = (name: string) => {
  return GLOBAL_OPTION(name) + CONFIGURATION(name) + PS(name);
};

export const HELP_NOVEL = (name: string) => {
  return GLOBAL_OPTION(name) + NOVEL(name) + PS(name);
};

export const HELP_COMMAND = (name: string) => {
  return GLOBAL_OPTION(name) + COMMAND(name) + PS(name);
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

You may {red.underline.bold NOT} {red copy}, {red modify}, {red distribute}, {red sell}, or {red lease} any part of our Services
or included software, nor may you reverse engineer or
attempt to extract the source code of that software,
unless laws prohibit those restrictions or you have our written permission.
`;
};

const AUTHOR = (_: string) => {
  return Colorize.format`
Enjoy your days; {blueBright ${CorePackage.author}}`;
};

export const HELP_HEADER = (name: string, version: string, description: string) => {
  const date = new Date(COMPILE_DATE);
  return `${Colorize.appname(name.toUpperCase())} command; ${description}
Built at ${Colorize.datetime(date.toLocaleString())}
Version  ${Colorize.version(version)}`;
};

export const HELP_FOOTER = (name: string) => {
  return LICENSE(name) + AUTHOR(name);
};

export const VERSION = (name: string, version: string) => {
  return Colorize.format`{dim --------------------------------------}
{yellowBright ${name}}                          : {blueBright ${version}}
{yellowBright ${AuthPackage.name}}                    : {blueBright ${AuthPackage.version}}
{yellowBright ${CLIPackage.name}} : {blueBright ${CLIPackage.version}}
{yellowBright ${ConfigPackage.name}}                  : {blueBright ${ConfigPackage.version}}
{yellowBright ${ContentPackage.name}}                 : {blueBright ${ContentPackage.version}}
{yellowBright ${CorePackage.name}}                    : {blueBright ${CorePackage.version}}
{yellowBright ${DatabasePackage.name}}                : {blueBright ${DatabasePackage.version}}
{yellowBright ${DownloaderPackage.name}}              : {blueBright ${DownloaderPackage.version}}
{yellowBright ${EncoderPackage.name}}                 : {blueBright ${EncoderPackage.version}}
{yellowBright ${ErrorPackage.name}}                   : {blueBright ${ErrorPackage.version}}
{yellowBright ${FBasePackage.name}}                   : {blueBright ${FBasePackage.version}}
{yellowBright ${FilePackage.name}}                    : {blueBright ${FilePackage.version}}
{yellowBright ${FormatterPackage.name}}               : {blueBright ${FormatterPackage.version}}
{yellowBright ${HelperPackage.name}}                  : {blueBright ${HelperPackage.version}}
{yellowBright ${HtmlGenPackage.name}}          : {blueBright ${HtmlGenPackage.version}}
{yellowBright ${LogPackage.name}}                  : {blueBright ${LogPackage.version}}
{yellowBright ${NovelPackage.name}}                   : {blueBright ${NovelPackage.version}}
{yellowBright ${ResourcePackage.name}}                : {blueBright ${ResourcePackage.version}}
{yellowBright ${SecurityPackage.name}}                : {blueBright ${SecurityPackage.version}}
{yellowBright ${ThreadPackage.name}}                  : {blueBright ${ThreadPackage.version}}
{dim --------------------------------------}
`;
};

export const VERSION_FULL = (limit = 5) => {
  interface IDependency {
    changelog?: { [key: string]: string | { date: string; message: string } };
    description?: string;
    name: string;
    version: string;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const genInternalDependency = (pjson: { [key: string]: any }) => {
    return {
      name: pjson.name,
      version: pjson.version,
      description: pjson.description,
      changelog: pjson.changelog,
    };
  };

  const dependencies: Array<IDependency> = [];

  // auth package
  dependencies.push(genInternalDependency(AuthPackage));

  // commandline package
  dependencies.push(genInternalDependency(CLIPackage));

  // config package
  dependencies.push(genInternalDependency(ConfigPackage));

  // content package
  dependencies.push(genInternalDependency(ContentPackage));

  // core package
  dependencies.push(genInternalDependency(CorePackage));

  // database package
  dependencies.push(genInternalDependency(DatabasePackage));

  // downloader package
  dependencies.push(genInternalDependency(DownloaderPackage));

  // encoder package
  dependencies.push(genInternalDependency(EncoderPackage));

  // error package
  dependencies.push(genInternalDependency(ErrorPackage));

  // fbase package
  dependencies.push(genInternalDependency(FBasePackage));

  // file package
  dependencies.push(genInternalDependency(FilePackage));

  // formatter package
  dependencies.push(genInternalDependency(FormatterPackage));

  // helper package
  dependencies.push(genInternalDependency(HelperPackage));

  // html generator package
  dependencies.push(genInternalDependency(HtmlGenPackage));

  // logger package
  dependencies.push(genInternalDependency(LogPackage));

  // novel package
  dependencies.push(genInternalDependency(NovelPackage));

  // resource package
  dependencies.push(genInternalDependency(ResourcePackage));

  // security package
  dependencies.push(genInternalDependency(SecurityPackage));

  // thread package
  dependencies.push(genInternalDependency(ThreadPackage));

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
      Object.keys(c.changelog).forEach((k, i) => {
        if (i >= limit) return; // exceed limit number

        const v = c.changelog && c.changelog[k];
        if (v) {
          // old version of changelog
          if (typeof v === "string") s += Colorize.format`  - {blueBright ${k}} {dim ${v || ""}}\n`;
          // new version which include date
          else s += Colorize.format`  - {blueBright ${k}} {dim ${v.message}} {dim.underline ${v.date}}\n`;
        } else {
          // no changelog
          s += Colorize.format`  - {blueBright ${k}}\n`;
        }
      });
    }

    return p + s;
  }, Colorize.format`{dim --------------------------------------}\n`);
  str += Colorize.format`{dim --------------------------------------}`;
  return str;
};

export const __COMMAND_INFORMATION_JSON = async (name: string, version: string) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const obj: { [key: string]: any } = {
    command: {
      name,
      version,
      author: CorePackage.author,
    },
    admin: {
      version: AdminPackage.version,
    },
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const secure = new Security(config.get("version") as any, config.get("auth.name") as string);

  try {
    const response = secure.decrypt(config.get("auth.token") as string, config.get("auth.salt") as string);
    const err = await secure.server.isActivated();
    if (err) throw err;

    obj.security = {
      success: true,
      username: response.username,
      expire: response.expire, // token cannot be use after this time
      issue: response.issue, // token has been built
      activate: response.notBefore, // token can be use since this time
      detail: {
        token: config.get("auth.token"),
        salt: config.get("auth.salt"),
        name: config.get("auth.name"),
      },
      server: {
        activated: true,
      },
    };
  } catch (e) {
    obj.security = {
      success: false,
      reason: e,
    };
  }

  return JSON.stringify(obj);
};

export const __COMMAND_INFORMATION_TEXT = async (name: string, version: string) => {
  let result = `# Authentization
--------------
`;

  result += `
Command name:            ${Colorize.appname(name)}
Command version:         ${Colorize.version(version)} (${Colorize.version(CorePackage.version)})
Command author:          ${Colorize.name(CorePackage.author)}
Command date:            ${Colorize.datetime(TimeUtils.FormatDate(new Date(COMPILE_DATE)))}

Admin version:           ${Colorize.version(AdminPackage.version)}
`;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const secure = new Security(config.get("version") as any, config.get("auth.name") as string);
  if (!secure.isVerified(config.get("auth.token") as string, config.get("auth.salt") as string)) {
    result += Colorize.format`
Authentication           {red.bold FAIL}
`;
  } else {
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
  }

  const err = await secure.server.isActivated();
  if (err) {
    result += Colorize.format`
Authentication server    {red.bold NOT ACTIVATED}
`;
  } else {
    result += Colorize.format`
Authentication server    {greenBright ACTIVATED}
`;
  }

  return (
    result +
    Colorize.format`
Authentication token:    {greenBright ${(config.get("auth.token") as string).substr(0, 7)}...${(config.get(
      "auth.token",
    ) as string).slice(-13)}}
Authentication salt:     {greenBright ${(config.get("auth.salt") as string).substr(0, 7)}...${(config.get(
      "auth.salt",
    ) as string).slice(-13)}}
Authentication name:     {greenBright ${config.get("auth.name") as string}}`
  );
};

export const COMMAND_INFORMATION = (name: string, version: string, opts: { json: boolean }) => {
  if (opts.json) return __COMMAND_INFORMATION_JSON(name, version);
  else return __COMMAND_INFORMATION_TEXT(name, version);
};

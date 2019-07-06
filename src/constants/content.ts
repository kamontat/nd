import { Package as CLIPackage } from "nd-commandline-interpreter";
import { Package as ConfigPackage } from "nd-config";
import { Package as ErrorPackage } from "nd-error";
import { Colorize, Package as HelperPackage } from "nd-helper";
import { Package as LogPackage } from "nd-logger";
import { Package as SecurityPackage } from "nd-security";

import { Package as CorePackage } from "../build/Package";

export const HELP_CONTENT = (name: string) => {
  return Colorize.format`
{bold # Global option}

{gray $} {green ${name}} {cyan --version}                -- short version message
{gray $} {green ${name}} {cyan --help}                   -- this command
{gray $} {green ${name}} {cyan --no-color}               -- disable all color in output log
{gray $} {green ${name}} {cyan --level} {gray <number>}         -- {blue number} can be 0, 1, 2, and 3
                               - 0 is mute every output and 3 is print everything
{gray $} {green ${name}} {cyan --no-file}                -- never create log and temporary files [WIP]

{bold ## Configuration}

{gray $} {green ${name}} {magentaBright config} {magenta [get]}             -- get value from configuration file [WIP]
     parameter:
       {yellow <key>}                   - {gray [optional]} print value by config key or print all available config [WIP]
{gray $} {green ${name}} {magentaBright config} {magenta init}              -- create configuration file and setup as new computer [WIP]
     option:
       {cyan --backup}                - {gray [optional]} create backup before replace configuration file [WIP]
{gray $} {green ${name}} {magentaBright config} {magenta path}              -- output configuration path
     option:
       {cyan --open}                  - {gray [optional]} instead of print, open configuration file with {blueBright $EDITOR} [ERR]
       {cyan --only}                  - {gray [optional]} output only path name without any prefix or postfix
{gray $} {green ${name}} {magentaBright config} {magenta set}               -- update new configuration value [WIP]
     parameter:
       {yellow <key>=<value>}           - {gray [required]} key and value to be saved in config file [WIP]
     option:
       {cyan --backup}                - {gray [optional]} create backup before replace configuration file [WIP]

{bold ## Novel}

{gray $} {green ${name}} {magentaBright [novel]} {magenta [download]}       -- start download novel from website (auto mode) [WIP]
     parameter:
       {yellow <id|link>}               - {gray [required]} download novel to default location in setting [WIP]
     option:
       {cyan --location}              - {gray [optional]} location of output folder; {blueBright config} > {blueBright option} > {blueBright current path} [WIP]
       {cyan --replace}               - {gray [optional]} create backup and replace if folder exist [WIP]
       {cyan --change}                - {gray [optional]} print all change and chapter in downloading novel [WIP]
{gray $} {green ${name}} {magentaBright [novel]} {magenta raw}              -- start download novel from website (manual mode) [WIP]
     parameter:
       {yellow <id|link>}               - {gray [required]} download novel to default location in setting [WIP]
     option:
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
       {yellow <url|id|location>}       - {gray [required]} fetch information base on input type [WIP]
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

{bold ## Command}

{gray $} {green ${name}} {magentaBright command} {magenta [version]}        -- print all version information of ${name} command
     option:
       {cyan --detail}                - {gray [optional]} include command and libraries detail [WIP]
{gray $} {green ${name}} {magentaBright command} {magenta changelog}        -- print changelog and information on latest version [WIP]
{gray $} {green ${name}} {magentaBright command} {magenta upgrade}          -- download and install if new version release [WIP]
{gray $} {green ${name}} {magentaBright command} {magenta downgrade}        -- download and install with specify version [WIP]
     parameter:
       {yellow <version>}               - {gray [required]} specify version number [WIP]
{gray $} {green ${name}} {magentaBright command} {magenta verify}           -- verify all dependencies and components of the command [WIP]

{gray P.S. [...] mean optional / default command (can be omit)}
{gray P.S. <...> mean variable}`;
};

export const HELP_FOOTER = (name: string) => {
  return Colorize.format`
END-USER LICENSE AGREEMENT

BY CLICKING "I AGREE", DOWNLOADING, ACCESSING, INSTALLING, RUNNING OR USING ${name.toUpperCase()} SOFTWARE
YOU AGREE (I) THAT THIS EULA IS A LEGALLY BINDING AND VALID AGREEMENT

LICENSE TO USE THE SOFTWARE. The Software is licensed to You, not sold to You. 
You agree that if the Software requires mandatory activation or email validation, 
You will complete the process providing with accurate information.

You may not {red.underline copy}, {red.underline modify}, {red.underline distribute}, {red.underline sell}, or {red.underline lease} any part of our Services
or included software, nor may you reverse engineer or 
attempt to extract the source code of that software, 
unless laws prohibit those restrictions or you have our written permission.

Enjoy your days; {blueBright ${CorePackage.author}}`;
};

export const VERSION_FULL = () => {
  return Colorize.format`{dim --------------------------------------}
{yellowBright ${CorePackage.name}}                         : {blueBright ${CorePackage.version}}
{yellowBright ${SecurityPackage.name}}                : {blueBright ${SecurityPackage.version}}
{yellowBright ${CLIPackage.name}} : {blueBright ${CLIPackage.version}}
{yellowBright ${LogPackage.name}}                  : {blueBright ${LogPackage.version}}
{yellowBright ${HelperPackage.name}}                  : {blueBright ${HelperPackage.version}}
{yellowBright ${ConfigPackage.name}}                  : {blueBright ${ConfigPackage.version}}
{yellowBright ${ErrorPackage.name}}                   : {blueBright ${ErrorPackage.version}}
{dim --------------------------------------}
`;
};

export const VERSION_FULL_DETAIL = () => {
  interface Dependency {
    name: string;
    version: string;
    description?: string;
    changelog?: string;
  }

  const genInternalDependency = (pjson: { [key: string]: any }) => {
    return {
      name: pjson.name,
      version: pjson.version,
      description: pjson.description,
      changelog: pjson.changelog[pjson.version],
    };
  };

  const dependencies: Array<Dependency> = [];

  // core package
  dependencies.push(genInternalDependency(CorePackage));

  // security package
  dependencies.push(genInternalDependency(SecurityPackage));

  // commandline package
  dependencies.push(genInternalDependency(CLIPackage));

  // logger package
  dependencies.push(genInternalDependency(LogPackage));

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
    let s = Colorize.format`{yellowBright ${c.name}}: {dim ${c.description || ""}}`;
    s += Colorize.format`\n  - {blueBright ${c.version}} {dim ${c.changelog || ""}}\n`;
    return p + s;
  }, Colorize.format`{dim --------------------------------------}\n`);
  str += Colorize.format`{dim --------------------------------------}`;
  return str;
};

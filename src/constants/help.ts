import { Package as CLIPackage } from "nd-commandline-interpreter";
import { Colorize, Package as HelperPackage } from "nd-helper";
import { Package as LogPackage } from "nd-logger";
import { Package as SecurityPackage } from "nd-security";

import { Package as CorePackage } from "../build/Package";

export const HELP_CONTENT = (name: string) => {
  return `
Start new content with ${name}`;
};

export const HELP_FOOTER = (name: string) => {
  return `

${Colorize.dim("--------------------------------------")}
${Colorize.appname(CorePackage.name)}                         : ${Colorize.version(CorePackage.version)}
${Colorize.appname(SecurityPackage.name)}                : ${Colorize.version(SecurityPackage.version)}
${Colorize.appname(CLIPackage.name)} : ${Colorize.version(CLIPackage.version)}
${Colorize.appname(LogPackage.name)}                  : ${Colorize.version(LogPackage.version)}
${Colorize.appname(HelperPackage.name)}                  : ${Colorize.version(HelperPackage.version)}
${Colorize.dim("--------------------------------------")}

END-USER LICENSE AGREEMENT

BY CLICKING "I AGREE", DOWNLOADING, ACCESSING, INSTALLING, RUNNING OR USING ${name.toUpperCase()} SOFTWARE
YOU AGREE (I) THAT THIS EULA IS A LEGALLY BINDING AND VALID AGREEMENT

LICENSE TO USE THE SOFTWARE. The Software is licensed to You, not sold to You. 
You agree that if the Software requires mandatory activation or email validation, 
You will complete the process providing with accurate information.

You may not ${Colorize.important("copy")}, ${Colorize.important("modify")}, ${Colorize.important(
    "distribute",
  )}, ${Colorize.important("sell")}, or ${Colorize.important("lease")} any part of our Services
or included software, nor may you reverse engineer or 
attempt to extract the source code of that software, 
unless laws prohibit those restrictions or you have our written permission.

Enjoy your days; kc nd-admin`;
};

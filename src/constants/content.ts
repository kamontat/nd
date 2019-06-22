import { Package as CLIPackage } from "nd-commandline-interpreter";
import { Package as ConfigPackage } from "nd-config";
import { Package as ErrorPackage } from "nd-error";
import { Colorize, Package as HelperPackage } from "nd-helper";
import { Package as LogPackage } from "nd-logger";
import { Package as SecurityPackage } from "nd-security";

import { Package as CorePackage } from "../build/Package";

export const HELP_CONTENT = (name: string) => {
  return `
Start new content with ${name}`;
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

Enjoy your days; ${CorePackage.author}`;
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

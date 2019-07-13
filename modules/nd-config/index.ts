import { Configuration } from "./models/Configuration";
import { IConfiguration } from "./models/IConfiguration";
import Package from "./package.json";

export const config = Configuration.CONST();

export { Package, IConfiguration };

export { ConfigParser } from "./apis/parser";

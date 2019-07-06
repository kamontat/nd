import { Configuration } from "./models/Configuration";
import { IConfiguration } from "./models/interface";
import Package from "./package.json";

export const config = Configuration.CONST();

export { Package, IConfiguration };

export { ConfigParser } from "./apis/parser";

import { Configuration } from "./models/Configuration";
import { IConfiguration } from "./models/interface";
import Package from "./package.json";

export const load = Configuration.CONST().load;
export const config = Configuration.CONST();

export { Package, IConfiguration };

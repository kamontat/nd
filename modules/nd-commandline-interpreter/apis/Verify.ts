import { IConfiguration } from "nd-config";
import ExceptionService, { ERR_SCT } from "nd-error";
import { Security } from "nd-security";

export default {
  IsExist(n: any) {
    if (n === undefined || n === null) return false;
    if (typeof n === "object" && Object.keys(n).length <= 0) return false;

    let str: string = n;
    if (!this.IsString(n)) {
      str = n.toString();
    }

    return str !== "" && str.toLowerCase() !== "null" && str.toLowerCase() !== "undefined";
  },
  IsString(n: any) {
    return n instanceof String || typeof n === "string";
  },
  IsBoolean(n: any) {
    if (!this.IsString(n)) return typeof n === "boolean";
    return n.toString() === "true" || n.toString() === "false";
  },
  IsNumber(n?: any) {
    if (!this.IsString(n)) return parseInt(n, 10) === n;
    return /^\d+$/.test(n);
  },
  IsDecimal(n?: any) {
    return /^\d+\.\d+$/.test(n);
  },
  IsId(n?: any) {
    return this.IsNumber(n);
  },
  IsUrl(n?: any) {
    if (!this.IsString(n)) return false;
    try {
      const url = new URL(n);
      return url.protocol.includes("http") || url.protocol.includes("https");
    } catch (e) {
      return false;
    }
  },
  CheckAuthenication(config: IConfiguration): { err?: Error; secure: Security } {
    const secure = new Security("v1", config.get("auth.name") as string);
    if (secure.isVerified(config.get("auth.token") as string, config.get("auth.salt") as string)) {
      return { err: undefined, secure };
    } else {
      return {
        err: ExceptionService.build(ERR_SCT, "security is invalid; please check your token salt and name again"),
        secure,
      };
    }
  },
};

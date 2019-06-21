import { genSaltSync, hashSync } from "bcryptjs";
import { sign, verify } from "jsonwebtoken";

import LoggerService, { LOGGER_SECURITY } from "../nd-logger";

import config, { ConfigJson } from "./config";
import Package from "./package.json";

interface TokenConfig {
  username: string;
  expire?: "1h" | "24h" | "7d" | "1m" | "1y" | "100y";
  issue?: "1ms" | "1d" | "7d";
  issuer?: "admin" | "selfgen";
}

type versionName = "v1";

export class NdSecurity {
  private _config: ConfigJson;
  private _name: string;

  private _shuffle(str: string) {
    let nstr = "";
    for (let i = 0; i < str.length; i++) {
      nstr += String.fromCharCode(str.charCodeAt(i) ^ 1);
    }
    return nstr;
  }

  constructor(version: versionName, name: string) {
    this._config = config[version];
    this._name = name;

    LoggerService.log(LOGGER_SECURITY, `create with version=${version} name=${this._name}`);
  }

  public encrypt(config: TokenConfig) {
    const salt = genSaltSync(2);
    LoggerService.log(LOGGER_SECURITY, `encrypt token with config=${JSON.stringify(config)}`);
    LoggerService.log(LOGGER_SECURITY, `encrypt token with salt=${salt}`);

    const password = hashSync(this._name, salt);
    const token = sign({ username: config.username }, password, {
      algorithm: this._config.algorithm,
      expiresIn: config.expire,
      notBefore: config.issue,
      issuer: config.issuer,
      jwtid: this._config.id,
    });

    return {
      token: this._shuffle(token),
      salt,
      name: this._name,
      exp: config.expire,
      iss: config.issue,
    };
  }

  public decrypt(token: string, salt: string): string | object {
    const password = hashSync(this._name, salt);
    return verify(this._shuffle(token), password, {
      jwtid: this._config.id,
      issuer: "admin",
    });
  }
}

export { Package };

import { genSaltSync, hashSync } from "bcryptjs";
import { sign, verify } from "jsonwebtoken";
import Exception, { ERR_SCT } from "nd-error";
import LoggerService, { LOGGER_SECURITY } from "nd-logger";

import config, { ConfigJson } from "../config";

interface TokenConfig {
  username: string;
  expire?: "1h" | "24h" | "7d" | "1m" | "1y" | "100y";
  when?: "1ms" | "1d" | "7d";
  issuer?: "admin" | "selfgen";
}

type versionName = "v1";

export default class NdSecurity {
  private _config: ConfigJson;
  private _name: string;

  private _hash(str: string) {
    return Buffer.from(str, "utf8").toString("hex");
  }

  private _unhash(str: string) {
    return Buffer.from(str, "hex").toString("utf8");
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
    LoggerService.log(LOGGER_SECURITY, `encrypt with password=${password}`);

    const token = sign({ username: config.username }, password, {
      algorithm: this._config.algorithm,
      expiresIn: config.expire,
      notBefore: config.when,
      issuer: config.issuer,
      jwtid: this._config.id,
    });
    LoggerService.log(LOGGER_SECURITY, `before hash token=${token}`);

    return {
      token: this._hash(token),
      salt: this._hash(salt),
      name: this._name,
      exp: config.expire,
      nbf: config.when,
    };
  }

  public decrypt(token: string, salt: string): { username: string; expire: number; issue: number; notBefore: number } {
    try {
      const password = hashSync(this._name, this._unhash(salt));
      LoggerService.log(LOGGER_SECURITY, `decrypt with password=${password}`);

      const obj = verify(this._unhash(token), password, {
        jwtid: this._config.id,
        issuer: "admin",
      }) as any;

      LoggerService.log(LOGGER_SECURITY, `return object %O, `, obj);
      return {
        username: obj.username,
        expire: obj.exp * 1000,
        issue: obj.iat * 1000,
        notBefore: obj.nbf * 1000, // convert to millisecond that supported by javascript Date
      };
    } catch (e) {
      throw Exception.cast(e, { base: ERR_SCT });
    }
  }
}

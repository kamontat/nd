import { genSaltSync, hashSync } from "bcryptjs";
import { sign, verify } from "jsonwebtoken";
import Exception, { ERR_SCT } from "nd-error";
import LoggerService, { LOGGER_SECURITY } from "nd-logger";

import config, { IConfigJson } from "../config";

interface ITokenConfig {
  username: string;
  expire?: "1h" | "24h" | "7d" | "30d" | "1y" | "100y";
  when?: "1ms" | "1d" | "7d";
  issuer?: "admin" | "selfgen";
}

type versionName = "v1";

interface IResponseFormat {
  username: string;
  expire: number;
  issue: number;
  notBefore: number;
}

export default class Security {
  private _config: IConfigJson;
  private _name: string;

  private _caches?: IResponseFormat;

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

  public encrypt(config: ITokenConfig) {
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

  public isVerified(token: string, salt: string): boolean {
    try {
      this.decrypt(token, salt);
      return true;
    } catch (e) {
      return false;
    }
  }

  public decrypt(token: string, salt: string): IResponseFormat {
    try {
      const password = hashSync(this._name, this._unhash(salt));
      LoggerService.log(LOGGER_SECURITY, `decrypt with password=${password}`);

      const obj = verify(this._unhash(token), password, {
        jwtid: this._config.id,
        issuer: "admin",
      }) as any;

      LoggerService.log(LOGGER_SECURITY, `return object %O, `, obj);
      const response = {
        username: obj.username,
        expire: obj.exp * 1000,
        issue: obj.iat * 1000,
        notBefore: obj.nbf * 1000, // convert to millisecond that supported by javascript Date
      };

      this._caches = response;
      return response;
    } catch (e) {
      throw Exception.cast(e, { base: ERR_SCT });
    }
  }

  get response() {
    if (this._caches) return this._caches;
    return undefined;
  }
}

import { genSaltSync, hashSync } from "bcryptjs";
import { sign, verify } from "jsonwebtoken";
import Exception, { ERR_SCT } from "@nd/error";
import LoggerService, { LOGGER_SECURITY } from "@nd/logger";

import { hash, unhash } from "../apis/hash";
import GenerateFirebaseName from "../apis/methods/GenerateFirebaseName";
import config, { IConfigJson } from "../config";

import Server from "./Server";

interface ITokenConfig {
  expire?: "1h" | "24h" | "7d" | "30d" | "1y" | "100y";
  issuer?: "admin" | "selfgen";
  username: string;
  when?: "1ms" | "1d" | "7d";
}

type versionName = "v1";

export interface IRawResponseFormat {
  exp: number;
  fbname: string;
  iat: number;
  nbf: number;
  username: string;
}

export interface IResponseFormat {
  expire: number;
  fbname: string;
  issue: number;
  notBefore: number;
  username: string;
}

export default class Security {
  get response() {
    if (this._caches) return this._caches;
    return undefined;
  }

  get server() {
    return this._server;
  }

  private _caches?: IResponseFormat;
  private _config: IConfigJson;
  private _name: string;

  private _server: Server;

  constructor(version: versionName, name: string) {
    this._config = config[version];
    this._name = name;

    LoggerService.log(
      LOGGER_SECURITY,
      `create with version=${version} name=${this._name}`
    );

    this._server = new Server(this);
  }

  public decrypt(token: string, salt: string): IResponseFormat {
    try {
      const password = hashSync(this._name, unhash(salt));
      LoggerService.log(LOGGER_SECURITY, `decrypt with password=${password}`);

      const obj = verify(unhash(token), password, {
        jwtid: this._config.id,
        issuer: "admin"
      }) as IRawResponseFormat;

      LoggerService.log(LOGGER_SECURITY, `return object %O, `, obj);
      const response = {
        username: obj.username,
        fbname: obj.fbname,
        expire: obj.exp * 1000,
        issue: obj.iat * 1000,
        notBefore: obj.nbf * 1000 // convert to millisecond that supported by javascript Date
      };

      this._caches = response;
      return response;
    } catch (e) {
      throw Exception.cast(e, { base: ERR_SCT });
    }
  }

  public encrypt(config: ITokenConfig) {
    const salt = genSaltSync(2);

    LoggerService.log(
      LOGGER_SECURITY,
      `encrypt token with config=${JSON.stringify(config)}`
    );
    LoggerService.log(LOGGER_SECURITY, `encrypt token with salt=${salt}`);

    const password = hashSync(this._name, salt);
    LoggerService.log(LOGGER_SECURITY, `encrypt with password=${password}`);

    const fbname = GenerateFirebaseName(config.username);
    const token = sign({ username: config.username, fbname }, password, {
      algorithm: this._config.algorithm,
      expiresIn: config.expire,
      notBefore: config.when,
      issuer: config.issuer,
      jwtid: this._config.id
    });

    LoggerService.log(LOGGER_SECURITY, `before hash token=${token}`);

    return {
      token: hash(token),
      fbname,
      salt: hash(salt),
      name: this._name,
      exp: config.expire,
      nbf: config.when
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
}

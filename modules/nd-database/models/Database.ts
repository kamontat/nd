import firebase, { app, database } from "firebase";
import "firebase/database";
import ExceptionService, { ERR_DBO } from "nd-error";
import LoggerService, { LOGGER_FIREBASE } from "nd-logger";

import IDatabase from "./IDatabase";

export default class Database implements IDatabase<database.DataSnapshot> {
  private _db: database.Database;

  constructor(app: app.App) {
    this._db = firebase.database(app);
    // LoggerService.log(LOGGER_FIREBASE, this._db);
  }

  public append(path: string, value: any) {
    LoggerService.log(LOGGER_FIREBASE, `append ${value} to ${path}`);
    const newRef = this._db.ref(path).push();
    return newRef.set(value).catch(err => {
      new Promise((_, rej) => rej(ExceptionService.cast(err, { base: ERR_DBO })));
    }) as Promise<database.DataSnapshot>;
  }

  public read(path: string) {
    LoggerService.log(LOGGER_FIREBASE, `start read value from ${path}`);
    return this._db
      .ref(path)
      .once("value")
      .catch(err => {
        new Promise((_, rej) => rej(ExceptionService.cast(err, { base: ERR_DBO })));
      }) as Promise<database.DataSnapshot>;
  }

  public write(path: string, value: any) {
    LoggerService.log(LOGGER_FIREBASE, `start write ${value} to ${path}`);
    return this._db
      .ref(path)
      .update(value)
      .catch(err => {
        new Promise((_, rej) => rej(ExceptionService.cast(err, { base: ERR_DBO })));
      }) as Promise<database.DataSnapshot>;
  }
}

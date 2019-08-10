import firebase, { app, database } from "firebase";
import "firebase/database";
import ExceptionService, { ERR_DBO } from "nd-error";
import LoggerService, { LOGGER_FIREBASE } from "nd-logger";

import IDatabase from "./IDatabase";

export default class Database implements IDatabase {
  private _db: database.Database;

  constructor(app: app.App) {
    this._db = firebase.database(app);
    // LoggerService.log(LOGGER_FIREBASE, this._db);
  }

  public read(path: string) {
    LoggerService.log(LOGGER_FIREBASE, `start read value from ${path}`);
    return this._db
      .ref(path)
      .once("value")
      .then(v => {
        LoggerService.log(LOGGER_FIREBASE, `get value of command/test: %O`, v);
      })
      .catch(err => {
        LoggerService.error(LOGGER_FIREBASE, `%O`, err);
      });
  }
}

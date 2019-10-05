import firebase, { firestore } from "firebase/app";
import "firebase/firestore";
import ExceptionService, { ERR_DBO } from "@nd/error";
import LoggerService, { LOGGER_FIREBASE, LOGGER_FIREBASE_NOSQL } from "@nd/logger";

import IDatabase from "./IDatabase";

declare let __FIREBASE_API_KEY__: string;
declare let __FIREBASE_AUTH_DOMAIN__: string;
declare let __FIREBASE_DATABASE_URL__: string;
declare let __FIREBASE_PROJECT_ID__: string;
declare let __FIREBASE_STORAGE_BUCKET__: string;
declare let __FIREBASE_MESSAGING_SENDER_ID__: string;
declare let __FIREBASE_APP_ID__: string;

export default class Database implements IDatabase<firestore.DocumentSnapshot> {
  private _db: firestore.Firestore;

  constructor() {
    if (firebase.apps.length === 0) {
      const app = firebase.initializeApp({
        apiKey: process.env.NODE_ENV === "test" ? "" : __FIREBASE_API_KEY__,
        authDomain: process.env.NODE_ENV === "test" ? "" : __FIREBASE_AUTH_DOMAIN__,
        databaseURL: process.env.NODE_ENV === "test" ? "" : __FIREBASE_DATABASE_URL__,
        projectId: process.env.NODE_ENV === "test" ? "" : __FIREBASE_PROJECT_ID__,
        storageBucket: process.env.NODE_ENV === "test" ? "" : __FIREBASE_STORAGE_BUCKET__,
        messagingSenderId: process.env.NODE_ENV === "test" ? "" : __FIREBASE_MESSAGING_SENDER_ID__,
        appId: process.env.NODE_ENV === "test" ? "" : __FIREBASE_APP_ID__,
      });
      // LoggerService.log(LOGGER_FIREBASE, app);

      this._db = firebase.firestore(app);
    } else this._db = firebase.firestore();

    // LoggerService.log(LOGGER_FIREBASE_NOSQL, this._db);
  }

  public read(path: string) {
    const p = this.split(path);
    LoggerService.log(LOGGER_FIREBASE_NOSQL, `reading value from { ${p.root}: ${p.next} }`);

    return this._db
      .collection(p.root)
      .doc(p.next)
      .get()
      .catch(err => {
        return new Promise((_, rej) => rej(ExceptionService.cast(err, { base: ERR_DBO })));
      }) as Promise<firestore.DocumentSnapshot>;
  }

  public write(path: string, value: any) {
    const p = this.split(path);
    LoggerService.log(LOGGER_FIREBASE_NOSQL, `reading value from { ${p.root}: ${p.next} }`);

    return this._db
      .collection(p.root)
      .doc(p.next)
      .update(value)
      .catch(err => {
        return new Promise((_, rej) => rej(ExceptionService.cast(err, { base: ERR_DBO })));
      }) as Promise<firestore.DocumentSnapshot>;
  }

  private split(path: string) {
    const __arr = path.split("/");
    return {
      root: __arr.shift() || "",
      next: __arr.join("/"),
    };
  }
}

import firebase, { firestore } from "firebase/app";
import "firebase/firestore";
import ExceptionService, { ERR_DBO, ERR_DWL } from "@nd/error";
import LoggerService, { LOGGER_FIREBASE_NOSQL } from "@nd/logger";

import FBO from "./FBO";

export default class Database extends FBO<firestore.DocumentSnapshot> {
  private _db: firestore.Firestore;

  constructor() {
    super();

    this._db = firebase.firestore(this.app);
  }

  public read(path: string) {
    const p = this.split(path);
    LoggerService.log(LOGGER_FIREBASE_NOSQL, `reading value from { ${p.root}: ${p.next} }`);

    return this._db
      .collection(p.root)
      .doc(p.next)
      .get()
      .catch(err => {
        // internet not available
        if (err.code && err.code === "unavailable" && err.name === "FirebaseError") {
          return new Promise((_, rej) => rej(ExceptionService.build(ERR_DWL).description("no internet connection")));
        }

        return new Promise((_, rej) => rej(ExceptionService.cast(err, { base: ERR_DBO })));
      }) as Promise<firestore.DocumentSnapshot>;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

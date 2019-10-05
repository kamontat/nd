import firebase, { storage } from "firebase/app";
import "firebase/storage";
import ExceptionService, { ERR_DBO } from "@nd/error";

import { IDatabase } from "..";

declare let __FIREBASE_API_KEY__: string;
declare let __FIREBASE_AUTH_DOMAIN__: string;
declare let __FIREBASE_DATABASE_URL__: string;
declare let __FIREBASE_PROJECT_ID__: string;
declare let __FIREBASE_STORAGE_BUCKET__: string;
declare let __FIREBASE_MESSAGING_SENDER_ID__: string;
declare let __FIREBASE_APP_ID__: string;

export default class Storage implements IDatabase {
  private _storage: storage.Storage;

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

      this._storage = firebase.storage(app);
    } else this._storage = firebase.storage();

    // LoggerService.log(LOGGER_FIREBASE_STORAGE, this._storage);
  }

  /**
   * path should be only of the list below
   *
   * `version` is a version number will remove all '.', '-', 'prefix' and 'suffix'
   * `os` should be one of this; otherwise, exception will be thrown. ['macos', 'win', 'linux']
   *
   * @param path path should be <version>/<os>
   *
   */
  public read(path: string) {
    const __arr = path.split("/");
    if (__arr.length !== 2) throw ExceptionService.build(ERR_DBO, "TECH: read path format is invalid");

    const ver = __arr[0].replace(".", "").replace("-", "");
    const os = __arr[1];
    if (os !== "win" && os !== "linux" && os !== "macos")
      throw ExceptionService.build(
        ERR_DBO,
        `this ${os} is not exist in system; should be either 'win', 'macos' or 'linux'`,
      );

    let fileName = "";
    if (os === "win") fileName = "nd-win.exe";
    else if (os === "linux") fileName = "nd-linux";
    else if (os === "macos") fileName = "nd-macos";

    return this._storage.ref(`${ver}/${fileName}`).getDownloadURL();
  }

  public write() {
    return new Promise((_, rej) => rej(ExceptionService.build(ERR_DBO, "cannot write anything to storage server")));
  }
}

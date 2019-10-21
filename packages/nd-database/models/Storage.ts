import firebase, { storage } from "firebase/app";
import "firebase/storage";
import ExceptionService, { ERR_DBO } from "@nd/error";

import FBO from "./FBO";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default class Storage extends FBO<any> {
  private _storage: storage.Storage;

  constructor() {
    super();
    this._storage = firebase.storage(this.app);
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

  /**
   * readonly storage
   */
  public write() {
    return new Promise((_, rej) => rej(ExceptionService.build(ERR_DBO, "cannot write anything to storage server")));
  }
}

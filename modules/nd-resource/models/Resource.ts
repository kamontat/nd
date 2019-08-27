import { DeprecateFile, DeprecateFileManager } from "nd-file";
import LoggerService, { LOGGER_NOVEL_RESOURCE } from "nd-logger";
import { Novel } from "nd-novel";
import { Encryption } from "nd-security";

import { RESOURCE_FILENAME } from "../constants";

export default class Resource {
  public get filename() {
    return this.fileName;
  }
  public set json(json: string) {
    LoggerService.log(LOGGER_NOVEL_RESOURCE, `updating resource json from ${this._json} to ${json}`);
    this._json = json;
  }

  public static File = class extends Resource {
    constructor(directory: string, fileName: string = RESOURCE_FILENAME) {
      super(fileName);

      const file = new DeprecateFile(directory);
      const obj = file.readSync({ filename: fileName, alias: "resource" });

      this.json = obj.resource;
    }
  };

  public static Novel = class extends Resource {
    constructor(n: Novel) {
      super(RESOURCE_FILENAME, JSON.stringify(n.toJSON({ content: false })));
    }
  };

  constructor(private fileName: string = RESOURCE_FILENAME, private _json: string = "") {
    LoggerService.log(
      LOGGER_NOVEL_RESOURCE,
      `constructor of resource on file=${this.fileName} and content=${this._json}`,
    );
  }

  public decode() {
    return Encryption.decrypt(this._json);
  }

  public encode() {
    return Encryption.encrypt(this._json);
  }

  public read<T extends DeprecateFileManager>(fileManager: T) {
    fileManager.add({ filename: this.fileName, alias: "resource" });
  }

  public write<T extends DeprecateFileManager>(fileManager: T) {
    fileManager.add({ filename: this.fileName, content: this.encode(), opts: { force: false } });
  }
}

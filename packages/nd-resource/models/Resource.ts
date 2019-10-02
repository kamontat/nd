import FileSystem, { FileAction, FileSyncManager, FileType } from "@nd/file";
import { WriteOption } from "@nd/file/models/interface/defined"; // rare case
import LoggerService, { LOGGER_NOVEL_RESOURCE } from "@nd/logger";
import { Novel } from "@nd/novel";
import { Encryption } from "@nd/security";

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

      const file = new FileSyncManager(directory);
      this.json = file.read({ name: fileName, type: FileType.FILE });
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

  public read(system: FileSystem) {
    return system.add("resource", { action: FileAction.READ, name: this.fileName });
  }

  public write(system: FileSystem, options?: WriteOption) {
    if (!options) options = { force: false };

    return system.add("resource", {
      action: FileAction.WRITE,
      name: this.fileName,
      content: this.encode(),
      opts: options,
    });
  }
}

import fs from "fs";
import LoggerService, { LOGGER_FILE } from "nd-logger";
import path from "path";

import Package from "./package.json";

export default class FileManager {
  constructor(private directory: string, name?: string) {
    if (name) this.directory = this.buildPath(name); // append name to directory

    if (!fs.existsSync(this.directory)) {
      LoggerService.log(LOGGER_FILE, `base directory is not exist (${this.directory})`);
      fs.mkdirSync(this.directory, { recursive: true });
    }
  }

  public name(name?: string) {
    if (!name) return;

    this.directory = this.buildPath(name); // append name to directory

    if (!fs.existsSync(this.directory)) {
      LoggerService.log(LOGGER_FILE, `extend directory is not exist (${this.directory})`);
      fs.mkdirSync(this.directory, { recursive: true });
    }
  }

  public save(content: string, fileName: string, opts?: { force?: boolean }) {
    const defaultOptions = {
      force: false,
      ...opts,
    };
    LoggerService.log(LOGGER_FILE, `save to file with option=%O`, defaultOptions);

    const p = this.buildPath(fileName);
    if (!fs.existsSync(p) || defaultOptions.force) {
      LoggerService.log(LOGGER_FILE, `force save file even it already exist`);
      fs.writeFileSync(p, content, { encoding: "utf8", mode: 0o666, flag: "w" });
    }
  }

  private buildPath(name: string) {
    return path.resolve(this.directory, name);
  }
}

export { Package };

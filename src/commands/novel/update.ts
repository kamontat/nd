import { ICommandCallback } from "nd-commandline-interpreter";
import ExceptionService, { ERR_FLE } from "nd-error";
import { DeprecateFileManager } from "nd-file";
import LoggerService, { LOGGER_NOVEL_UPDATER } from "nd-logger";
import { RESOURCE_FILENAME } from "nd-resource";
import path from "path";

const __main: ICommandCallback = async ({ value, apis }) => {
  const opts = {
    thread: apis.config.get<number>("novel.thread", 4), // thread number to fetch and update
    change: apis.config.get<boolean>("novel.change", false), // show updating changes
    recursive: apis.config.get<boolean>("novel.update.recusive", false), // recursive check subfolder
  };

  LoggerService.log(
    LOGGER_NOVEL_UPDATER,
    `start update novel with options thread=${opts.thread},change=${opts.change},recursive=${opts.recursive}`,
  );

  const p = path.resolve(value || "");

  const manager = new DeprecateFileManager.read(p);
  manager.onError("folder-not-found", param => {
    throw ExceptionService.build(ERR_FLE, `${param} is not a valid directory path`);
  });
  manager.load();

  manager.add({ filename: RESOURCE_FILENAME });

  LoggerService.log(LOGGER_NOVEL_UPDATER, `receive ${p} is a novel path`);
};

export default __main;

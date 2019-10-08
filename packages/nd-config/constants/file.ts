import LoggerService, { LOGGER_CONFIG } from "@nd/logger";
import { PathUtils } from "@nd/helper";

export const CONFIG_FILENAME = "config";
export const CONFIG_EXTENSION = "ndc";
export const CONFIG_PATH = `${CONFIG_FILENAME}.${CONFIG_EXTENSION}`;

export const BACKUP_NAME = (path: string) => {
  const name = PathUtils.Cachename(path, CONFIG_EXTENSION, 3);
  LoggerService.log(LOGGER_CONFIG, `build backup file called ${name}`);
  return name;
};

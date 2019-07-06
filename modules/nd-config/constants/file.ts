import LoggerService, { LOGGER_CONFIG } from "nd-logger";

export const CONFIG_EXTENSION = "ndc";

export const BACKUP_NAME = (path: string) => {
  const name = `${path.replace(`.${CONFIG_EXTENSION}`, "")}-B${+new Date()}.${CONFIG_EXTENSION}`;
  LoggerService.log(LOGGER_CONFIG, `build backup file called ${name}`);
  return name;
};

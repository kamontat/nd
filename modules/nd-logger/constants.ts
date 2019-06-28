import Logger from "./models/Logger";

export const LOGGER_ROOT = new Logger("nd");

export const LOGGER_CLI = LOGGER_ROOT.extend("cli");
export const LOGGER_CLI_BUILDER = LOGGER_CLI.extend("builder");
export const LOGGER_CLI_CONFIG = LOGGER_CLI.extend("config");

export const LOGGER_SECURITY = LOGGER_ROOT.extend("security");

export const LOGGER_CONFIG = LOGGER_ROOT.extend("config");

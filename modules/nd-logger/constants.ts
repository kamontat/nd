import Logger from "./models/Logger";

export const LOGGER_ROOT = new Logger("nd");

export const LOGGER_CLI = LOGGER_ROOT.extend("cli");
export const LOGGER_CLI_BUILDER = LOGGER_CLI.extend("builder");
export const LOGGER_CLI_CONFIG = LOGGER_CLI.extend("config");

export const LOGGER_SECURITY = LOGGER_ROOT.extend("security");

export const LOGGER_CONFIG = LOGGER_ROOT.extend("config");

export const LOGGER_DOWNLOADER = LOGGER_ROOT.extend("download");
export const LOGGER_DOWNLOADER_MANAGER = LOGGER_DOWNLOADER.extend("manager");
export const LOGGER_DOWNLOADER_DECODER = LOGGER_DOWNLOADER.extend("decoder");

export const LOGGER_NOVEL = LOGGER_ROOT.extend("novel");
export const LOGGER_NOVEL_DOWNLOADER = LOGGER_NOVEL.extend("download");
export const LOGGER_NOVEL_UPDATER = LOGGER_NOVEL.extend("update");

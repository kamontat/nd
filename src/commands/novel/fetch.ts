import { ICommandCallback } from "nd-commandline-interpreter";
import LoggerService, { LOGGER_NOVEL_FETCHER } from "nd-logger";

const __main: ICommandCallback = ({ value }) => {
  LoggerService.log(LOGGER_NOVEL_FETCHER, value);
};

export default __main;

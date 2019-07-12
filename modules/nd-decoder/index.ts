import { decode } from "iconv-lite";
import ExceptionService, { ERR_DCR } from "nd-error";
import LoggerService, { LOGGER_DOWNLOADER_DECODER } from "nd-logger";

import Package from "./package.json";

export type DecodeSupport = "TIS-620" | "UTF-8";

export default (str: string, encode: DecodeSupport) => {
  const buf = Buffer.from(str);
  LoggerService.log(LOGGER_DOWNLOADER_DECODER, `string encode format is ${encode}`);

  try {
    return decode(buf, encode === "UTF-8" ? "UTF-8" : "ISO-8859-11");
  } catch (e) {
    throw ExceptionService.cast(e, { base: ERR_DCR });
  }
};

export { Package };

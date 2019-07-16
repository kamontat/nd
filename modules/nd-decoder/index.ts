import { decode } from "iconv-lite";
import ExceptionService, { ERR_DCR } from "nd-error";
import LoggerService, { LOGGER_DOWNLOADER_DECODER } from "nd-logger";

import Package from "./package.json";

export type DecodeSupport = "TIS-620" | "UTF-8";

export default (buf: Buffer, encode: DecodeSupport) => {
  try {
    return decode(buf, encode);
  } catch (e) {
    throw ExceptionService.cast(e, { base: ERR_DCR });
  }
};

export { Package };

import { ExceptionState } from "../models/ExceptionState";
import { IExceptionState } from "../models/IExceptionState";

export const ERR_CLI: IExceptionState = new ExceptionState("CLI", "Commandline");

export const ERR_CFG: IExceptionState = new ExceptionState("CFG", "Configuration");

export const ERR_HLP: IExceptionState = new ExceptionState("HLP", "Helper and APIs");

export const ERR_DWL: IExceptionState = new ExceptionState("DWL", "Download");

export const ERR_DCR: IExceptionState = new ExceptionState("DCR", "Decoding");

export const ERR_NLV: IExceptionState = new ExceptionState("NLV", "Novel");

export const ERR_LOG: IExceptionState = new ExceptionState("LOG", "Logging");

export const ERR_SCT: IExceptionState = new ExceptionState("SCT", "Security and Authentication");

export const ERR_GNL: IExceptionState = new ExceptionState("GNL", "General");

export const ERR_DBO: IExceptionState = new ExceptionState("DBO", "Database");

export const ERR_FLE: IExceptionState = new ExceptionState("FLE", "File system");

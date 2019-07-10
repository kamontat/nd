import { ExceptionState } from "../models/ExceptionState";
import { IExceptionState } from "../models/IExceptionState";

export const ERR_CLI: IExceptionState = new ExceptionState("CLI", "commandline exception", true);

export const ERR_CFG: IExceptionState = new ExceptionState("CFG", "configuration error", true);

export const ERR_HLP: IExceptionState = new ExceptionState("HLP", "helper and apis error", true);

export const ERR_NLV: IExceptionState = new ExceptionState("NLV", "Novel error", true);

export const WRN_NLV: IExceptionState = new ExceptionState("NLV", "Novel warning", false);

export const ERR_LOG: IExceptionState = new ExceptionState("LOG", "Logging error", true);

export const ERR_SCT: IExceptionState = new ExceptionState("SCT", "security and authentication error", true);

export const ERR_GNL: IExceptionState = new ExceptionState("GNL", "general exception", true);

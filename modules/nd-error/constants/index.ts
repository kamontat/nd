import { ExceptionState } from "../models/ExceptionState";
import { IExceptionState } from "../models/IExceptionState";

export const ERR_CLI: IExceptionState = new ExceptionState("CLI", "commandline");

export const ERR_CFG: IExceptionState = new ExceptionState("CFG", "configuration");

export const ERR_HLP: IExceptionState = new ExceptionState("HLP", "helper and apis");

export const ERR_DWL: IExceptionState = new ExceptionState("DWL", "download");

export const ERR_NLV: IExceptionState = new ExceptionState("NLV", "Novel");

export const ERR_LOG: IExceptionState = new ExceptionState("LOG", "Logging");

export const ERR_SCT: IExceptionState = new ExceptionState("SCT", "security and authentication");

export const ERR_GNL: IExceptionState = new ExceptionState("GNL", "general");

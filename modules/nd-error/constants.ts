export interface ExceptionState {
  code: string;
  name: string;
  exit: boolean;
}

export const CLI_Exception: ExceptionState = {
  code: "CLI",
  name: "commandline exception",
  exit: true,
};

export const CFG_Exception: ExceptionState = {
  code: "CFG",
  name: "configuration error",
  exit: true,
};

export const HLP_Exception: ExceptionState = {
  code: "HLP",
  name: "helper and apis error",
  exit: true,
};

export const NLV_Exception: ExceptionState = {
  code: "NLV",
  name: "Novel error",
  exit: true,
};

export const LOG_Exception: ExceptionState = {
  code: "LOG",
  name: "Logging error",
  exit: true,
};

export const SCT_Exception: ExceptionState = {
  code: "SCT",
  name: "security and authentication error",
  exit: true,
};

export const GNL_Exception: ExceptionState = {
  code: "GNL",
  name: "general exception",
  exit: true,
};

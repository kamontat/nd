export interface ExceptionState {
  code: string;
  name: string;
  exit: boolean;
}

export const ERR_CLI: ExceptionState = {
  code: "CLI",
  name: "commandline exception",
  exit: true,
};

export const ERR_CFG: ExceptionState = {
  code: "CFG",
  name: "configuration error",
  exit: true,
};

export const ERR_HLP: ExceptionState = {
  code: "HLP",
  name: "helper and apis error",
  exit: true,
};

export const ERR_NLV: ExceptionState = {
  code: "NLV",
  name: "Novel error",
  exit: true,
};

export const WRN_NLV: ExceptionState = {
  code: "NLV",
  name: "Novel warning",
  exit: false,
};

export const ERR_LOG: ExceptionState = {
  code: "LOG",
  name: "Logging error",
  exit: true,
};

export const ERR_SCT: ExceptionState = {
  code: "SCT",
  name: "security and authentication error",
  exit: true,
};

export const ERR_GNL: ExceptionState = {
  code: "GNL",
  name: "general exception",
  exit: true,
};

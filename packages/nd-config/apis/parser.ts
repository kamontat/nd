import LoggerService, { LOGGER_CONFIG } from "nd-logger";

import { ConfigKey, ConfigValue } from "../models/IConfigurationTypeDefined";

interface IKeyValue {
  key: ConfigKey;
  value: ConfigValue;
}

const configParser = (line: string): IKeyValue | undefined => {
  const _line = line.split("#"); // remove all space
  // with comment
  if (_line.length > 1) {
    if (_line[0].trim() === "") {
      LoggerService.log(LOGGER_CONFIG, `auto detect comment line '${_line[1]}'`);
      return;
    }
    line = _line[0]; // remove # inline comment
    LoggerService.log(LOGGER_CONFIG, `auto detect inline comment '${_line[1]}'`);
  }
  const _arr = line.split("=");
  if (_arr.length !== 2) {
    LoggerService.log(LOGGER_CONFIG, `ignore this line ${line}`);
    return;
  }
  const key = _arr[0];
  const value = _arr[1].trim();

  if (!key || !value) return undefined;

  return {
    key: key as ConfigKey,
    value,
  };
};

export const ConfigParser = (line?: string): IKeyValue[] | undefined => {
  if (!line) return undefined;

  if (line.includes(",")) {
    const arr: Array<IKeyValue> = [];
    line.split(",").forEach(l => {
      const r = configParser(l);
      if (r) arr.push(r);
    });
    return arr;
  } else {
    const config = configParser(line);
    if (!config) return undefined;
    else return [config];
  }
};

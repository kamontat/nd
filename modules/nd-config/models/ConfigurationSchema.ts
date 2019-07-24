import ExceptionService, { ERR_CFG } from "nd-error";

interface IConfigurationSchema {
  choices?: Array<string>;
  type: "string" | "boolean" | "number" | "choices";
}

const ConfigurationSchema = {
  "mode": {
    type: "choices",
    choices: ["development", "production", "testing"],
  },
  "version": {
    type: "choices",
    choices: ["v1", "v2"],
  },
  "auth.token": {
    type: "string",
  },
  "auth.name": {
    type: "string",
  },
  "auth.salt": {
    type: "string",
  },
  "output.color": {
    type: "boolean",
  },
  "output.file": {
    type: "boolean",
  },
  "output.level": {
    type: "choices",
    choices: ["0", "1", "2", "3"],
  },
  "novel.location": {
    type: "string",
  },
} as { [key: string]: IConfigurationSchema };

const CONFIG_KEY_NOT_EXIST = (name: string) =>
  ExceptionService.warn.build(ERR_CFG, `'${name}' config key is not exist in application`);
const CONFIG_VALUE_NOT_EXIST = (name: string) =>
  ExceptionService.warn.build(ERR_CFG, `you try to config '${name}' with empty value`);
const CONFIG_MISS_TYPE = (name: string, value: any) => {
  const schema = ConfigurationSchema[name];
  const type = schema.type === "choices" ? schema.choices : schema.type;
  return ExceptionService.warn.build(
    ERR_CFG,
    `${name} configuration need type of '${type}' but you pass ${value} instead`,
  );
};

export const DoValidation = <T>(key: string, value?: any): { err?: Error; value?: T } => {
  const schema = ConfigurationSchema[key];
  if (!schema) return { err: CONFIG_KEY_NOT_EXIST(key) };
  if (value === undefined || value === "" || value === null) return { err: CONFIG_VALUE_NOT_EXIST(key) };

  if (schema.type === "choices") {
    if (schema.choices && schema.choices.includes(value)) return { value };
    else return { err: CONFIG_MISS_TYPE(key, value) };
  } else {
    if (schema.type === "string" && typeof value === schema.type) return { value };
    else if (schema.type === "number") {
      try {
        return { value: parseInt(value, 10) as any };
      } catch (e) {
        return { err: CONFIG_MISS_TYPE(key, value) };
      }
    } else if (schema.type === "boolean") {
      if (value === true || value === "true" || value === "1" || value === 1) return { value: true as any };
      else if (value === false || value === "false" || value === "0" || value === 0) return { value: false as any };
      else return { err: CONFIG_MISS_TYPE(key, value) };
    }

    return { err: CONFIG_MISS_TYPE(key, value) };
  }
};

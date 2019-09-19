import chalk from "chalk";

const _customBooleanFn = (b: boolean | string, alternativeTrue?: string, alternativeFalse?: string) => {
  if (b === true || b === "true" || (alternativeTrue && b === alternativeTrue))
    return chalk.greenBright(alternativeTrue || "true");
  else if (b === false || b === "false" || (alternativeFalse && b === alternativeFalse))
    return chalk.redBright(alternativeFalse || "false");
  else return b.toString();
};

export default {
  appname: chalk.greenBright,
  command: chalk.magentaBright,
  date: chalk.blueBright,
  datetime: chalk.blueBright,
  dim: chalk.dim,
  fail: chalk.red,
  format: chalk,
  id: chalk.greenBright,
  important: chalk.underline.redBright,
  key: chalk.blueBright,
  number: chalk.cyan,
  option: chalk.cyan,
  param: chalk.yellowBright,
  pass: chalk.green,
  path: chalk.cyanBright,
  subcommand: chalk.magenta,
  time: chalk.greenBright,
  url: chalk.green.underline,
  value: chalk.greenBright,
  version: chalk.cyanBright,
  name: chalk.blueBright,
  enum: chalk.redBright,
  boolean: _customBooleanFn,
};

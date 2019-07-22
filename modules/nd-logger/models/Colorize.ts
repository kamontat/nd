import chalk from "chalk";

export default {
  important: chalk.underline.redBright,
  pass: chalk.green,
  fail: chalk.red,
  date: chalk.greenBright,
  time: chalk.greenBright,
  datetime: chalk.greenBright,
  number: chalk.cyan,
  id: chalk.greenBright,
  url: chalk.green.underline,
  appname: chalk.greenBright,
  command: chalk.magentaBright,
  subcommand: chalk.magenta,
  option: chalk.cyan,
  param: chalk.yellowBright,
  version: chalk.blueBright,
  dim: chalk.dim,
  format: chalk,
  path: chalk.cyanBright,
};

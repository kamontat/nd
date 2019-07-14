import chalk from "chalk";

export default {
  important: chalk.underline.redBright,
  pass: chalk.green,
  fail: chalk.red,
  date: chalk.greenBright,
  time: chalk.greenBright,
  datetime: chalk.greenBright,
  number: chalk.cyan,
  id: chalk.cyanBright,
  url: chalk.green.underline,
  appname: chalk.yellowBright,
  command: chalk.greenBright,
  subcommand: chalk.green,
  option: chalk.blueBright,
  param: chalk.cyan,
  version: chalk.blueBright,
  dim: chalk.dim,
  format: chalk,
};

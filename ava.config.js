const development = "development";
const test = "test";
const production = "production";

const isDev = process.env.NODE_ENV === development;
const isTest = process.env.NODE_ENV === test;
const isProd = process.env.NODE_ENV === production;

const chooseByEnv = (d, t, p) => {
  if (isDev) return d;
  if (isTest) return t;
  if (isProd) return p;

  return t; // default is test
};

module.exports.default = {
  cache: chooseByEnv(true, true, false),
  concurrency: chooseByEnv(3, 5, 1),
  files: ["**/*.spec.*", "!**/_*.spec.*"],
  compileEnhancements: false,
  verbose: chooseByEnv(true, true, false),
  extensions: ["ts"],
  require: ["ts-node/register"],
  environmentVariables: {},
};

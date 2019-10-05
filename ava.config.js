const development = "development";
const test = "test";
const production = "production";

const isDev = process.env.NODE_ENV === development;
const isTest = process.env.NODE_ENV === test;
const isProd = process.env.NODE_ENV === production;

const isCI = process.env.CI === "true" || process.env.CI === true;

// _opts = {
//   ci?: <value>,
//   dev?: <value>,
//   test?: <value>,
//   prod?: <value>,
//   default: <value>,
// }
const chooseByEnv = _opts => {
  const opts = Object.assign(
    { ci: undefined, dev: undefined, test: undefined, prod: undefined, default: undefined },
    _opts,
  );

  if (isCI && opts.ci !== undefined) return opts.ci;
  if (isDev && opts.dev !== undefined) return opts.dev;
  if (isTest && opts.test !== undefined) return opts.test;
  if (isProd && opts.prod !== undefined) return opts.prod;

  return opts.default; // default is test
};

module.exports.default = {
  cache: chooseByEnv({ default: true, prod: false }),
  concurrency: chooseByEnv({ default: 5, prod: 1 }),
  files: ["**/*.spec.*", "!**/_*.spec.*"],
  compileEnhancements: false,
  verbose: chooseByEnv({ default: false, ci: true }),
  extensions: ["ts"],
  require: ["ts-node/register", "tsconfig-paths/register"],
  environmentVariables: {},
};

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

const settings = {
  cache: chooseByEnv({ default: true, prod: false }),
  concurrency: chooseByEnv({ default: 5, prod: 1, ci: 10 }),
  files: ["**/*.spec.*", "!**/_*.spec.*"],
  compileEnhancements: false,
  verbose: chooseByEnv({ default: false, ci: true }),
  extensions: ["ts"],
  require: ["ts-node/register", "tsconfig-paths/register"],
  environmentVariables: {},
};

console.log(`
Environment:
  1. node: ${process.env.NODE_ENV}
  2. ci: ${isCI}
Settings
  1. cache: ${settings.cache}
  2. concurrency: ${settings.concurrency}
  3. files: ${settings.files}
  4. compileEnhancements: ${settings.compileEnhancements}
  5. verbose: ${settings.verbose}
  6. extensions: ${settings.extensions}
  7. require: ${settings.require}
  8. environmentVariables: ${JSON.stringify(settings.environmentVariables)}
`);

module.exports.default = settings;

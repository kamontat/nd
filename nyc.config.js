module.exports = {
  all: true,
  "check-coverage": true,
  reporter: ["lcov", "text-summary", "json"], // https://istanbul.js.org/docs/advanced/alternative-reporters/
  extension: [".ts"],
  include: ["src/**/*.ts", "packages/**/*.ts"],
  exclude: [
    "**/constants/**/*.ts",
    "**/*.d.ts",
    "**/*.spec.ts",
    "docs/**/*",
    "dist/**/*",
    "templates/**/*",
    "packages/webpack-visualizer/**/*",
    "index.ts",
    "admin.ts",
    "**/*.js",
    "packages/nd-core/**/*", // FIXME: temporary disable core since it effect commandline interface
  ],
  branches: 40,
  lines: 40,
  functions: 40,
  statements: 40,
  watermarks: {
    lines: [50, 85],
    functions: [50, 85],
    branches: [50, 85],
    statements: [50, 85],
  },
};

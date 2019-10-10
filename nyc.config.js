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
  ],
  branches: 30,
  lines: 30,
  functions: 30,
  statements: 30,
  watermarks: {
    lines: [70, 85],
    functions: [70, 85],
    branches: [70, 85],
    statements: [70, 85],
  },
};

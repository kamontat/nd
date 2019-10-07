module.exports = {
  all: true,
  "check-coverage": true,
  reporter: ["lcov", "text-summary"], // https://istanbul.js.org/docs/advanced/alternative-reporters/
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
  branches: 20,
  lines: 20,
  functions: 20,
  statements: 20,
  watermarks: {
    lines: [70, 85],
    functions: [70, 85],
    branches: [70, 85],
    statements: [70, 85],
  },
};

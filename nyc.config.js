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
  branches: 70,
  lines: 70,
  functions: 70,
  statements: 70,
  watermarks: {
    lines: [70, 85],
    functions: [70, 85],
    branches: [70, 85],
    statements: [70, 85],
  },
};

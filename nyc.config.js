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
};

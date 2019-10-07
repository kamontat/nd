module.exports = {
  parser: '@typescript-eslint/parser', // Specifies the ESLint parser
  extends: [
    "eslint:recommended",                           // The set of rules which are recommended for all projects by the ESLint Team
    "plugin:@typescript-eslint/eslint-recommended", // Adjust the one from eslint appropriately for TypeScript
    "plugin:@typescript-eslint/recommended",        // Recommended by Typescript Team
    'prettier/@typescript-eslint',                  // Uses eslint-config-prettier to disable ESLint rules from @typescript-eslint/eslint-plugin that would conflict with prettier
    'plugin:prettier/recommended',                  // Enables eslint-plugin-prettier and displays prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
  ],
  rules: {
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/no-var-requires": "off",
    "@typescript-eslint/no-non-null-assertion": "off",
    "@typescript-eslint/interface-name-prefix": ["warn", {
      "prefixWithI": "always", 
      "allowUnderscorePrefix": true
    }],
    "@typescript-eslint/no-unused-vars": ["error", {
      "vars": "local",
      "args": "after-used",
      "argsIgnorePattern": "^_"
    }],
    "@typescript-eslint/no-explicit-any": ["warn", {
      fixToUnknown: false,
      ignoreRestArgs: false,
    }],
    "@typescript-eslint/class-name-casing": ["warn", { 
      "allowUnderscorePrefix": true 
    }]
  },
  "env": {
    "browser": true,
    "node": true
  }
};
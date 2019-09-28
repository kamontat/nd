module.exports = {
  parser: '@typescript-eslint/parser', // Specifies the ESLint parser
  extends: [
    'plugin:@typescript-eslint/recommended', // Uses the recommended rules from the @typescript-eslint/eslint-plugin
    'prettier/@typescript-eslint', // Uses eslint-config-prettier to disable ESLint rules from @typescript-eslint/eslint-plugin that would conflict with prettier
    'plugin:prettier/recommended', // Enables eslint-plugin-prettier and displays prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
  ],
  parserOptions: {
    ecmaVersion: 2018, // Allows for the parsing of modern ECMAScript features
    sourceType: 'module', // Allows for the use of imports
  },
  rules: {
    // Never request return type on function
    "@typescript-eslint/explicit-function-return-type": "off",
    // Always prefix interface with I or _I
    "@typescript-eslint/interface-name-prefix": ["warn", {
      "prefixWithI": "always",
      "allowUnderscorePrefix": true
    }],
    "@typescript-eslint/no-unused-vars": ["error", {
      "argsIgnorePattern": "^_", // Ignore variable with _ 
      "args": "after-used", // Ignore variable before on function argument
      "caughtErrors": "all",
      "caughtErrorsIgnorePattern": "^_" // 
    }],
    "@typescript-eslint/no-explicit-any": ["error", {
      "ignoreRestArgs": false,
      "fixToUnknown": true
    }]
  },
};
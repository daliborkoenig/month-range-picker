const tsParser = require("@typescript-eslint/parser");
const tsPlugin = require("@typescript-eslint/eslint-plugin");
const importPathPlugin = require("eslint-plugin-import-path");
const reactHooksPlugin = require("eslint-plugin-react-hooks");

module.exports = [
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
      "import-path": importPathPlugin,
      "react-hooks": reactHooksPlugin, // Add the react-hooks plugin
    },
    rules: {
      "@typescript-eslint/no-explicit-any": process.env.NODE_ENV === "development" ? 0 : 2,
      "@typescript-eslint/explicit-function-return-type":
        process.env.NODE_ENV === "development" ? 0 : 2,
      "@typescript-eslint/interface-name-prefix": 0,
      "@typescript-eslint/no-unused-vars": process.env.NODE_ENV === "development" ? 0 : 2,
      "@typescript-eslint/camelcase": 0,
      "no-console": process.env.NODE_ENV === "development" ? 0 : 2,
      "no-alert": process.env.NODE_ENV === "development" ? 0 : 2,
      "no-debugger": process.env.NODE_ENV === "development" ? 0 : 2,
      "react-hooks/exhaustive-deps": "warn",
    },
  },
];

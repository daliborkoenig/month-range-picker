import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import importPathPlugin from "eslint-plugin-import-path";
import reactHooksPlugin from "eslint-plugin-react-hooks";

export default [
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
      "react-hooks": reactHooksPlugin,
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

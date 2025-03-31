import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";


export default defineConfig([
  globalIgnores([".turbo/**", "node_modules/**", "**/node_modules/**", "**/dist/**"]),
  { 
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"], 
  },
  { 
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"], 
    languageOptions: { globals: {...globals.browser, ...globals.node} },
  },
  { 
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"], 
    plugins: { js }, 
    extends: ["js/recommended"],
    ignores: ["**/*.json"],
  },
  tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
]);
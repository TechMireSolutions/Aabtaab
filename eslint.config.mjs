import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    settings: {
      // Bypass eslint-plugin-react version auto-detect (uses removed getFilename in ESLint 10)
      react: { version: "19.2.8" },
    },
  },
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts", "**/*.cjs"]),
]);

export default eslintConfig;

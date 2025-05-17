// @ts-check
import withNuxt from "./.nuxt/eslint.config.mjs";
import eslintConfigPrettierFlat from "eslint-config-prettier/flat";

export default withNuxt(
  {
    rules: {
      "@typescript-eslint/no-invalid-void-type": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "vue/no-multiple-template-root": "off",
      "vue/html-self-closing": "off",
    },
  },
  eslintConfigPrettierFlat,
);

import antfu from "@antfu/eslint-config"

export default antfu({
  stylistic: {
    quotes: "double",
  },
  ignores: ["*.md", "**/*.md"],
  formatters: {
    markdown: "prettier",
  },
  rules: {
    "import/order": ["error", {
      "groups": ["builtin", "external", "parent", "sibling", "index"],
      "newlines-between": "always",
      "alphabetize": {
        order: "asc",
        caseInsensitive: true,
      },
    }],
    "curly": ["error", "all"],
    "brace-style": ["error", "1tbs", { allowSingleLine: false }],
    "unused-imports/no-unused-imports": "error",
    "no-unused-vars": ["error", { vars: "all", args: "all", ignoreRestSiblings: false, argsIgnorePattern: "^_" }],
  },
})

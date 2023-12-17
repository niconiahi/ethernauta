import antfu from "@antfu/eslint-config"

export default antfu(
  {
    stylistic: {
      quotes: "double",
    },
    formatters: {
      markdown: "prettier",
    },
  },
  {
    files: ["**/*.ts"],
    rules: {
      "import/order": ["error", {
        "groups": ["builtin", "external", "internal", "parent", "sibling", "index"],
        "pathGroups": [
          {
            pattern: "@ethernauta/**",
            group: "internal",
          },
        ],
        "pathGroupsExcludedImportTypes": ["builtin"],
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
  },
)

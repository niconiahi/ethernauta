import antfu from "@antfu/eslint-config"

export default antfu(
  {
    stylistic: {
      quotes: "double",
    },
    formatters: {
      markdown: "prettier",
    },
    ignores: [
      "**/*.md",
      "packages/eth/src/chain/eip155/**/*.ts",
    ],
  },
  {
    files: ["**/*.ts"],
    rules: {
      "style/brace-style": ["error", "1tbs", { allowSingleLine: false }],
      "ts/consistent-type-imports": ["error", {
        disallowTypeAnnotations: true,
        prefer: "type-imports",
      }],
      "ts/explicit-function-return-type": [
        "error",
        {
          allowExpressions: true,
          allowHigherOrderFunctions: true,
        },
      ],
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
      "no-nested-ternary": "error",
      "unused-imports/no-unused-imports": "error",
      "no-unused-vars": ["error", { vars: "all", args: "all", ignoreRestSiblings: false, argsIgnorePattern: "^_" }],
      "no-fallthrough": "error",
    },
  },
)

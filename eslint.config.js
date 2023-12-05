import antfu from "@antfu/eslint-config"

export default antfu({
  stylistic: {
    quotes: "double",
  },
  rules: {
    "curly": ["error", "all"],
    "brace-style": ["error", "1tbs", { allowSingleLine: false }],
    "unused-imports/no-unused-imports": "error",
    "no-unused-vars": ["error", { vars: "all", args: "all" }],
  },
})

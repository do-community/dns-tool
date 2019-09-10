module.exports =  {
  extends:  [
    "plugin:@typescript-eslint/recommended",
    "plugin:vue/recommended",
  ],
  parserOptions:  {
    ecmaVersion: 2018,
    parser: "@typescript-eslint/parser",
    sourceType: "module",
  },
  rules:  {
    "linebreak-style": ["error", "unix"],
    semi: ["error", "never"],
    "@typescript-eslint/no-non-null-assertion": 0,
    "@typescript-eslint/no-explicit-any": 0,
    "@typescript-eslint/explicit-function-return-type": 0,
    "require-atomic-updates": 0,
    "no-undef": 0,
    "vue/require-v-for-key": 0,
    "vue/require-default-prop": 0,
    "vue/no-v-html": 0,
    "vue/max-attributes-per-line": 0,
    "vue/html-self-closing": 0,
    "vue/html-indent": ["error", 4],
    "vue/script-indent": ["error", 4, {
      baseIndent: 1,
    }],
    "@typescript-eslint/indent": 0,
    "vue/no-unused-vars": 0,
    "@typescript-eslint/no-object-literal-type-assertion": 0,
  },
}

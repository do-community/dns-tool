module.exports =  {
  parser: "@typescript-eslint/parser",
  extends:  [
    "plugin:@typescript-eslint/recommended",
  ],
  parserOptions:  {
    ecmaVersion: 2018,
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
  },
}

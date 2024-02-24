module.exports = {
  env: {
    es2021: true,
    node: true,
    jest: true
  },
  extends: 'standard',
  overrides: [
    {
      env: {
        node: true,
        "jest/globals": true
      },
      files: [
        '.eslintrc.{js,cjs}'
      ],
      parserOptions: {
        sourceType: 'script'
      }
    }
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  rules: {
    "jest/no-disabled-tests": "warn",
    "jest/no-focused-tests": "error",
    "jest/no-identical-title": "error",
    "jest/prefer-to-have-length": "warn",
    "jest/valid-expect": "error"
  },
  plugins: ["jest"]
}

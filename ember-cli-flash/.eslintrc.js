module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    ecmaFeatures: {
      legacyDecorators: true,
    },
  },
  plugins: ['ember'],
  extends: [
    'eslint:recommended',
    'plugin:ember/recommended',
    'plugin:prettier/recommended',
  ],
  env: {
    browser: true,
  },
  rules: {
    'ember/no-classic-components': 'warn',
    'ember/no-classic-classes': 'warn',
    'ember/no-computed-properties-in-native-classes': 'warn',
    'ember/classic-decorator-hooks': 'warn',
  },
};

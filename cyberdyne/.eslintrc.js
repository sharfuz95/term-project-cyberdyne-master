const PATHS = require('./config/paths');

module.exports = {
  parser: 'babel-eslint',
  extends: 'airbnb-base',
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: 'module',
  },
  env: {
    node: true,
  },
  plugins: ['import', 'babel', 'flowtype'],
  rules: {
    'arrow-parens': ['error', 'as-needed'],
    'import/no-unresolved': [2, { commonjs: true, caseSensitive: false }],
    'linebreak-style': 0,
  },
  settings: {
    'import/resolver': {
      node: {
        paths: [PATHS.root, 'node_modules'],
      },
    },
  },
};

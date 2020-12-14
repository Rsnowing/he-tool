module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true
  },
  extends: [
    'eslint:recommended',
    'plugin:prettier/recommended',
    'plugin:@typescript-eslint/recommended' // 让ESLint继承 @typescript-eslint/recommended 定义的规则
  ],
  plugins: ['@typescript-eslint'],
  parser: '@typescript-eslint/parser', // ESLint的解析器换成 @typescript-eslint/parser 用于解析ts文件
  parserOptions: {
    sourceType: 'module'
  },
  rules: {
    indent: ['error', 2],
    'linebreak-style': [0, 'error', 'windows'],
    quotes: ['error', 'single'],
    'no-console': 'off',
    'no-var-requires': 'off',
    '@typescript-eslint/ban-types': 'off',
    '@typescript-eslint/no-var-requires': 'off'
  }
};

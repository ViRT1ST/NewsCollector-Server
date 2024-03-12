module.exports = {
  root: true,
  env: { browser: true, es2020: true, node: true },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  settings: { react: { version: '18.2' } },
  rules: {
    'semi': [2, 'always'],
    // 'react-refresh/only-export-components': [ 'warn', { allowConstantExport: true }],
    'react/require-default-props': 'off',
    'react/jsx-no-target-blank': 'off',
    'react-hooks/exhaustive-deps': 'off', // temp
    'react/prop-types': 'off',
    'no-unused-vars': 'off',
    'quotes': ['error', 'single', { 'allowTemplateLiterals': true } ],
    'jsx-quotes': ['error', 'prefer-double']
  },
}

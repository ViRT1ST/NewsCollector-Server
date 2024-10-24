module.exports = {
  root: true,
  env: { browser: true, es2020: true, node: true },
  extends: [
    'next/core-web-vitals',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  rules: {
    'semi': [2, 'always'],
    'react/require-default-props': 'off',
    'react/jsx-no-target-blank': 'off',
    'react-hooks/exhaustive-deps': 'warn',
    'react/prop-types': 'off',
    'no-unused-vars': 'off',
    'quotes': ['error', 'single', { 'allowTemplateLiterals': true } ],
    'jsx-quotes': ['error', 'prefer-double'],
    'import/no-anonymous-default-export': 'off'
  },
}

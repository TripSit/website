'use strict';

module.exports = {
  root: true,
  extends: ['airbnb'],
  rules: {
    'no-console': 0,
    'prefer-destructuring': 0,
    'react/jsx-filename-extension': 0,
    'react/jsx-props-no-spreading': 0,
    'react/react-in-jsx-scope': 0,
    'react/forbid-prop-types': 0,
    'react/jsx-one-expression-per-line': 0,
    'react/jsx-indent': 0,
    'react/jsx-closing-tag-location': 0,
  },
  overrides: [
    {
      files: [
        '**/__tests__/*.spec.js',
        '**/__mocks__/*.js',
        'jest.setup.js',
      ],
      plugins: ['jest'],
      env: { 'jest/globals': true },
      rules: {
        'import/no-extraneous-dependencies': [2, {
          devDependencies: true,
        }],
      },
    },
    {
      files: [
        '.eslintrc.js',
        'next.config.js',
        'babel.config.js',
        'jest.config.js',
      ],
      parserOptions: { sourceType: 'script' },
      rules: {
        strict: [2, 'global'],
      },
    },
  ],
};

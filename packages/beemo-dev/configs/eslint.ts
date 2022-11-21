import { ESLintConfig } from '@beemo/driver-eslint';

const config: ESLintConfig = {
  ignore: [
    '**/dist/*',
    '**/node_modules/*',
    '**/coverage/*',
    'packages/goji.js.org/src/**/*',
    'lerna.json',
    'babel.config.js',
    'jest.config.js',
  ],
  root: true,
  extends: ['airbnb', 'airbnb/hooks', 'prettier'],
  plugins: ['@typescript-eslint', 'jest'],
  parser: '@typescript-eslint/parser',
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
  env: {
    browser: false,
    jest: true,
  },
  globals: {
    wx: 'readonly',
    App: 'readonly',
    Page: 'readonly',
    Component: 'readonly',
  },
  rules: {
    'max-classes-per-file': 'off',
    'no-underscore-dangle': ['error', { allow: ['__GOJI_CONTAINER'] }],
    'react/jsx-filename-extension': [
      'error',
      {
        extensions: ['.jsx', '.tsx'],
      },
    ],
    'import/prefer-default-export': 'off',
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: [
          '**/test/**', // tape, common npm pattern
          '**/tests/**', // also common npm pattern
          '**/spec/**', // mocha, rspec-like pattern
          '**/__tests__/**', // jest pattern
          '**/webpack.config.js', // webpack config
          '**/webpack.config.*.js', // webpack config
          '**/postcss.config.js', // postcss config
        ],
        optionalDependencies: false,
      },
    ],
    // enable for-in and for-of
    'no-restricted-syntax': [
      'error',
      {
        selector: 'LabeledStatement',
        message:
          'Labels are a form of GOTO; using them makes code confusing and hard to maintain and understand.',
      },
      {
        selector: 'WithStatement',
        message:
          '`with` is disallowed in strict mode because it makes code impossible to predict and optimize.',
      },
    ],
    'no-param-reassign': 'warn',
    'react/state-in-constructor': 'off',
    'react/prop-types': 'off',
    'react/require-default-props': 'off',
    'react/function-component-definition': ['error', { namedComponents: 'arrow-function' }],
    'class-methods-use-this': 'off',
    'no-await-in-loop': 'warn',
    'no-continue': 'off',
    'no-console': 'off',
    'no-useless-constructor': 'off',
    '@typescript-eslint/no-useless-constructor': 'error',
    'no-empty-function': 'off',
    '@typescript-eslint/no-empty-function': ['error', { allow: ['arrowFunctions'] }],
    // use @typescript-eslint/no-unused-vars instead
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      { ignoreRestSiblings: true, argsIgnorePattern: '^_' },
    ],
    'import/extensions': [
      'error',
      'always',
      {
        ts: 'never',
        tsx: 'never',
        js: 'never',
        jsx: 'never',
      },
    ],
    'no-use-before-define': 'off',
    '@typescript-eslint/no-use-before-define': 'error',
    'no-redeclare': 'off',
    '@typescript-eslint/no-redeclare': 'error',
    'no-unused-expressions': 'off',
    '@typescript-eslint/no-unused-expressions': ['error'],
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': 'error',
    '@typescript-eslint/explicit-member-accessibility': ['error'],
    // https://github.com/typescript-eslint/typescript-eslint/issues/2477
    'no-undef': 'off',
    'no-tabs': 'error',
    '@typescript-eslint/ban-ts-comment': [
      'error',
      {
        'ts-expect-error': false,
        'ts-ignore': true,
        'ts-nocheck': false,
        'ts-check': false,
      },
    ],
  },
};

export default config;

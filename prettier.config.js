module.exports = {
  arrowParens: 'avoid',
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
  proseWrap: 'always',
  semi: true,
  singleQuote: true,
  trailingComma: 'all',
  bracketSpacing: true,
  jsxBracketSameLine: false,
  overrides: [
    {
      files: '.babelrc',
      options: {
        parser: 'json',
      },
    },
    {
      files: '.prettierrc',
      options: {
        parser: 'json',
      },
    },
  ],
};

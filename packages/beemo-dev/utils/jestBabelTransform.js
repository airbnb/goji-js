// eslint-disable-next-line import/no-extraneous-dependencies
const babelJest = require('babel-jest').default;

module.exports = babelJest.createTransformer({
  rootMode: 'upward',
});

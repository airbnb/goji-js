// eslint-disable-next-line import/no-extraneous-dependencies
const babelJest = require('babel-jest');

module.exports = babelJest.createTransformer({
  rootMode: 'upward',
});

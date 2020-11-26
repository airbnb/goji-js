const path = require('path');

module.exports = {
  verbose: true,
  cacheDirectory: '/tmp/.cache/jest',
  collectCoverage: true,
  testEnvironment: 'node',
  transform: {
    // https://github.com/facebook/jest/issues/7359#issuecomment-471509996
    '^.+\\.(ts|js|tsx|jsx)$': path.resolve(__dirname, './jestBabelTransform.js'),
  },
  transformIgnorePatterns: [],
  testMatch: ['**/src/**/__tests__/**/*.[jt]s?(x)'],
  moduleFileExtensions: ['ts', 'js', 'tsx', 'jsx', 'json', 'node'],
  moduleNameMapper: {
    // https://jestjs.io/docs/en/webpack.html#mocking-css-modules
    '\\.(css|less|sass|scss)$': 'identity-obj-proxy',
    '\\.(gif|ttf|eot|svg)$': path.resolve(__dirname, './jestFileMock.js'),
  },
  coverageDirectory: 'coverage',
};

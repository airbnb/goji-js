import { JestConfig } from '@beemo/driver-jest';
import path from 'path';

const config: JestConfig = {
  verbose: true,
  cacheDirectory: '/tmp/.cache/jest',
  collectCoverage: true,
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: [path.resolve(__dirname, '../utils/setupTests.js')],
  transform: {
    // https://github.com/facebook/jest/issues/7359#issuecomment-471509996
    '^.+\\.(ts|js|tsx|jsx)$': path.resolve(__dirname, '../utils/jestBabelTransform.js'),
  },
  transformIgnorePatterns: [],
  testMatch: ['**/src/**/?(*.)+(spec|test).[jt]s?(x)'],
  moduleFileExtensions: ['ts', 'js', 'tsx', 'jsx', 'json', 'node'],
  moduleNameMapper: {
    // https://jestjs.io/docs/en/webpack.html#mocking-css-modules
    '\\.(css|less|sass|scss)$': 'identity-obj-proxy',
    '\\.(gif|ttf|eot|svg)$': path.resolve(__dirname, '../utils/jestFileMock.js'),
  },
  coverageDirectory: 'coverage',
};

export default config;

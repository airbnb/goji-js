import { JestConfig } from '@beemo/driver-jest';
import path from 'path';
import os from 'os';

const config: JestConfig = {
  verbose: true,
  cacheDirectory: path.join(os.tmpdir(), '.cache', 'jest'),
  collectCoverage: true,
  testEnvironment: 'jsdom',
  transform: {
    // https://github.com/facebook/jest/issues/7359#issuecomment-471509996
    '^.+\\.(ts|js|tsx|jsx)$': path.resolve(__dirname, '../utils/jestBabelTransform.js'),
  },
  transformIgnorePatterns: ['/node_modules/', '\\.pnp\\.[^\\/]+$'],
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

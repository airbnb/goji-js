import path from 'node:path';
import os from 'node:os';

// Under Yarn PnP some packages (e.g. `enhanced-resolve`, used by webpack) call
// `require('pnpapi')`. That name is intercepted by Node's loader, but Jest runs
// modules through its own resolver, so map it to the generated PnP API module.
const pnpApiPath = (() => {
  try {
    return require.resolve('pnpapi');
  } catch {
    return undefined;
  }
})();

export default {
  verbose: true,
  cacheDirectory: path.join(os.tmpdir(), '.cache', 'jest'),
  collectCoverage: true,
  testEnvironment: 'jsdom',
  transform: {
    // https://github.com/facebook/jest/issues/7359#issuecomment-471509996
    '^.+\\.(ts|js|tsx|jsx)$': path.resolve(
      import.meta.dirname,
      './packages/beemo-dev/utils/jestBabelTransform.js',
    ),
  },
  transformIgnorePatterns: ['/node_modules/', '\\.pnp\\.[^\\/]+$'],
  testMatch: ['**/src/**/?(*.)+(spec|test).[jt]s?(x)'],
  moduleFileExtensions: ['ts', 'js', 'tsx', 'jsx', 'json', 'node'],
  moduleNameMapper: {
    // https://jestjs.io/docs/en/webpack.html#mocking-css-modules
    '\\.(css|less|sass|scss)$': 'identity-obj-proxy',
    '\\.(gif|ttf|eot|svg)$': path.resolve(
      import.meta.dirname,
      './packages/beemo-dev/utils/jestFileMock.js',
    ),
    ...(pnpApiPath ? { '^pnpapi$': pnpApiPath } : {}),
  },
  coverageDirectory: 'coverage',
};

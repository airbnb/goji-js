import { GojiTarget } from '@goji/core';
import resolve from 'resolve';
import webpack from 'webpack';
import os from 'os';

export const getEnvForPreprocess = (nodeEnv: string, target: GojiTarget) => ({
  NODE_ENV: nodeEnv,
  TARGET: target,
});

export const preprocessLoader = (
  type: string,
  nodeEnv: string,
  target: GojiTarget,
): webpack.RuleSetRule => {
  const options = { ...getEnvForPreprocess(nodeEnv, target), ppOptions: { type } };

  // here is a bug in preprocess-loader that remove the `options.ppOptions` unexpectly
  // https://github.com/dearrrfish/preprocess-loader/issues/13
  // we use Proxy to prevent delete action
  const readonlyOptions = new Proxy(options, {
    deleteProperty() {
      // don't remove fields
      return true;
    },
  });

  const loaderConfig = {
    loader: resolve.sync('preprocess-loader', { basedir: __dirname }),
    options: readonlyOptions,
  };

  return loaderConfig;
};

// `thread-loader` enable multi-thread compiling for Webpack
const MOST_ECONOMICAL_WORKER_COUNT = 3;
export const getThreadLoader = (): Array<webpack.RuleSetRule> => {
  // disable `thread-loader` on CI
  if (process.env.CI === 'true') {
    return [];
  }
  // `thead-loader`'s workers default to `os.cpus().length - 1`
  // after benchmarking I believe 1 master + 3 workers = 4 thread should be the most economical config on most cpus
  // so we use `max(1, min(core_count - 1, MOST_ECONOMICAL_WORKER_COUNT))` as worker count
  const threadCount = os.cpus()?.length ?? 1;
  const workerCount = Math.max(1, Math.min(threadCount - 1, MOST_ECONOMICAL_WORKER_COUNT));

  return [
    {
      loader: resolve.sync('thread-loader', { basedir: __dirname }),
      options: { workers: workerCount },
    },
  ];
};

export const getCacheLoader = (
  isProduction: boolean,
  nodeEnv: string,
  target: GojiTarget,
): Array<webpack.RuleSetRule> =>
  // disable cache-loader for production
  isProduction
    ? []
    : [
        {
          loader: resolve.sync('cache-loader', { basedir: __dirname }),
          options: {
            cacheIdentifier: `cache-loader:${
              // eslint-disable-next-line global-require
              require('cache-loader/package.json').version
            } ${nodeEnv} ${target}`,
          },
        },
      ];

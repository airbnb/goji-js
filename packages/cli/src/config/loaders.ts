import { GojiTarget } from '@goji/core';
import webpack from 'webpack';
import os from 'os';

export const getEnvForPreprocess = (nodeEnv: string, target: GojiTarget) => ({
  NODE_ENV: nodeEnv,
  TARGET: target,
});

const MOST_ECONOMICAL_WORKER_COUNT = 3;
const getDefaultWorkerCount = () => {
  // `thead-loader`'s workers default to `os.cpus().length - 1`
  // after benchmarking I believe 1 master + 3 workers = 4 thread should be the most economical config on most cpus
  // so we use `max(1, min(core_count - 1, MOST_ECONOMICAL_WORKER_COUNT))` as worker count
  const threadCount = os.cpus()?.length ?? 1;
  return Math.max(1, Math.min(threadCount - 1, MOST_ECONOMICAL_WORKER_COUNT));
};

// FIXME: cannot use `thread-loader`'s `warmup` because of this issue
// https://github.com/webpack-contrib/thread-loader/issues/122
export const getThreadLoader = (nodeEnv: string, parallel?: number): Array<webpack.RuleSetRule> => {
  if (typeof parallel === 'number' && parallel <= 1) {
    return [];
  }
  const options = {
    workers: typeof parallel === 'number' ? parallel - 1 : getDefaultWorkerCount(),
    // no need to kill the worker in dev mode for better re-build performance
    poolTimeout: nodeEnv === 'production' ? 2000 : Infinity,
  };

  return [
    {
      loader: require.resolve('thread-loader'),
      options,
    },
  ];
};

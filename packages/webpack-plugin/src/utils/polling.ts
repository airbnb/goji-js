// defaults value in chokidar is 100
// we use 5x here
const DEFAULT_MAC_OS_POLLING_INTERVAL = 500;

/**
 * In large projects if you run yarn start webpack will compile the project. Then after the first
 * compilation done Webpack start to watch source files and cause CPU very high on macOS.
 * It is because the default polling interval is 100ms which means chokidar will scan the whole
 * source files 10 times in a second and it cause too much CPU usage.
 */
export const getPoll = (pollingInterval: number = DEFAULT_MAC_OS_POLLING_INTERVAL) => {
  let canUseFsevents = false;
  try {
    // eslint-disable-next-line global-require, import/no-extraneous-dependencies, import/no-unresolved
    const fseventsHandler = require('chokidar/lib/fsevents-handler');
    canUseFsevents = fseventsHandler.canUse();
  } catch (e) {
    // do nothing
  }
  return process.platform === 'darwin' && !canUseFsevents
    ? // if Webpack can use `fsevents` we won't enable polling
      pollingInterval
    : undefined;
};

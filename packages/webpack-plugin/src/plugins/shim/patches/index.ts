// TODO: remember to also edit `meta.ts` if this file changes
// the `meta.ts` is used for compiling and the `patches/index.ts` is used for runtime

// don't use ES module
// 1. to prevent `__esModule` been generated
// 2. to prevent `tslib` dependency. Using `import xx from 'xx'` makes `tslib` been require by patches
//   and then ProvidePlugin will re-patch `tslib` and cause unexpected results.
module.exports = {
  /* eslint-disable global-require */
  Function: require('./function'),
  Promise: require('./promise'),
  String: require('./string'),
  Array: require('./array'),
  ArrayBuffer: require('./arrayBuffer'),
  Number: require('./number'),
  getCurrentPages: require('./getCurrentPages'),
  /* eslint-enable global-require */

  // these variables should be reset otherwise some 3rd party libraries will fail
  // FIXME: how to get the full list and should we patch all of them ?
  // `Object.getOwnPropertyNames(window) - Object.getOwnPropertyNames(global))` might work but it's too big

  // fix many libraries like react https://github.com/facebook/react/blob/master/packages/shared/ExecutionEnvironment.js#L10-L14
  window: undefined,

  // fix react https://github.com/facebook/react/blob/3e94bce765d355d74f6a60feb4addb6d196e3482/packages/scheduler/src/forks/SchedulerHostConfig.default.js#L24
  MessageChannel: undefined,

  // fix core-js https://github.com/zloirock/core-js/blob/76d9bf50b1b15439366af92885c5a7a1d0ad61c6/packages/core-js/internals/microtask.js#L7
  MutationObserver: undefined,
  WebKitMutationObserver: undefined,
};

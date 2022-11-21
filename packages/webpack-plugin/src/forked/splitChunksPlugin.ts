/* eslint-disable */
/**
 * FIXME:
 * These functions are forked from https://github.com/webpack/webpack/blob/0065223c4ddac3bf872bc8d660ef1e9a63afa080/lib/optimize/SplitChunksPlugin.js
 * No changes here from the original
 */

const INITIAL_CHUNK_FILTER = chunk => chunk.canBeInitial();
const ASYNC_CHUNK_FILTER = chunk => !chunk.canBeInitial();
const ALL_CHUNK_FILTER = () => true;

/**
 * @param {OptimizationSplitChunksSizes} value the sizes
 * @param {string[]} defaultSizeTypes the default size types
 * @returns {SplitChunksSizes} normalized representation
 */
const normalizeSizes = (value, defaultSizeTypes) => {
  if (typeof value === 'number') {
    /** @type {Record<string, number>} */
    const o = {};
    for (const sizeType of defaultSizeTypes) o[sizeType] = value;
    return o;
  } else if (typeof value === 'object' && value !== null) {
    return { ...value };
  } else {
    return {};
  }
};

/**
 * @param {...SplitChunksSizes} sizes the sizes
 * @returns {SplitChunksSizes} the merged sizes
 */
const mergeSizes = (...sizes) => {
  /** @type {SplitChunksSizes} */
  let merged = {};
  for (let i = sizes.length - 1; i >= 0; i--) {
    merged = Object.assign(merged, sizes[i]);
  }
  return merged;
};

/**
 * @param {false|string|Function} name the chunk name
 * @returns {GetName} a function to get the name of the chunk
 */
const normalizeName = name => {
  if (typeof name === 'string') {
    return () => name;
  }
  if (typeof name === 'function') {
    return /** @type {GetName} */ name;
  }
};

/**
 * @param {OptimizationSplitChunksCacheGroup["chunks"]} chunks the chunk filter option
 * @returns {ChunkFilterFunction} the chunk filter function
 */
const normalizeChunksFilter = chunks => {
  if (chunks === 'initial') {
    return INITIAL_CHUNK_FILTER;
  }
  if (chunks === 'async') {
    return ASYNC_CHUNK_FILTER;
  }
  if (chunks === 'all') {
    return ALL_CHUNK_FILTER;
  }
  if (typeof chunks === 'function') {
    return chunks;
  }
};

/**
 * @param {GetCacheGroups | Record<string, false|string|RegExp|OptimizationSplitChunksGetCacheGroups|OptimizationSplitChunksCacheGroup>} cacheGroups the cache group options
 * @param {string[]} defaultSizeTypes the default size types
 * @returns {GetCacheGroups} a function to get the cache groups
 */
export const normalizeCacheGroups = (cacheGroups, defaultSizeTypes) => {
  if (typeof cacheGroups === 'function') {
    return cacheGroups;
  }
  if (typeof cacheGroups === 'object' && cacheGroups !== null) {
    /** @type {(function(Module, CacheGroupsContext, CacheGroupSource[]): void)[]} */
    const handlers = [];
    for (const key of Object.keys(cacheGroups)) {
      const option = cacheGroups[key];
      if (option === false) {
        continue;
      }
      if (typeof option === 'string' || option instanceof RegExp) {
        const source = createCacheGroupSource({}, key, defaultSizeTypes);
        // @ts-expect-error
        handlers.push((module, context, results) => {
          if (checkTest(option, module, context)) {
            results.push(source);
          }
        });
      } else if (typeof option === 'function') {
        const cache = new WeakMap();
        // @ts-expect-error
        handlers.push((module, context, results) => {
          const result = option(module);
          if (result) {
            const groups = Array.isArray(result) ? result : [result];
            for (const group of groups) {
              const cachedSource = cache.get(group);
              if (cachedSource !== undefined) {
                results.push(cachedSource);
              } else {
                const source = createCacheGroupSource(group, key, defaultSizeTypes);
                cache.set(group, source);
                results.push(source);
              }
            }
          }
        });
      } else {
        const source = createCacheGroupSource(option, key, defaultSizeTypes);
        // @ts-expect-error
        handlers.push((module, context, results) => {
          if (
            checkTest(option.test, module, context) &&
            checkModuleType(option.type, module) &&
            checkModuleLayer(option.layer, module)
          ) {
            results.push(source);
          }
        });
      }
    }
    /**
     * @param {Module} module the current module
     * @param {CacheGroupsContext} context the current context
     * @returns {CacheGroupSource[]} the matching cache groups
     */
    const fn = (module, context) => {
      /** @type {CacheGroupSource[]} */
      let results = [];
      for (const fn of handlers) {
        // @ts-expect-error
        fn(module, context, results);
      }
      return results;
    };
    return fn;
  }
  return () => null;
};

/**
 * @param {undefined|boolean|string|RegExp|Function} test test option
 * @param {Module} module the module
 * @param {CacheGroupsContext} context context object
 * @returns {boolean} true, if the module should be selected
 */
const checkTest = (test, module, context) => {
  if (test === undefined) return true;
  if (typeof test === 'function') {
    return test(module, context);
  }
  if (typeof test === 'boolean') return test;
  if (typeof test === 'string') {
    const name = module.nameForCondition();
    return name && name.startsWith(test);
  }
  if (test instanceof RegExp) {
    const name = module.nameForCondition();
    return name && test.test(name);
  }
  return false;
};

/**
 * @param {undefined|string|RegExp|Function} test type option
 * @param {Module} module the module
 * @returns {boolean} true, if the module should be selected
 */
const checkModuleType = (test, module) => {
  if (test === undefined) return true;
  if (typeof test === 'function') {
    return test(module.type);
  }
  if (typeof test === 'string') {
    const type = module.type;
    return test === type;
  }
  if (test instanceof RegExp) {
    const type = module.type;
    return test.test(type);
  }
  return false;
};

/**
 * @param {undefined|string|RegExp|Function} test type option
 * @param {Module} module the module
 * @returns {boolean} true, if the module should be selected
 */
const checkModuleLayer = (test, module) => {
  if (test === undefined) return true;
  if (typeof test === 'function') {
    return test(module.layer);
  }
  if (typeof test === 'string') {
    const layer = module.layer;
    return test === '' ? !layer : layer && layer.startsWith(test);
  }
  if (test instanceof RegExp) {
    const layer = module.layer;
    return test.test(layer);
  }
  return false;
};

/**
 * @param {OptimizationSplitChunksCacheGroup} options the group options
 * @param {string} key key of cache group
 * @param {string[]} defaultSizeTypes the default size types
 * @returns {CacheGroupSource} the normalized cached group
 */
const createCacheGroupSource = (options, key, defaultSizeTypes) => {
  const minSize = normalizeSizes(options.minSize, defaultSizeTypes);
  const minSizeReduction = normalizeSizes(options.minSizeReduction, defaultSizeTypes);
  const maxSize = normalizeSizes(options.maxSize, defaultSizeTypes);
  return {
    key,
    priority: options.priority,
    getName: normalizeName(options.name),
    chunksFilter: normalizeChunksFilter(options.chunks),
    enforce: options.enforce,
    minSize,
    minSizeReduction,
    minRemainingSize: mergeSizes(
      normalizeSizes(options.minRemainingSize, defaultSizeTypes),
      minSize,
    ),
    enforceSizeThreshold: normalizeSizes(options.enforceSizeThreshold, defaultSizeTypes),
    maxAsyncSize: mergeSizes(normalizeSizes(options.maxAsyncSize, defaultSizeTypes), maxSize),
    maxInitialSize: mergeSizes(normalizeSizes(options.maxInitialSize, defaultSizeTypes), maxSize),
    minChunks: options.minChunks,
    maxAsyncRequests: options.maxAsyncRequests,
    maxInitialRequests: options.maxInitialRequests,
    filename: options.filename,
    idHint: options.idHint,
    automaticNameDelimiter: options.automaticNameDelimiter,
    reuseExistingChunk: options.reuseExistingChunk,
    usedExports: options.usedExports,
  };
};

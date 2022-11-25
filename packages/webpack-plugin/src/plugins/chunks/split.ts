import webpack from 'webpack';
import crypto from 'crypto';
import type { NonUndefined } from 'utility-types';
import { GojiBasedWebpackPlugin } from '../based';
import { appConfigMap } from '../../shared';
import {
  findBelongingSubPackages,
  getSubpackagesInfo,
  isBelongsTo,
  MAIN_PACKAGE,
} from '../../utils/config';
import { AppConfig, GojiWebpackPluginRequiredOptions } from '../../types';
import { COMMON_CHUNK_NAME, NO_HOIST_TEMP_DIR } from '../../constants/paths';
import { normalizeCacheGroups } from '../../forked/splitChunksPlugin';

type WebpackCacheGroups = NonUndefined<
  Exclude<
    NonUndefined<webpack.Configuration['optimization']>['splitChunks'],
    false | undefined
  >['cacheGroups']
>;

type WebpackCacheGroupsContext = Parameters<
  webpack.optimize.SplitChunksPlugin['options']['getCacheGroups']
>[1];

const checkTest = (
  test:
    | undefined
    | string
    | RegExp
    | ((module: webpack.Module, chunks: Array<webpack.Chunk>) => boolean),
  module: webpack.Module,
  chunks: Array<webpack.Chunk>,
  defaultResult: boolean,
) => {
  const moduleName: string | undefined = module.nameForCondition?.() ?? undefined;
  switch (typeof test) {
    case 'undefined':
      return defaultResult;
    case 'function':
      return test(module, chunks);
    case 'string':
      return moduleName?.startsWith(test);
    default: {
      if (test instanceof RegExp) {
        return typeof moduleName === 'undefined' ? defaultResult : test.test(moduleName);
      }
      return defaultResult;
    }
  }
};

const getNohoistModules = (
  options: GojiWebpackPluginRequiredOptions['nohoist'],
  appConfig: AppConfig,
  modules: Array<webpack.Module>,
  chunkGraph: webpack.ChunkGraph,
) => {
  const [subPackages] = getSubpackagesInfo(appConfig);
  const subPackageRoots = subPackages.map(_ => _.root).filter(Boolean) as Array<string>;
  const nohoistModules = new Map<string, Set<webpack.Module>>();
  for (const module of modules) {
    const chunks = chunkGraph.getModuleChunks(module);
    const belongingSubPackages = findBelongingSubPackages(
      chunks.map(chunk => chunk.name),
      subPackageRoots,
    );
    const canNohoist = belongingSubPackages.size > 1 && !belongingSubPackages.has(MAIN_PACKAGE);
    const forceNohoist = checkTest(options.test, module, chunks, false);
    // should only nohoist if size between [2, N] where N is `nohoist.maxPackages`
    if (canNohoist && (forceNohoist || belongingSubPackages.size <= options.maxPackages)) {
      const hash = crypto.createHash('sha256');
      for (const chunkName of chunks.map(chunk => chunk.name).sort()) {
        hash.update(chunkName);
      }
      const chunksHash = hash.digest('hex');
      nohoistModules.set(
        chunksHash,
        (nohoistModules.get(chunksHash) ?? new Set<webpack.Module>()).add(module),
      );
    }
  }
  return nohoistModules;
};

const getCacheGroups = (
  options: GojiWebpackPluginRequiredOptions['nohoist'],
  appConfig: AppConfig,
  modules: Array<webpack.Module>,
  chunkGraph: webpack.ChunkGraph,
) => {
  const nohoistModules = getNohoistModules(options, appConfig, modules, chunkGraph);
  const [subPackages, independents] = getSubpackagesInfo(appConfig);
  const cacheGroups: WebpackCacheGroups = {};
  cacheGroups[COMMON_CHUNK_NAME] = {
    name: COMMON_CHUNK_NAME,
    priority: -5,
    chunks: chunk => {
      if (independents.find(item => isBelongsTo(chunk.name, item.root ?? ''))) {
        return false;
      }

      return true;
    },
  };
  for (const { root: subPackage, independent } of subPackages) {
    if (!subPackage) {
      continue;
    }
    // independent need to be splitted even if `hoist` is not enabled
    if (!options.enable && !independent) {
      continue;
    }
    cacheGroups[subPackage] = {
      name: `${subPackage}/${COMMON_CHUNK_NAME}`,
      test: (module: webpack.Module, context: WebpackCacheGroupsContext) => {
        if (independent) {
          return true;
        }

        return context.chunkGraph
          .getModuleChunks(module)
          .every(item => isBelongsTo(item.name, subPackage));
      },
      chunks: chunk => isBelongsTo(chunk.name, subPackage),
    };
  }
  if (options.enable) {
    for (const [chunksHash, chunkNohoistModules] of nohoistModules.entries()) {
      cacheGroups[`${NO_HOIST_TEMP_DIR}/${chunksHash}`] = {
        name: `${NO_HOIST_TEMP_DIR}/${chunksHash}`,
        test: (module: webpack.Module) => chunkNohoistModules.has(module),
        // no need to check independent because all nohoist chunks will be copied to each sub-packages in GojiNohoistWebpackPlugin
        chunks: () => true,
      };
    }
  }

  return cacheGroups;
};

const DEFAULT_SPLIT_CHUNKS_OPTIONS = {
  minChunks: 2,
  minSize: 0,
  maxAsyncRequests: Infinity,
  maxInitialRequests: Infinity,
  cacheGroups: {},
};

/**
 * Before understanding this plugin, we need to introduce the output folder structure of a simple
 * GojiJS project.
 * ├── _goji_commons.js
 * ├── _goji_commons.wxss
 * ├── app.js                 # global JavaScript like `App({})` and `core-js`
 * ├── app.wxss               # global styles, like `:global { page: { background-color: #fff; } }`
 * ├── pages                  # the main package contains two pages
 * │   ├── index.js           # the home page tab
 * │   ├── index.wxss
 * │   ├── me.js              # the me tab, because all tab bar pages should be put inside the main package
 * │   ├── me.wxss
 * ├── package-a              # this is a sub-package that contains two pages
 * │   ├── _goji_commons.js
 * │   ├── _goji_commons.wxss
 * │   ├── page-a.js
 * │   ├── page-a.wxss
 * │   ├── page-b.js
 * │   ├── page-b.wxss
 * ├── package-b              # this is a sub-package that contains two pages
 * │   ├── _goji_commons.js
 * │   ├── _goji_commons.wxss
 * │   ├── page-a.js
 * │   ├── page-a.wxss
 * │   ├── page-b.js
 * │   ├── page-b.wxss
 * ├── independent-package-c  # this is a independent sub-package that contains two pages
 * │   ├── _goji_commons.js
 * │   ├── _goji_commons.wxss
 * │   ├── page-a.js
 * │   ├── page-a.wxss
 * │   ├── page-b.js
 * │   ├── page-b.wxss
 *
 * As you can see Goji CLI ( WebPack ) generated several common chunk files, which share code between
 * different pages, output as `_goji_commons.*` files. The purpose of these files is:
 * `_goji_commons.*` contains:
 *   1. Shared code between pages from main packages, like `pages/index` and `pages/me`
 *   2. Shared code between different packages including the main package, like `pages/index`
 *      and `package-a/page-a.js`, `package-a/page-a.js` and `package-b/page-a.js`
 * `package-a/_goji_commons.*` contains:
 *   1. Shared code between pages inside `package-a`
 * `independent-package-c/_goji_commons.*` contains:
 *   1. Shared code between pages inside `independent-package-c`
 *   2. If any module was required both inside and outside this package, it would be forked
 *      into this chunk to ensure that no external dependency break its independence.
 *      To prevent forking code from runtime issue the `GojiSingletonRuntimeWebpackPlugin`
 *      hijack the `runtime.js` file, for more details please see `./singleton.ts`
 *
 * This plugin generate `compiler.options.optimization.splitChunks.cacheGroups` from `appConfig` to
 * tell WebPack create correct common chunks.
 *
 * Because we cannot access `appConfig` while `webpack.config.js` is initializing, we have to use the
 * `cacheGroupsPlaceholder` and then patch the `cacheGroups` in this plugin.
 */
export class GojiSplitChunksWebpackPlugin extends GojiBasedWebpackPlugin {
  public apply(compiler: webpack.Compiler) {
    const splitChunkInstance = new webpack.optimize.SplitChunksPlugin(DEFAULT_SPLIT_CHUNKS_OPTIONS);
    splitChunkInstance.apply(compiler);

    // update options manually
    compiler.hooks.thisCompilation.tap(
      'GojiSplitChunksWebpackPlugin',
      (compilation: webpack.Compilation) => {
        if (compiler.options.optimization?.splitChunks !== false) {
          throw new Error(
            'To enable `GojiSplitChunksWebpackPlugin`, the `optimization.splitChunks` in webpack config file must be `false`.',
          );
        }
        const appConfig = appConfigMap.get(compiler);
        if (!appConfig) {
          throw new Error('`appConfig` not found. This might be an internal error in GojiJS.');
        }

        // use `afterOptimizeModules` to make sure this plugin is executed before `SplitChunksPlugin`
        compilation.hooks.afterOptimizeModules.tap('GojiSplitChunksWebpackPlugin', modules => {
          splitChunkInstance.options.getCacheGroups = normalizeCacheGroups(
            getCacheGroups(this.options.nohoist, appConfig, [...modules], compilation.chunkGraph),
            ['javascript', 'unknown'],
          );
        });
      },
    );
  }
}

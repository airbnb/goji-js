import webpack from 'webpack';
import { GojiBasedWebpackPlugin } from './based';
import { appConfigMap } from '../shared';
import { getSubpackagesInfo, isBelongsTo } from '../utils/config';
import { AppConfig } from '../types';

interface WebpackCacheGroups {
  [key: string]: webpack.Options.CacheGroupsOptions | false;
}

const getCacheGroups = (appConfig: AppConfig) => {
  const cacheGroups: WebpackCacheGroups = {};
  const [subPackages, independents] = getSubpackagesInfo(appConfig);
  cacheGroups.commons = {
    name: 'commons',
    priority: -5,
    chunks(chunk) {
      if (independents.find(item => isBelongsTo(chunk.name, item.root ?? ''))) {
        return false;
      }

      return true;
    },
  };
  subPackages.forEach(({ root: subPackage, independent }) => {
    if (!subPackage) {
      return;
    }
    cacheGroups[subPackage] = {
      name: `${subPackage}/commons`,
      test(_module, chunks: Array<webpack.compilation.Chunk>) {
        if (independent) {
          return true;
        }
        return chunks.every(item => isBelongsTo(item.name, subPackage));
      },
      chunks(chunk) {
        if (independent) {
          return isBelongsTo(chunk.name, subPackage);
        }

        return true;
      },
    };
  });

  return cacheGroups;
};

interface WebpackEntrypoint {
  name: string;
}

const getRuntimeNameCallback = (appConfig: AppConfig) => (entrypoint: WebpackEntrypoint) => {
  const [, independents] = getSubpackagesInfo(appConfig);
  for (const item of independents) {
    if (isBelongsTo(entrypoint.name, item.root ?? '')) {
      return `${item.root}/runtime`;
    }
  }
  return `runtime`;
};

/**
 * Before understanding this plugin, we need to introduce the output folder structure of a simple
 * GojiJS project.
 * ├── commons.js
 * ├── commons.wxss
 * ├── app.js                 # global JavaScript like `App({})` and `core-js`
 * ├── app.wxss               # global styles, like `:global { page: { background-color: #fff; } }`
 * ├── pages                  # the main package contains two pages
 * │   ├── index.js           # the home page tab
 * │   ├── index.wxss
 * │   ├── me.js              # the me tab, because all tab bar pages should be put inside the main package
 * │   ├── me.wxss
 * ├── package-a              # this is a sub-package that contains two pages
 * │   ├── commons.js
 * │   ├── commons.wxss
 * │   ├── page-a.js
 * │   ├── page-a.wxss
 * │   ├── page-b.js
 * │   ├── page-b.wxss
 * ├── package-b              # this is a sub-package that contains two pages
 * │   ├── commons.js
 * │   ├── commons.wxss
 * │   ├── page-a.js
 * │   ├── page-a.wxss
 * │   ├── page-b.js
 * │   ├── page-b.wxss
 * ├── independent-package-c  # this is a independent sub-package that contains two pages
 * │   ├── commons.js
 * │   ├── commons.wxss
 * │   ├── page-a.js
 * │   ├── page-a.wxss
 * │   ├── page-b.js
 * │   ├── page-b.wxss
 *
 * As you can see Goji CLI ( WebPack ) generated several common chunk files, which share code between
 * different pages, output as `commons.*` files. The purpose of these files is:
 * `commons.*` contains:
 *   1. Shared code between pages from main packages, like `pages/index` and `pages/me`
 *   2. Shared code between different packages including the main package, like `pages/index`
 *      and `package-a/page-a.js`, `package-a/page-a.js` and `package-b/page-a.js`
 * `package-a/commons.*` contains:
 *   1. Shared code between pages inside `package-a`
 * `independent-package-c/commons.*` contains:
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
export class GojiChunksWebpackPlugin extends GojiBasedWebpackPlugin {
  private loadSplitChunksPlugin(compiler: webpack.Compiler) {
    if (compiler.options.optimization?.splitChunks !== false) {
      throw new Error(
        'To enable `GojiChunksWebpackPlugin`, the `optimization.splitChunks` in webpack config file must be `false`.',
      );
    }
    const appConfig = appConfigMap.get(compiler);
    if (!appConfig) {
      throw new Error('`appConfig` not found. This might be an internal error in GojiJS.');
    }
    const cacheGroups = getCacheGroups(appConfig);
    // @ts-ignore
    new webpack.optimize.SplitChunksPlugin({
      minChunks: 2,
      minSize: 0,
      maxAsyncRequests: Infinity,
      maxInitialRequests: Infinity,
      cacheGroups,
    }).apply(compiler);
  }

  private loadRuntimeChunkPlugin(compiler: webpack.Compiler) {
    if (compiler.options.optimization?.runtimeChunk !== false) {
      throw new Error(
        'To enable `GojiChunksWebpackPlugin`, the `optimization.runtimeChunk` in webpack config file must be `false`.',
      );
    }
    const appConfig = appConfigMap.get(compiler);
    if (!appConfig) {
      throw new Error('`appConfig` not found. This might be an internal error in GojiJS.');
    }
    const name = getRuntimeNameCallback(appConfig);
    // @ts-ignore
    new webpack.optimize.RuntimeChunkPlugin({
      name,
    }).apply(compiler);
  }

  private rewrite(compiler: webpack.Compiler) {
    this.loadSplitChunksPlugin(compiler);
    this.loadRuntimeChunkPlugin(compiler);
  }

  public apply(compiler: webpack.Compiler) {
    compiler.hooks.compile.tap('GojiChunksWebpackPlugin', () => this.rewrite(compiler));
  }
}

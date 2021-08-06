import webpack from 'webpack';
import { GojiBasedWebpackPlugin } from './based';
import { appConfigMap } from '../shared';
import { getSubpackagesInfo, isBelongsTo } from '../utils/config';

export interface WebpackCacheGroups {
  [key: string]: webpack.Options.CacheGroupsOptions | false;
}

export interface WebpackEntrypoint {
  name: string;
}

let realRuntimeChunkName: (entrypoint: WebpackEntrypoint) => string;

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
export class GojiSplitChunksWebpackPlugin extends GojiBasedWebpackPlugin {
  private overrideCacheGroups(compiler: webpack.Compiler) {
    // @ts-ignore
    const cacheGroups = compiler.options.optimization.splitChunks.cacheGroups as WebpackCacheGroups;
    // clean up cache group before use it
    for (const key of Object.keys(cacheGroups)) {
      delete cacheGroups[key];
    }

    const appConfig = appConfigMap.get(compiler);
    if (!appConfig) {
      throw new Error('`appConfig` not found. This might be an internal error in GojiJS.');
    }
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
    // override options
    // @ts-ignore
    compiler.options.optimization.splitChunks.cacheGroups = cacheGroups;
  }

  private overrideRuntimeChunk(compiler: webpack.Compiler) {
    realRuntimeChunkName = (entrypoint: WebpackEntrypoint) => {
      const appConfig = appConfigMap.get(compiler);
      if (!appConfig) {
        throw new Error('`appConfig` not found. This might be an internal error in GojiJS.');
      }
      const [, independents] = getSubpackagesInfo(appConfig);
      // FIXME: should use same runtime to fix shared closure issue
      for (const item of independents) {
        if (isBelongsTo(entrypoint.name, item.root ?? '')) {
          return `${item.root}/runtime`;
        }
      }
      return `runtime`;
    };
  }

  private rewrite(compiler: webpack.Compiler) {
    this.overrideCacheGroups(compiler);
    this.overrideRuntimeChunk(compiler);
  }

  public apply(compiler: webpack.Compiler) {
    compiler.hooks.compile.tap('GojiSplitChunksWebpackPlugin', () => this.rewrite(compiler));
  }
}

export interface CacheGroups {
  [key: string]: webpack.Options.CacheGroupsOptions | false;
}

export const cacheGroupsPlaceholder: CacheGroups = {};

export const runtimeChunkPlaceholder = {
  name: (entrypoint: WebpackEntrypoint) => realRuntimeChunkName(entrypoint),
};

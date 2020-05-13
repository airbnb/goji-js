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
 * this plugin generate `compiler.options.optimization.splitChunks.cacheGroups` from `appConfig`
 * because we cannot access `appConfig` when `webpack.config.js` is initializing we have to use the
 * `cacheGroupsPlaceholder` and then patch the `cacheGroups` in this plugin
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
  name: (entrypoint: WebpackEntrypoint) => {
    return realRuntimeChunkName(entrypoint);
  },
};

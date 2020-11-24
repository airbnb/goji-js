import webpack from 'webpack';
import { GojiBasedWebpackPlugin } from './based';
import { appConfigMap } from '../shared';
import { getSubpackagesInfo, isBelongsTo } from '../utils/config';
import { WebpackEntrypoint, WebpackCacheGroups, WebpackRuntimeChunk } from '../types/patch';

let realRuntimeChunkName: (entrypoint: WebpackEntrypoint) => string;

/**
 * this plugin generate `compiler.options.optimization.splitChunks.cacheGroups` from `appConfig`
 * because we cannot access `appConfig` when `webpack.config.js` is initializing we have to use the
 * `cacheGroupsPlaceholder` and then patch the `cacheGroups` in this plugin
 */
export class GojiSplitChunksWebpackPlugin extends GojiBasedWebpackPlugin {
  private overrideCacheGroups(compiler: webpack.Compiler) {
    const { splitChunks } = compiler.options.optimization;
    if (!splitChunks) {
      throw new Error(
        'The `optimization.splitChunks.cacheGroups` in `webpack.config.js` must be set',
      );
    }
    const { cacheGroups } = splitChunks;
    if (!cacheGroups) {
      throw new Error(
        'The `optimization.splitChunks.cacheGroups` in `webpack.config.js` must be set',
      );
    }
    // clean up cache group before use it
    for (const key of Object.keys(cacheGroups)) {
      delete cacheGroups[key];
    }

    const appConfig = appConfigMap.get(compiler);
    if (!appConfig) {
      throw new Error('`appConfig` not found. This might be an internal error in Goji.');
    }
    const [subPackages, independents] = getSubpackagesInfo(appConfig);
    cacheGroups.commons = {
      name: 'commons',
      idHint: 'commons',
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
        idHint: `${subPackage}/commons`,
        test(module: webpack.Module) {
          if (independent) {
            return true;
          }
          const chunks = module.getChunks();
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
        throw new Error('`appConfig` not found. This might be an internal error in Goji.');
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

export const cacheGroupsPlaceholder: WebpackCacheGroups = {};

export const runtimeChunkPlaceholder: WebpackRuntimeChunk = {
  name: entrypoint => {
    return realRuntimeChunkName(entrypoint);
  },
};

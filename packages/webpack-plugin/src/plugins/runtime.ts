import webpack from 'webpack';
import path from 'path';
import { ConcatSource } from 'webpack-sources';
import { GojiBasedWebpackPlugin } from './based';
import { safeUrlToRequest } from '../utils/path';
import { COMMON_CHUNK_NAME, RUNTIME_FILE_NAME } from '../constants/paths';

type RuntimePluginExt = '.js' | '.wxss';

export const generateDependenciesSource = (
  type: RuntimePluginExt,
  ext: string,
  dependencies: Array<string>,
) => {
  switch (type) {
    case '.js':
      return dependencies.map(file => `require('${safeUrlToRequest(file)}');\n`).join('');
    case '.wxss':
      return dependencies.map(file => `@import '${safeUrlToRequest(file)}${ext}';\n`).join('');
    default:
      throw new Error(`invalid type ${type}`);
  }
};

const RUNTIME_METAS: Array<{ ext: RuntimePluginExt; ignoreEmptyAsset: boolean }> = [
  {
    ext: '.js',
    ignoreEmptyAsset: true,
  },
  {
    ext: '.wxss',
    ignoreEmptyAsset: false,
  },
];

/**
 * Please read and understand `./splitChunks.ts` before this plugin.
 * This plugin adds `require()` or `@import ''` for each entry to support common chunk split.
 *
 * Although we can always add prefix for all pages, we still need to consider not to add useless code.
 * Here are some cases that should or should not add prefix code. `a -> b` means `a` requires `b`
 *   pages in main package -> `_goji_commons.*` or `_goji_runtime.js` : change `app.*` is enough, because `app.*` auto applies for all pages
 *   pages in a sub-package -> `_goji_commons.*` or `_goji_runtime.js` : change `app.*` is enough
 *   pages in a sub-package -> `sub-packages/_goji_commons.*` : change the page files
 *   pages in a independent package -> `independent-package/_goji_commons.*` : change the page files
 *   pages in a independent package -> `independent-package/_goji_runtime.js` : change the page files
 * All in all, we can hoist the root common/runtime chunk to `app.*`. The reasons are:
 *   1. More clean code for output files
 *   2. On Alipay, the dev tool always bundle common chunks into a sub-package that cause each sub-package
 *      has a large size. But the `app.*` way only bundle once.
 */
export class GojiRuntimePlugin extends GojiBasedWebpackPlugin {
  public apply(compiler: webpack.Compiler) {
    compiler.hooks.emit.tap('GojiEntryWebpackPlugin', compilation => {
      for (const entryChunk of compilation.chunks) {
        if (!entryChunk.hasEntryModule()) {
          continue;
        }
        const dependentChunkNames: Array<string> = [];
        for (const group of entryChunk.groupsIterable) {
          for (const chunk of group.chunks) {
            // ignore self
            if (chunk === entryChunk) {
              continue;
            }
            // assume output.filename is chunk.name here
            const depentChunkName = chunk.name;
            // uniq
            if (!dependentChunkNames.includes(depentChunkName)) {
              dependentChunkNames.push(chunk.name);
            }
          }
        }
        // Add root common chunk for `app.*` even if it doesn't depends on the root common chunk, this
        // ensures the hoist works as expected.
        // No need to check `runtime` because it must be already included
        if (entryChunk.name === 'app' && !dependentChunkNames.includes(COMMON_CHUNK_NAME)) {
          dependentChunkNames.push(COMMON_CHUNK_NAME);
        }

        // This line try to fix the wrong order in CSS files
        // For example, the `sub/pages/index.wxss` correct order should be:
        //   @import '../../_goji_commons.wxss';
        //   @import '../_goji_commons.wxss';
        // This issue might be related to the `priority` in `cacheGroup.ts`
        dependentChunkNames.reverse();

        for (const meta of RUNTIME_METAS) {
          const transformedExt = this.transformExt(meta.ext);
          const file = entryChunk.name + transformedExt;
          // ignore empty assets
          if (meta.ignoreEmptyAsset && !compilation.assets[file]) {
            continue;
          }
          const existedDependentChunkNames = dependentChunkNames.filter(
            chunkName => compilation.assets[chunkName + transformedExt],
          );
          // FIXME: ignore `@import '_goji_commons.wxss'` in integration mode to reduce the main/full package size
          // in this case you should import `_goji_commons.wxss` manually in `app.mina`

          const filteredDependentChunkNames = existedDependentChunkNames.filter(chunkName => {
            if (chunkName === COMMON_CHUNK_NAME || chunkName === RUNTIME_FILE_NAME) {
              // remove root common/runtime chunk for pages
              if (entryChunk.name !== 'app') {
                return false;
              }
            }
            return true;
          });
          const prefix = generateDependenciesSource(
            meta.ext,
            transformedExt,
            filteredDependentChunkNames.map(chunkName =>
              path.posix.relative(path.posix.dirname(entryChunk.name), chunkName),
            ),
          );
          compilation.assets[file] = new ConcatSource(prefix, compilation.assets[file] || '');
        }
      }
    });
  }
}

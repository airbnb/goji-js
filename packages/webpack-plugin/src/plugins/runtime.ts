import webpack from 'webpack';
import path from 'path';
import { ConcatSource } from 'webpack-sources';
import { GojiBasedWebpackPlugin } from './based';
import { safeUrlToRequest } from '../utils/path';

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
 * add `require()` or `@import ''` for each entry to support common chunk split
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

        // this line try to fix the wrong order in CSS files
        // For example, the `sub/pages/index.wxss` correct order should be:
        //   @import '../../commons.wxss';
        //   @import '../commons.wxss';
        // this issue might be related to the `priority` in `cacheGroup.ts`
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
          // FIXME: ignore `@import 'commons.wxss'` in integration mode to reduce the main/full package size
          // in this case you should import `commons.wxss` manually in `app.mina`
          const filteredDependentChunkNames = existedDependentChunkNames.filter(chunkName => {
            if (
              meta.ext === '.wxss' &&
              chunkName === 'commons' &&
              this.options.unsafe_integrationMode
            ) {
              return false;
            }
            return true;
          });
          const prefix = generateDependenciesSource(
            meta.ext,
            transformedExt,
            filteredDependentChunkNames.map(chunkName =>
              path.relative(path.dirname(entryChunk.name), chunkName),
            ),
          );
          compilation.assets[file] = new ConcatSource(prefix, compilation.assets[file] || '');
        }
      }
    });
  }
}

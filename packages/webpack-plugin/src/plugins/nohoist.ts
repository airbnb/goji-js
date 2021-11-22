import webpack from 'webpack';
import GraphHelpers from 'webpack/lib/GraphHelpers';
import path from 'path';
import { GojiBasedWebpackPlugin } from './based';
import { NO_HOIST_PREFIX, NO_HOIST_TEMP_DIR } from '../constants/paths';

// inspired from https://github.com/webpack/webpack/blob/c181294865dca01b28e6e316636fef5f2aad4eb6/lib/GraphHelpers.js#L19-L23
const disconnectChunkGroupAndChunk = (chunkGroup, chunk) => {
  if (chunkGroup.removeChunk(chunk)) {
    chunk.removeGroup(chunkGroup);
  }
};

const isNohoistTempFile = (filePath: string) => filePath.startsWith(`${NO_HOIST_TEMP_DIR}/`);

/**
 * This plugin moves `_goji_nohoist_tep/abc.js` to `packageName/_goji_nohoist_abc.js`
 * while maintaining correct dependencies between chunks/modules/chunkGroup
 */
export class GojiNohoistWebpackPlugin extends GojiBasedWebpackPlugin {
  public apply(compiler: webpack.Compiler) {
    compiler.hooks.compile.tap('GojiNohoistWebpackPlugin', () => {
      compiler.hooks.thisCompilation.tap(
        'GojiNohoistWebpackPlugin',
        (compilation: webpack.compilation.Compilation) => {
          compilation.hooks.afterOptimizeChunks.tap(
            'GojiNohoistWebpackPlugin',
            (chunks, chunkGroups) => {
              for (const chunkGroup of chunkGroups) {
                for (const chunk of [...chunkGroup.chunks]) {
                  if (isNohoistTempFile(chunk.name)) {
                    const nohoistTempFileName = path.posix.basename(chunk.name);
                    // @ts-ignore
                    const subPackageName = chunkGroup.options.name.split('/')[0];
                    const distNohoistFileName = `${subPackageName}/${NO_HOIST_PREFIX}${nohoistTempFileName}`;
                    const newChunk: webpack.compilation.Chunk =
                      // @ts-ignore
                      compilation.addChunk(distNohoistFileName);
                    newChunk.entryModule = chunk.entryModule;
                    GraphHelpers.connectChunkGroupAndChunk(chunkGroup, newChunk);
                    for (const module of chunk.getModules()) {
                      GraphHelpers.connectChunkAndModule(newChunk, module);
                    }
                    disconnectChunkGroupAndChunk(chunkGroup, chunk);
                  }
                }
              }
              // clean up `compilation.chunks` to prevent these temp files to be emitted
              for (const chunk of [...chunks]) {
                if (isNohoistTempFile(chunk.name)) {
                  chunks.splice(chunks.indexOf(chunk), 1);
                  compilation.namedChunks.delete(chunk.name);
                }
              }
            },
          );
        },
      );
    });
  }
}

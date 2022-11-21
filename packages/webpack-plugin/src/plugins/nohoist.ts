import webpack, { ChunkGraph } from 'webpack';
import path from 'path';
import { GojiBasedWebpackPlugin } from './based';
import { NO_HOIST_PREFIX, NO_HOIST_TEMP_DIR } from '../constants/paths';

const isNohoistTempFile = (filePath: string) => filePath.startsWith(`${NO_HOIST_TEMP_DIR}/`);

/**
 * This plugin moves `_goji_nohoist_tep/abc.js` to `packageName/_goji_nohoist_abc.js`
 * while maintaining correct dependencies between chunks/modules/chunkGroup
 */
export class GojiNohoistWebpackPlugin extends GojiBasedWebpackPlugin {
  public apply(compiler: webpack.Compiler) {
    compiler.hooks.thisCompilation.tap(
      'GojiNohoistWebpackPlugin',
      (compilation: webpack.Compilation) => {
        compilation.hooks.afterOptimizeChunkModules.tap(
          'GojiNohoistWebpackPlugin',
          // @ts-expect-error
          (chunks: Set<webpack.Chunk>) => {
            const { chunkGraph } = compilation;
            // clean up useless chunks to prevent these temp files to be emitted
            for (const chunk of chunks) {
              if (!isNohoistTempFile(chunk.name)) {
                continue;
              }
              const nohoistTempFileName = path.posix.basename(chunk.name);
              const chunkGroups = chunk.groupsIterable;
              const modules = chunkGraph.getChunkModules(chunk);
              // move chunk into each chunkGroups(sub packages)
              for (const chunkGroup of chunkGroups) {
                const subPackageName = chunkGroup.options.name?.split('/')[0];
                const distNohoistFileName = `${subPackageName}/${NO_HOIST_PREFIX}${nohoistTempFileName}`;
                // fork the chunk to new chunk
                const newChunk: webpack.Chunk = compilation.addChunk(distNohoistFileName);
                newChunk.runtime = chunk.runtime;
                newChunk.idNameHints.add(distNohoistFileName);
                for (const module of modules) {
                  chunkGraph.connectChunkAndModule(newChunk, module);
                }
                chunkGroup.replaceChunk(chunk, newChunk);
                chunk.removeGroup(chunkGroup);
                newChunk.addGroup(chunkGroup);
                chunks.add(newChunk);
              }
              // this line also clean up modules and groups
              chunkGraph.disconnectChunk(chunk);
              compilation.namedChunks.delete(chunk.name);
              chunks.delete(chunk);
              // TODO: remove in webpack 6
              ChunkGraph.clearChunkGraphForChunk(chunk);
            }
          },
        );
      },
    );
  }
}

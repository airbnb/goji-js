import webpack from 'webpack';
import loaderUtils from 'loader-utils';
import { pathEntriesMap, appEntryMap, appConfigMap } from '../shared';
import { GojiBasedWebpackPlugin } from './based';
import {
  loadConfigSourceByChildCompiler,
  evalConfigSource,
  resolveConfigPath,
} from '../utils/loadConfig';
import { AppConfig } from '../types';
import { readPathsFromAppConfig } from '../utils/config';

/**
 * resolve `app.json` to generate dynamic entries
 */
export class GojiEntryWebpackPlugin extends GojiBasedWebpackPlugin {
  private async rewrite(compiler: webpack.Compiler) {
    const { context, entry: entryOptions } = compiler.options;
    const entryStaticNormalized =
      typeof entryOptions === 'function' ? await entryOptions() : entryOptions;
    const entry = entryStaticNormalized.main.import?.[0];
    if (typeof entry !== 'string') {
      throw new Error('`entry` must be string');
    }
    if (!context) {
      throw new Error('`context` not found');
    }
    // because no compilation was created while `compiler.run` or `compiler.watchRun`
    // we have to create a fake one to call `createChildCompiler`
    const fakeCompilation = new webpack.Compilation(compiler);
    const appConfigPath = await resolveConfigPath(
      entry,
      context,
      compiler.options.resolve?.extensions,
    );
    if (!appConfigPath) {
      throw new Error(
        '`entry` not found. `entry` should be one of `app.json`, `app.config.js` or `app.config.ts`',
      );
    }
    const appConfigSource = await loadConfigSourceByChildCompiler(
      appConfigPath,
      context,
      fakeCompilation,
    );
    const appConfig: AppConfig = evalConfigSource(entry, appConfigSource, this.options.target);

    const appEntry = 'app';
    const pathEntries = readPathsFromAppConfig(appConfig);

    // add app & pages
    for (const pathEntry of [appEntry, ...pathEntries]) {
      const request = loaderUtils.urlToRequest(pathEntry);
      new webpack.EntryPlugin(
        context,
        `${require.resolve('../loaders/configFile')}?target=${this.options.target}!${request}`,
        pathEntry,
      ).apply(compiler);
    }
    // save for other plugins
    appConfigMap.set(compiler, appConfig);
    appEntryMap.set(compiler, appEntry);
    pathEntriesMap.set(compiler, pathEntries);
  }

  // FIXME: remove the main entry which content is `app.json`
  // is there any better way to avoid this chunk being generated ?
  private removeMainEntry(compilation: webpack.Compilation) {
    const mainChunk = [...compilation.chunks].find((chunk: webpack.Chunk) => chunk.name === 'main');
    if (!mainChunk) {
      console.warn('main chunk not found');
      return;
    }
    for (const file of mainChunk.files) {
      delete compilation.assets[file];
    }
  }

  public apply(compiler: webpack.Compiler) {
    if (compiler.options.watch) {
      // for watch mode
      compiler.hooks.watchRun.tapPromise('GojiEntryWebpackPlugin', theCompiler =>
        this.rewrite(theCompiler),
      );
    } else {
      // for production mode
      compiler.hooks.run.tapPromise('GojiEntryWebpackPlugin', theCompiler =>
        this.rewrite(theCompiler),
      );
    }

    compiler.hooks.thisCompilation.tap('GojiEntryWebpackPlugin', compilation => {
      compilation.hooks.processAssets.tap('GojiEntryWebpackPlugin', () => {
        this.removeMainEntry(compilation);
      });
    });
  }
}

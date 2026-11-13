import webpack from 'webpack';
import loaderUtils from 'loader-utils';
import fs from 'fs';
import path from 'path';
import {
  pathEntriesMap,
  appEntryMap,
  appConfigMap,
  customTabBarEntryMap,
  definitionsMap,
} from '../shared';
import { GojiBasedWebpackPlugin } from './based';
import {
  loadConfigSourceByChildCompiler,
  evalConfigSource,
  resolveConfigPath,
} from '../utils/loadConfig';
import { AppConfig } from '../types';
import {
  getCustomTabBarEntry,
  getRuntimeTabBarList,
  readPathsFromAppConfig,
} from '../utils/config';
import { getChunkName } from '../utils/chunkName';

const isEntrySourceExists = (
  context: string,
  entry: string,
  compiler: webpack.Compiler,
): boolean => {
  // `custom-tab-bar/index` might be a folder with `index.js` or a file with any extension
  if (fs.existsSync(path.join(context, entry))) {
    return true;
  }
  return (compiler.options.resolve?.extensions ?? ['.js']).some(ext =>
    fs.existsSync(path.join(context, `${entry}${ext}`)),
  );
};

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
    const fakeCompilation = compiler.createCompilation(compiler.newCompilationParams());
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
    const customTabBarEntry = getCustomTabBarEntry(appConfig, this.options.target);
    if (customTabBarEntry && !isEntrySourceExists(context, customTabBarEntry, compiler)) {
      // throw a readable error before the generic "Module not found" thrown by webpack
      throw new Error(
        `\`tabBar.custom\` is enabled but \`src/${customTabBarEntry}\` is not found.\n` +
          `Please create it and call \`render(<TabBar />, { type: 'component' })\`.\n` +
          'See https://developers.weixin.qq.com/miniprogram/dev/framework/ability/custom-tabbar.html',
      );
    }

    // add app & pages
    for (const theEntry of [
      appEntry,
      ...pathEntries,
      ...(customTabBarEntry ? [customTabBarEntry] : []),
    ]) {
      const request = loaderUtils.urlToRequest(theEntry);
      new webpack.EntryPlugin(
        context,
        `${require.resolve('../loaders/configFile')}?target=${
          this.options.target
        }&entry=${theEntry}!${request}`,
        theEntry,
      ).apply(compiler);
    }
    // save for other plugins
    appConfigMap.set(compiler, appConfig);
    appEntryMap.set(compiler, appEntry);
    pathEntriesMap.set(compiler, pathEntries);
    customTabBarEntryMap.set(compiler, customTabBarEntry);
    // `useTabBar` needs `tabBar.list` to find out which page is the current one
    const definitions = definitionsMap.get(compiler);
    if (definitions) {
      definitions['process.env.GOJI_TAB_BAR_LIST'] = JSON.stringify(
        getRuntimeTabBarList(appConfig),
      );
    }
  }

  // FIXME: remove the main entry which content is `app.json`
  // is there any better way to avoid this chunk being generated ?
  private removeMainEntry(compilation: webpack.Compilation) {
    const mainChunk = [...compilation.chunks].find(
      (chunk: webpack.Chunk) => getChunkName(chunk) === 'main',
    );
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

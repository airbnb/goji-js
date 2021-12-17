/* eslint-disable import/no-import-module-exports */
import { GojiTarget } from '@goji/core';
import webpack from 'webpack';
import path from 'path';
import {
  loadConfigSourceByChildCompiler,
  evalConfigSource,
  resolveConfigPath,
} from '../utils/loadConfig';

interface ConfigFileLoaderOptions {
  target: GojiTarget;
  entry: string;
}

const loadAsset = async (
  context: webpack.LoaderContext<ConfigFileLoaderOptions>,
  assetPath: string,
): Promise<string> =>
  context.importModule(`${path.basename(assetPath)}.webpack[asset/resource]!=!${assetPath}`);

// emit image assets from tab bar list
const emitAssets = async (context: webpack.LoaderContext<ConfigFileLoaderOptions>, config: any) => {
  // support both `list` and `items`
  const tabBarList = config?.tabBar?.list ?? config?.tabBar?.items ?? [];
  for (const item of tabBarList) {
    if (item.iconPath) {
      item.iconPath = await loadAsset(context, item.iconPath);
    }
    if (item.selectedIconPath) {
      item.selectedIconPath = await loadAsset(context, item.selectedIconPath);
    }
    // Alipay fields
    if (item.icon) {
      item.icon = await loadAsset(context, item.icon);
    }
    if (item.activeIcon) {
      item.activeIcon = await loadAsset(context, item.activeIcon);
    }
  }
  return config;
};

const emitConfigFile = async (context: webpack.LoaderContext<ConfigFileLoaderOptions>) => {
  const { rootContext } = context;
  const { target, entry } = context.getOptions();
  const configInputPath = await resolveConfigPath(
    entry,
    rootContext,
    // eslint-disable-next-line no-underscore-dangle
    context._compiler?.options?.resolve?.extensions,
  );
  if (!configInputPath) {
    // `.config.js` doesn't exist
    return;
  }
  context.addDependency(configInputPath);

  const configSource = await loadConfigSourceByChildCompiler(
    configInputPath,
    context.context,
    // eslint-disable-next-line no-underscore-dangle
    context._compilation!,
  );
  const configOutput = evalConfigSource(configInputPath, configSource, target);

  await emitAssets(context, configOutput);
  context.emitFile(`${entry}.json`, JSON.stringify(configOutput), undefined);
};

const GojiConfigFileLoader: webpack.LoaderDefinition<ConfigFileLoaderOptions> =
  function GojiConfigFileLoader(source) {
    (async () => {
      const callback = this.async();
      try {
        await emitConfigFile(this);
        callback?.(null, source);
      } catch (err) {
        callback?.(err as Error);
      }
    })();
  };

module.exports = GojiConfigFileLoader;

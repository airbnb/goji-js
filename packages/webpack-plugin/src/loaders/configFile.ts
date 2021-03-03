import { GojiTarget } from '@goji/core';
import webpack from 'webpack';
import loaderUtils from 'loader-utils';
import { promisify } from 'util';
import {
  exec,
  loadConfigSourceByChildCompiler,
  evalConfigSource,
  resolveConfigPath,
} from '../utils/loadConfig';

const loadAsset = async (context: webpack.loader.LoaderContext, assetPath: string) => {
  const source = await promisify(context.loadModule.bind(context))(
    // FIXME: should reuse `file-loader` rule from `webpack.config.js` ?
    `!${require.resolve(
      'file-loader',
    )}?esModule=false&name=assets/[name].[hash:6].[ext]&publicPath=/!${assetPath}`,
  );
  return exec(source, assetPath, context.context);
};

// emit image assets from tab bar list
const emitAssets = async (context: webpack.loader.LoaderContext, config: any) => {
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

const emitConfigFile = async (context: webpack.loader.LoaderContext) => {
  const { rootContext } = context;
  const { target, entry } = loaderUtils.getOptions(context) as {
    target: GojiTarget;
    entry: string;
  };
  const configInputPath = await resolveConfigPath(
    entry,
    rootContext,
    // eslint-disable-next-line no-underscore-dangle
    context._compiler.options.resolve?.extensions,
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
    context._compilation,
  );
  const configOutput = evalConfigSource(configInputPath, configSource, target);

  await emitAssets(context, configOutput);
  context.emitFile(`${entry}.json`, JSON.stringify(configOutput), undefined);
};

module.exports = async function GojiConfigFileLoader(
  this: webpack.loader.LoaderContext,
  source: string | Buffer,
) {
  if (this.cacheable) {
    this.cacheable();
  }
  const callback = this.async();

  try {
    await emitConfigFile(this);
  } catch (err) {
    if (callback) {
      callback(err);
    }
    return;
  }

  if (callback) {
    callback(null, source);
  }
};

import webpack from 'webpack';
import { GojiBridgeWebpackPlugin } from './plugins/bridge';
import { GojiEntryWebpackPlugin } from './plugins/entry';
import { GojiRuntimePlugin } from './plugins/runtime';
import { GojiWebpackPluginOptions, GojiWebpackPluginRequiredOptions } from './types';
import { GojiSingletonRuntimeWebpackPlugin } from './plugins/singleton';
import { GojiShimPlugin } from './plugins/shim';
import { getPoll } from './utils/polling';
import { GojiProjectConfigPlugin } from './plugins/projectConfig';
import { GojiCollectUsedComponentsWebpackPlugin } from './plugins/collectUsedComponents';
import { getWrappedComponents } from './constants/components';
import { registerPluginComponent } from './utils/pluginComponent';
import { GojiSplitChunksWebpackPlugin } from './plugins/chunks/split';
import { GojiRuntimeChunksWebpackPlugin } from './plugins/chunks/runtime';
import { GojiNohoistWebpackPlugin } from './plugins/nohoist';

export class GojiWebpackPlugin implements webpack.WebpackPluginInstance {
  public static normalizeOptions(
    options: GojiWebpackPluginOptions,
  ): GojiWebpackPluginRequiredOptions {
    const nodeEnv = options.nodeEnv ?? process.env.NODE_ENV ?? 'development';
    const isProd = nodeEnv === 'production';

    return {
      target: options.target,
      nodeEnv,
      maxDepth: options.maxDepth ?? 5,
      minimize: options.minimize ?? nodeEnv !== 'development',
      nohoist: {
        enable: options?.nohoist?.enable ?? isProd,
        maxPackages: options?.nohoist?.maxPackages ?? 1,
        test: options?.nohoist?.test,
      },
    };
  }

  private options: GojiWebpackPluginRequiredOptions;

  public constructor(options: GojiWebpackPluginOptions) {
    this.options = GojiWebpackPlugin.normalizeOptions(options);
  }

  public apply(compiler: webpack.Compiler) {
    const { options } = this;
    new webpack.DefinePlugin({
      'process.env.TARGET': JSON.stringify(options.target),
      'process.env.GOJI_TARGET': JSON.stringify(options.target),
      'process.env.GOJI_MAX_DEPTH': JSON.stringify(options.maxDepth),
      'process.env.GOJI_WRAPPED_COMPONENTS': JSON.stringify(getWrappedComponents(options.target)),
    }).apply(compiler);
    new GojiCollectUsedComponentsWebpackPlugin(options).apply(compiler);
    new GojiBridgeWebpackPlugin(options).apply(compiler);
    new GojiEntryWebpackPlugin(options).apply(compiler);
    new GojiSplitChunksWebpackPlugin(options).apply(compiler);
    new GojiRuntimeChunksWebpackPlugin(options).apply(compiler);
    new GojiNohoistWebpackPlugin(options).apply(compiler);
    new GojiRuntimePlugin(options).apply(compiler);
    new GojiSingletonRuntimeWebpackPlugin(options).apply(compiler);
    new GojiShimPlugin(options).apply(compiler);
    new GojiProjectConfigPlugin(options).apply(compiler);
  }

  public static getPoll = getPoll;

  // eslint-disable-next-line camelcase
  public static internal_registerPluginComponent = registerPluginComponent;
}

export { GojiWebpackPluginOptions };

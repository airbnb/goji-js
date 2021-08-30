import webpack from 'webpack';
import { GojiBridgeWebpackPlugin } from './plugins/bridge';
import { GojiEntryWebpackPlugin } from './plugins/entry';
import { GojiRuntimePlugin } from './plugins/runtime';
import { GojiWebpackPluginOptions } from './types';
import { DEFAULT_OPTIONS } from './constants';
import { GojiSingletonRuntimeWebpackPlugin } from './plugins/singleton';
import { GojiChunksWebpackPlugin } from './plugins/chunks';
import { GojiShimPlugin } from './plugins/shim';
import { getPoll } from './utils/polling';
import { GojiProjectConfigPlugin } from './plugins/projectConfig';
import { GojiCollectUsedComponentsWebpackPlugin } from './plugins/collectUsedComponents';
import { getWrappedComponents } from './constants/components';
import { registerPluginComponent } from './utils/pluginComponent';

export class GojiWebpackPlugin implements webpack.Plugin {
  private options: GojiWebpackPluginOptions;

  public constructor(options: Partial<GojiWebpackPluginOptions> = {}) {
    this.options = {
      ...DEFAULT_OPTIONS,
      ...options,
    };
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
    new GojiChunksWebpackPlugin(options).apply(compiler);
    new GojiRuntimePlugin(options).apply(compiler);
    new GojiSingletonRuntimeWebpackPlugin(options).apply(compiler);
    new GojiShimPlugin(options).apply(compiler);
    new GojiProjectConfigPlugin(options).apply(compiler);
  }

  public static getPoll = getPoll;

  // eslint-disable-next-line camelcase
  public static internal_registerPluginComponent = registerPluginComponent;
}

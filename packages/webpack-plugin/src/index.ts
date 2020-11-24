import webpack from 'webpack';
import { GojiBridgeWebpackPlugin } from './plugins/bridge';
import { GojiEntryWebpackPlugin } from './plugins/entry';
import { GojiRuntimePlugin } from './plugins/runtime';
import { GojiWebpackPluginOptions } from './types';
import { DEFAULT_OPTIONS } from './constants';
import { GojiSingletonRuntimeWebpackPlugin } from './plugins/singleton';
import {
  GojiSplitChunksWebpackPlugin,
  cacheGroupsPlaceholder,
  runtimeChunkPlaceholder,
} from './plugins/splitChunks';
import { GojiShimPlugin } from './plugins/shim';
import { getPoll } from './utils/polling';
import { GojiProjectConfigPlugin } from './plugins/projectConfig';
import { GojiCollectUsedComponentsWebpackPlugin } from './plugins/collectUsedComponents';
import { getWrappedComponents } from './constants/components';

export class GojiWebpackPlugin implements webpack.WebpackPluginInstance {
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
    new GojiSplitChunksWebpackPlugin(options).apply(compiler);
    new GojiRuntimePlugin(options).apply(compiler);
    new GojiSingletonRuntimeWebpackPlugin(options).apply(compiler);
    new GojiShimPlugin(options).apply(compiler);
    new GojiProjectConfigPlugin(options).apply(compiler);
  }

  public static cacheGroupsPlaceholder: typeof cacheGroupsPlaceholder = cacheGroupsPlaceholder;

  public static runtimeChunkPlaceholder: typeof runtimeChunkPlaceholder = runtimeChunkPlaceholder;

  public static getPoll = getPoll;
}

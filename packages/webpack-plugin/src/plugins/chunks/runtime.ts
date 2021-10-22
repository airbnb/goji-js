import webpack from 'webpack';
import { GojiBasedWebpackPlugin } from '../based';
import { appConfigMap } from '../../shared';
import { getSubpackagesInfo, isBelongsTo } from '../../utils/config';
import { AppConfig } from '../../types';
import { RUNTIME_FILE_NAME } from '../../constants/paths';

interface WebpackEntrypoint {
  name: string;
}

const getRuntimeNameCallback = (appConfig: AppConfig) => (entrypoint: WebpackEntrypoint) => {
  const [, independents] = getSubpackagesInfo(appConfig);
  for (const item of independents) {
    if (isBelongsTo(entrypoint.name, item.root ?? '')) {
      return `${item.root}/${RUNTIME_FILE_NAME}`;
    }
  }
  return RUNTIME_FILE_NAME;
};

export class GojiRuntimeChunksWebpackPlugin extends GojiBasedWebpackPlugin {
  public apply(compiler: webpack.Compiler) {
    compiler.hooks.compile.tap('GojiRuntimeChunksWebpackPlugin', () => {
      if (compiler.options.optimization?.runtimeChunk !== false) {
        throw new Error(
          'To enable `GojiRuntimeChunksWebpackPlugin`, the `optimization.runtimeChunk` in webpack config file must be `false`.',
        );
      }
      const appConfig = appConfigMap.get(compiler);
      if (!appConfig) {
        throw new Error('`appConfig` not found. This might be an internal error in GojiJS.');
      }
      const name = getRuntimeNameCallback(appConfig);
      // @ts-ignore
      new webpack.optimize.RuntimeChunkPlugin({
        name,
      }).apply(compiler);
    });
  }
}

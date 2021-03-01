import path from 'path';
import webpack from 'webpack';
import { GojiTarget } from '@goji/core';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { GojiWebpackPlugin } from '@goji/webpack-plugin/dist/cjs';
import resolve from 'resolve';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import findCacheDir from 'find-cache-dir';
import { preprocessLoader, getThreadLoader, getCacheLoader } from './loaders';

const getSourceMap = (nodeEnv: string, target: GojiTarget) => {
  // enable source map in development mode
  if (nodeEnv === 'development') {
    return 'cheap-source-map';
  }
  // WeChat support uploading source map
  if (target === 'wechat') {
    return 'source-map';
  }

  return false;
};

// webpack@4 stats config
const getStats = () => ({
  // copied from `'minimal'` https://github.com/webpack/webpack/blob/009e47c8f76ae702857f3493f1133946e33881d0/lib/Stats.js#L1636
  all: false,
  modules: true,
  maxModules: 0,
  errors: true,
  warnings: true,
  // @ts-ignore
  logging: 'warn',
  // copied end
  errorDetails: true,
  builtAt: true,
  colors: true,
});

export const getWebpackConfig = ({
  basedir,
  outputPath,
  target,
  nodeEnv,
  babelConfig,
  unsafe_integrationMode: integrationMode = false,
}: {
  basedir: string;
  outputPath?: string;
  target: GojiTarget;
  nodeEnv: string;
  babelConfig: any;
  // eslint-disable-next-line camelcase
  unsafe_integrationMode?: boolean;
}): webpack.Configuration => {
  const cacheLoaders = getCacheLoader(
    nodeEnv === 'production',
    integrationMode ? `${nodeEnv}-integration` : nodeEnv,
    target,
  );
  const threadLoaders = getThreadLoader();

  const CSS_FILE_EXT = {
    wechat: 'wxss',
    qq: 'qss',
    baidu: 'css',
    alipay: 'acss',
    toutiao: 'ttss',
  };

  return {
    mode: nodeEnv === 'production' ? 'production' : 'development',
    devtool: getSourceMap(nodeEnv, target),
    context: path.resolve(basedir, 'src'),
    entry: './app.config.ts',
    resolve: {
      alias: {
        'react-native$': resolve.sync('@goji/core/dist/esm', { basedir }),
      },
      extensions: ['.native.js', '.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'],
    },
    output: {
      path: outputPath ?? path.join(basedir, 'dist', target),
      filename: '[name].js',
      publicPath: '/',
      globalObject: 'Object',
    },
    optimization: {
      minimize: nodeEnv === 'production',
      runtimeChunk: GojiWebpackPlugin.runtimeChunkPlaceholder,
      splitChunks: {
        minChunks: 2,
        minSize: 0,
        cacheGroups: GojiWebpackPlugin.cacheGroupsPlaceholder,
      },
    },
    watchOptions: {
      poll: GojiWebpackPlugin.getPoll(),
    },
    stats: getStats(),
    performance: {
      hints: false,
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx|ts|tsx)$/,
          // compile node_modules in production mode
          // don't compile @babel/runtime otherwise the stack overflow error will be raised
          // https://github.com/babel/babel/issues/9764#issuecomment-476971266
          exclude: nodeEnv === 'production' ? /node_modules\/@babel\/runtime/ : /node_modules/,
          use: [
            // support `@goji/macro`
            {
              // loader: require.resolve('babel-loader'),
              loader: require.resolve('./fasterBabelLoaderForMacro'),
              options: {
                plugins: [[require.resolve('babel-plugin-macros'), { gojiMacro: { target } }]],
              },
            },
            ...cacheLoaders,
            ...threadLoaders,
            {
              loader: require.resolve('babel-loader'),
              options: babelConfig,
            },
            {
              loader: require.resolve('linaria/loader'),
              options: {
                configFile: require.resolve('./linaria.config'),
                sourceMap: true,
                // Linaria defaults to use `.linaria-cache` folder rather than standard `node_modules/.cache`
                // also we should use different folders based on `nodeEnv` and `target` to prevent wrong cache result
                cacheDirectory: findCacheDir({
                  name: `linaria-${nodeEnv}-${target}`,
                  cwd: basedir,
                }),
                babelOptions: {
                  // always use internal babel.config.js file
                  configFile: require.resolve('./babel.config'),
                },
              },
            },
            preprocessLoader('js', nodeEnv, target),
          ],
        },
        {
          test: /\.css$/,
          exclude: /\.linaria\.css$/,
          use: [
            MiniCssExtractPlugin.loader,
            ...cacheLoaders,
            {
              loader: require.resolve('css-loader'),
              options: {
                modules: {
                  mode: 'local',
                  localIdentName:
                    nodeEnv === 'development'
                      ? '[local]__[name]--[hash:base64:5]'
                      : '[hash:base64:5]',
                  localIdentContext: path.resolve(basedir, 'src'),
                },
              },
            },
            {
              loader: require.resolve('@goji/webpack-plugin/dist/cjs/loaders/transform'),
              options: {
                target,
                type: 'wxss',
              },
            },
            {
              loader: require.resolve('postcss-loader'),
              options: {
                config: {
                  path: __dirname,
                  ctx: {
                    integrationMode,
                  },
                },
              },
            },
            preprocessLoader('js', nodeEnv, target),
            {
              loader: require.resolve('postcss-loader'),
              options: {
                // eslint-disable-next-line global-require
                plugins: [require('postcss-import')({})],
              },
            },
          ],
        },
        {
          test: /\.linaria\.css$/,
          use: [
            MiniCssExtractPlugin.loader,
            ...cacheLoaders,
            {
              loader: require.resolve('css-loader'),
            },
            {
              loader: require.resolve('@goji/webpack-plugin/dist/cjs/loaders/transform'),
              options: {
                target,
                type: 'wxss',
              },
            },
            {
              loader: require.resolve('postcss-loader'),
              options: {
                config: {
                  path: __dirname,
                  ctx: {
                    integrationMode,
                  },
                },
              },
            },
            preprocessLoader('js', nodeEnv, target),
            {
              loader: require.resolve('postcss-loader'),
              options: {
                // eslint-disable-next-line global-require
                plugins: [require('postcss-import')({})],
              },
            },
          ],
        },
        {
          test: /\.(png|jpg|jpeg|gif)$/,
          use: [
            {
              loader: require.resolve('file-loader'),
              options: {
                name: 'assets/[name].[hash:6].[ext]',
              },
            },
          ],
        },
      ],
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: `[name].${CSS_FILE_EXT[integrationMode ? 'wechat' : target] ?? 'wxss'}`,
        chunkFilename: `[name].${CSS_FILE_EXT[integrationMode ? 'wechat' : target] ?? 'wxss'}`,
        ignoreOrder: true,
      }),
      new GojiWebpackPlugin({
        target,
        maxDepth: 5,
        minimize: nodeEnv !== 'development',
        unsafe_integrationMode: integrationMode,
      }),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(nodeEnv),
      }),
      new CleanWebpackPlugin({
        // FIXME: doesn't work in watch mode
        cleanStaleWebpackAssets: nodeEnv === 'production',
      }),
    ],
  };
};

import path from 'path';
import webpack from 'webpack';
import { GojiTarget } from '@goji/core';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { GojiWebpackPlugin } from '@goji/webpack-plugin/dist/cjs';
import resolve from 'resolve';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
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
  unstable_componentWhitelist: componentWhitelist,
}: {
  basedir: string;
  outputPath?: string;
  target: GojiTarget;
  nodeEnv: string;
  babelConfig: any;
  // eslint-disable-next-line camelcase
  unsafe_integrationMode?: boolean;
  // eslint-disable-next-line camelcase
  unstable_componentWhitelist?: Array<string>;
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
            ...cacheLoaders,
            ...threadLoaders,
            {
              loader: 'babel-loader',
              options: babelConfig,
            },
            preprocessLoader('js', nodeEnv, target),
          ],
        },
        {
          test: /\.css$/,
          use: [
            MiniCssExtractPlugin.loader,
            ...cacheLoaders,
            {
              loader: resolve.sync('css-loader', { basedir: __dirname }),
              options: {
                modules: {
                  mode: 'local',
                  localIdentName:
                    nodeEnv === 'development'
                      ? '[local]__[name]--[hash:base64:5]'
                      : '[hash:base64:5]',
                  context: path.resolve(basedir, 'src'),
                },
              },
            },
            {
              loader: resolve.sync('@goji/webpack-plugin/dist/cjs/loaders/transform', {
                basedir: __dirname,
              }),
              options: {
                target,
                type: 'wxss',
              },
            },
            {
              loader: resolve.sync('postcss-loader', { basedir: __dirname }),
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
              loader: resolve.sync('postcss-loader', { basedir: __dirname }),
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
              loader: resolve.sync('file-loader', { basedir: __dirname }),
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
        unstable_componentWhitelist: componentWhitelist,
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

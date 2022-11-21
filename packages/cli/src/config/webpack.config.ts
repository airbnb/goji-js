import path from 'path';
import webpack from 'webpack';
import TerserPlugin from 'terser-webpack-plugin';
import { GojiTarget } from '@goji/core';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import type { NonUndefined } from 'utility-types';
import { GojiWebpackPluginOptions, GojiWebpackPlugin } from '@goji/webpack-plugin';
import nodeLibsBrowser from 'node-libs-browser';
import resolve from 'resolve';
import { version as babelCoreVersion } from '@babel/core/package.json';
import { version as babelLoaderVersion } from 'babel-loader/package.json';
import postcssConfig from './postcssConfig';
import { getThreadLoader } from './loaders';

const getSourceMap = (nodeEnv: string, target: GojiTarget): webpack.Configuration['devtool'] => {
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

const getNodeLibsFallback = () => {
  const alias: NonUndefined<webpack.Configuration['resolve']>['fallback'] = {};
  for (const key of Object.keys(nodeLibsBrowser)) {
    alias[key] = nodeLibsBrowser[key] ?? false;
  }

  return alias;
};

export const getWebpackConfig = ({
  basedir,
  outputPath,
  target,
  nodeEnv,
  babelConfig,
  watch,
  progress,
  nohoist,
}: {
  basedir: string;
  outputPath?: string;
  target: GojiTarget;
  nodeEnv: string;
  babelConfig: any;
  watch: boolean;
  progress: boolean;
  nohoist?: GojiWebpackPluginOptions['nohoist'];
}): webpack.Configuration => {
  const threadLoaders = getThreadLoader(nodeEnv);

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
      fallback: getNodeLibsFallback(),
      extensions: ['.native.js', '.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'],
    },
    output: {
      path: outputPath ?? path.join(basedir, 'dist', target),
      filename: '[name].js',
      assetModuleFilename: 'assets/[name].[hash:6][ext]',
      publicPath: '/',
      globalObject: 'Object',
      clean: true,
    },
    optimization: {
      minimize: nodeEnv === 'production',
      // default options from https://github.com/webpack/webpack/blob/81f6c5b61cac5b8b5fdab1316933b0b824b1afcb/lib/config/defaults.js#L1067-L1081
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            format: {
              // remove `LICENSE.txt` files to reduce bundle size
              // https://github.com/webpack-contrib/terser-webpack-plugin/tree/f84a1498a279c13f3ce0d49ef537dddc8af5daef#remove-comments
              comments: false,
            },
            compress: {
              passes: 2,
            },
          },
          extractComments: false,
        }),
      ],
      // set `optimization.splitChunks` and `optimization.splitChunks` to `false`
      // to disable built-in plugins and then we can load `GojiChunksWebpackPlugin` manually.
      runtimeChunk: false,
      splitChunks: false,
    },
    // must reset `watch` option for correct `compiler.options.watch`
    watch,
    watchOptions: {
      poll: GojiWebpackPlugin.getPoll(),
    },
    cache: {
      type: 'filesystem',
      idleTimeout: 0,
      idleTimeoutForInitialStore: 0,
      // prevent re-using cache for different target
      version: target,
    },
    stats: {
      preset: 'minimal',
      errorDetails: true,
      builtAt: true,
      colors: true,
    },
    performance: {
      hints: false,
    },
    module: {
      rules: [
        {
          test: /\.m?js$/,
          resolve: {
            fullySpecified: false, // disable the behaviour
          },
        },
        {
          test: /\.(js|jsx|ts|tsx)$/,
          // compile node_modules in production mode
          // don't compile @babel/runtime otherwise the stack overflow error will be raised
          // https://github.com/babel/babel/issues/9764#issuecomment-476971266
          exclude: nodeEnv === 'production' ? /node_modules\/@babel\/runtime/ : /node_modules/,
          use: [
            // support `@goji/macro`
            {
              loader: require.resolve('./fixBabelLoaderForMacro'),
              options: {
                plugins: [[require.resolve('babel-plugin-macros'), { gojiMacro: { target } }]],
              },
            },
            ...threadLoaders,
            {
              loader: require.resolve('babel-loader'),
              options: {
                ...babelConfig,
                cacheDirectory: true,
                // inspired from https://github.com/babel/babel-loader/blob/144efda074cd09069ce976cfd2e26c0db2c20e94/src/index.js#L189-L193
                cacheIdentifier: JSON.stringify({
                  babelConfig,
                  '@babel/core': babelCoreVersion,
                  'babel-loader': babelLoaderVersion,
                  nodeEnv,
                  target,
                }),
              },
            },
            {
              loader: require.resolve('linaria/loader'),
              options: {
                configFile: require.resolve('./linaria.config'),
                sourceMap: true,
                cacheProvider: require.resolve('./linariaFileCache'),
                babelOptions: {
                  // always use internal babel.config.js file
                  configFile: require.resolve('./babel.config'),
                },
              },
            },
          ],
        },
        {
          test: /\.css$/,
          exclude: /\.linaria\.css$/,
          use: [
            MiniCssExtractPlugin.loader,
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
                implementation: require.resolve('postcss'),
                postcssOptions: {
                  config: false,
                  ...postcssConfig,
                },
              },
            },
            {
              loader: require.resolve('postcss-loader'),
              options: {
                implementation: require.resolve('postcss'),
                postcssOptions: {
                  config: false,
                  // eslint-disable-next-line global-require
                  plugins: [require('postcss-import')({})],
                },
              },
            },
          ],
        },
        {
          test: /\.linaria\.css$/,
          use: [
            MiniCssExtractPlugin.loader,
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
                implementation: require.resolve('postcss'),
                postcssOptions: {
                  config: false,
                  ...postcssConfig,
                },
              },
            },
            {
              loader: require.resolve('postcss-loader'),
              options: {
                implementation: require.resolve('postcss'),
                postcssOptions: {
                  config: false,
                  // eslint-disable-next-line global-require
                  plugins: [require('postcss-import')({})],
                },
              },
            },
          ],
        },
        {
          test: /\.(png|jpg|jpeg|gif)$/,
          type: 'asset/resource',
        },
      ],
    },
    // @ts-expect-error
    plugins: [
      new MiniCssExtractPlugin({
        filename: `[name].${CSS_FILE_EXT[target] ?? 'wxss'}`,
        chunkFilename: `[name].${CSS_FILE_EXT[target] ?? 'wxss'}`,
        ignoreOrder: true,
      }),
      new GojiWebpackPlugin({
        target,
        nohoist,
      }),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(nodeEnv),
        // React Native specific global variable
        // https://reactnative.dev/docs/javascript-environment#specific
        __DEV__: JSON.stringify(nodeEnv !== 'production'),
      }),
      // because Webpack 5 removed `node.*` support, we have to add them back manually
      // from https://github.com/webpack/webpack/blob/3956274f1eada621e105208dcab4608883cdfdb2/lib/WebpackOptionsDefaulter.js#L168-L181
      new webpack.ProvidePlugin({
        process: nodeLibsBrowser.process,
        Buffer: [nodeLibsBrowser.buffer, 'Buffer'],
        // `global` will be shimmed by GojiShimPlugin and `setImmediate` is supported natively
      }),
      // show progress
      progress && new webpack.ProgressPlugin(),
    ].filter(Boolean),
  };
};

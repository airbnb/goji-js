import webpack from 'webpack';
import resolve from 'resolve';
import path from 'path';
import { GojiTarget } from '@goji/core';
import { getWebpackConfig } from './config/webpack.config';
import { parseArgv, CliConfig } from './argv';

interface GojiConfig {
  watch?: boolean;
  outputPath?: string;
  configureWebpack?: (config: webpack.Configuration, webpackInGoji: typeof webpack) => undefined;
  configureBabel?: (config: any) => any;
  progress?: boolean;
  // eslint-disable-next-line camelcase
  unstable_componentWhitelist?: Array<string>;
  // eslint-disable-next-line camelcase
  unsafe_integrationMode?: boolean;
}

const GOJI_CONFIG_FILE_NAME = 'goji.config';
const requireGojiConfig = (basedir: string): GojiConfig => {
  let resolvedPath: string;
  try {
    resolvedPath = resolve.sync(path.join(basedir, GOJI_CONFIG_FILE_NAME));
  } catch (error) {
    console.info(`\`goji.config.js\` not found in folder ${basedir}, using default config.`);
    return {};
  }

  // eslint-disable-next-line global-require, import/no-dynamic-require
  return require(resolvedPath);
};

const getInitialWebpackConfig = ({
  outputPath,
  integrationMode,
  componentWhitelist,
  babelConfig,
}: {
  outputPath?: string;
  integrationMode: boolean;
  componentWhitelist: Array<string> | undefined;
  babelConfig: any;
}) => {
  const basedir = process.env.PWD!;
  const target = (process.env.TARGET || 'wechat') as GojiTarget;
  const nodeEnv = process.env.NODE_ENV || 'development';

  return getWebpackConfig({
    basedir,
    outputPath,
    target,
    nodeEnv,
    babelConfig,
    unsafe_integrationMode: integrationMode,
    unstable_componentWhitelist: componentWhitelist,
  });
};

const main = async () => {
  const basedir = process.env.PWD!;
  let cliConfig: CliConfig;
  try {
    cliConfig = await parseArgv(process.argv.slice(2));
  } catch (error) {
    console.error(error.message);
    return;
  }
  const gojiConfig = requireGojiConfig(basedir);
  // eslint-disable-next-line global-require
  const babelConfig = require('./config/babel.config');
  if (gojiConfig.configureBabel) {
    gojiConfig.configureBabel(babelConfig);
  }
  const webpackConfig = getInitialWebpackConfig({
    outputPath: gojiConfig.outputPath,
    babelConfig,
    integrationMode: gojiConfig.unsafe_integrationMode ?? false,
    componentWhitelist: gojiConfig.unstable_componentWhitelist,
  });

  // apply goji.config.js configureWebpack
  if (gojiConfig.configureWebpack) {
    gojiConfig.configureWebpack(webpackConfig, webpack);
  }

  // watch mode
  const watch = cliConfig.watch ?? gojiConfig.watch ?? !cliConfig.production;
  // must reset `watch` option for correct `compiler.options.watch`
  webpackConfig.watch = watch;

  // show progress
  if (gojiConfig.progress ?? cliConfig.progress ?? true) {
    webpackConfig.plugins!.push(new webpack.ProgressPlugin());
  }

  // create compiler
  const compiler = webpack(webpackConfig);
  const compilerCallback = (err: Error, stats: webpack.Stats) => {
    if (err) {
      console.error(err.stack || err);
      // @ts-ignore
      if (err.details) {
        // @ts-ignore
        console.error(err.details);
      }
      return;
    }
    const outputOptions = webpackConfig.stats;
    const statsString = stats.toString(outputOptions);
    if (statsString) {
      process.stdout.write(`${statsString}\n`);
    }
  };

  if (watch) {
    console.log('Start GojiJS in development mode.');
    compiler.watch(webpackConfig.watchOptions ?? {}, compilerCallback);
  } else {
    console.log('Start GojiJS in production mode.');
    compiler.run(compilerCallback);
  }
};

main().catch(e => console.error(e));

import webpack from 'webpack';
import resolve from 'resolve';
import path from 'path';
import { GojiWebpackPluginOptions } from '@goji/webpack-plugin';
import { getWebpackConfig } from './config/webpack.config';
import { parseArgv, CliConfig } from './argv';
import './utils/fixSerializationWarning';

interface GojiConfig {
  watch?: boolean;
  outputPath?: string;
  configureWebpack?: (config: webpack.Configuration, webpackInGoji: typeof webpack) => undefined;
  configureBabel?: (config: any) => any;
  progress?: boolean;
  nohoist?: GojiWebpackPluginOptions['nohoist'];
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

const main = async () => {
  const basedir = process.cwd();
  let cliConfig: CliConfig;
  try {
    cliConfig = await parseArgv(process.argv.slice(2));
  } catch (error: any) {
    console.error((error as Error).message);
    return;
  }

  // re-patch NODE_ENVs for config files
  process.env.NODE_ENV = cliConfig.production ? 'production' : 'development';
  process.env.GOJI_TARGET = cliConfig.target;

  const gojiConfig = requireGojiConfig(basedir);
  // eslint-disable-next-line global-require
  const babelConfig = require('./config/babel.config');
  if (gojiConfig.configureBabel) {
    gojiConfig.configureBabel(babelConfig);
  }
  // watch mode
  const watch = cliConfig.watch ?? gojiConfig.watch ?? !cliConfig.production;
  const webpackConfig = getWebpackConfig({
    basedir,
    outputPath: gojiConfig.outputPath,
    target: cliConfig.target,
    nodeEnv: cliConfig.production ? 'production' : 'development',
    babelConfig,
    watch,
    progress: gojiConfig.progress ?? cliConfig.progress ?? true,
    nohoist: gojiConfig?.nohoist,
  });

  // apply goji.config.js configureWebpack
  if (gojiConfig.configureWebpack) {
    gojiConfig.configureWebpack(webpackConfig, webpack);
  }

  // create compiler
  const compilerCallback = (err?: Error, stats?: webpack.Stats) => {
    // docs: https://webpack.js.org/api/cli/#exit-codes-and-their-meanings
    // inspired from: https://github.com/webpack/webpack-cli/blob/64deca258e993501c8f2053a8063b6189028caf9/packages/webpack-cli/lib/webpack-cli.js#L2244-L2251
    if (err) {
      console.error(err);
      process.exit(2);
    }
    if (stats?.hasErrors()) {
      process.exitCode = 1;
    }
    const outputOptions = webpackConfig.stats;
    const printedStats = stats!.toString(outputOptions);
    console.log(printedStats);
  };
  if (watch) {
    console.log('Start GojiJS in development mode.');
  } else {
    console.log('Start GojiJS in production mode.');
  }
  webpack(webpackConfig, compilerCallback);
};

main().catch(e => console.error(e));

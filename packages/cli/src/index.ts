import webpack from 'webpack';
import resolve from 'resolve';
import path from 'path';
import { GojiWebpackPluginOptions } from '@goji/webpack-plugin';
import { getWebpackConfig } from './config/webpack.config';
import { parseArgv, CliConfig } from './argv';

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
  } catch (error) {
    console.error(error.message);
    return;
  }
  // re-patch NODE_ENV for `babel.config.ts`
  process.env.NODE_ENV = cliConfig.production ? 'production' : 'development';
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

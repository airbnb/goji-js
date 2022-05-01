/* eslint-disable import/no-import-module-exports */
import webpack from 'webpack';
import babelLoader from 'babel-loader';

// inspired from https://github.com/kentcdodds/babel-plugin-macros/blob/18d79d3ac3c2975565e7897d2233cf498f15ffb5/src/index.js#L5
const macrosRegex = /[./]macro(\.c?js)?['"]/;
const testMacrosRegex = v => macrosRegex.test(v);

/**
 * this loader is designed to for these reasons:
 * 1. only load `babel-loader` and `babel-plugin-macros` if source code contains a macro dependency
 * 2. disable Webpack cache to trigger macro compilation on every build
 */
const FixBabelLoaderForMacro: webpack.LoaderDefinition<{}> = function FixBabelLoaderForMacro(
  source,
  inputSourceMap,
) {
  if (testMacrosRegex(source.toString())) {
    // disable cache to prevent missing call of `registerPluginComponent`
    if (this.cacheable) {
      this.cacheable(false);
    }
    babelLoader.call(this, source, inputSourceMap);
    return;
  }

  const callback = this.async();
  callback!(null, source);
};

module.exports = FixBabelLoaderForMacro;

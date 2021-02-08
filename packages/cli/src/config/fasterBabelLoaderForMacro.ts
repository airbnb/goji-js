import { loader } from 'webpack';
import babelLoader from 'babel-loader';
import { RawSourceMap } from 'source-map';

// inspired from https://github.com/kentcdodds/babel-plugin-macros/blob/18d79d3ac3c2975565e7897d2233cf498f15ffb5/src/index.js#L5
const macrosRegex = /[./]macro(\.c?js)?['"]/;
const testMacrosRegex = v => macrosRegex.test(v);

/**
 * this loader is designed to only support `babel-plugin-macros`, don't use any other plugins
 */
module.exports = function GojiTransformLoader(
  this: loader.LoaderContext,
  source: string | Buffer,
  inputSourceMap: RawSourceMap,
) {
  const callback = this.async();
  if (this.cacheable) {
    this.cacheable();
  }

  if (testMacrosRegex(source.toString())) {
    babelLoader.call(this, source, inputSourceMap);
    return;
  }

  callback!(null, source);
};

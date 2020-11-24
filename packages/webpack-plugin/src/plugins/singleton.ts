import webpack, { Template } from 'webpack';
import { GojiBasedWebpackPlugin } from './based';

const SOURCE_NAME = '';

/**
 * this plugin is designed to support multi `runtime.js` in mini program.
 * there are several cases result in multi runtime:
 * 1. In WeChat dev tool a bug which run chunk/module inside independent sub-package twice cause multi runtime.
 * 1. to support independent sub-packages Goji CLI will copy all necessary chunks into the
 *  sub-package with different path. for example `runtime.js` and `independent-test/runtime.js`
 * 2. in Alipay sub-packages, the dev tool auto copy the chunks into the sub-package and this bug ( feature )
 *   can only reproduce on physical devices rather than dev tool simulator.
 * this plugin hacks the `runtime.js` to ensure there is always a singleton of runtime context
 */
export class GojiSingletonRuntimeWebpackPlugin extends GojiBasedWebpackPlugin {
  public apply(compiler: webpack.Compiler) {
    // `Compiler.hooks.compilation` is not suitable because it runs for both parent and child compilers
    compiler.hooks.thisCompilation.tap('GojiSingletonRuntimeWebpackPlugin', compilation => {
      // hack the `__webpack_module_cache__` as a global variable so each module would only run once
      webpack.javascript.JavascriptModulesPlugin.getCompilationHooks(compilation).renderMain.tap(
        'GojiSingletonRuntimeWebpackPlugin',
        (source, context) => {
          if (!context.chunk.name.endsWith('runtime')) {
            return source;
          }
          const { globalObject } = compilation.outputOptions;
          const sourceString = source.source().toString();
          const output = new webpack.sources.ReplaceSource(source, SOURCE_NAME);
          const ORIGINAL_CODE = 'var __webpack_module_cache__ = {};';
          const findPosition = sourceString.indexOf(ORIGINAL_CODE);
          output.replace(
            findPosition,
            findPosition + ORIGINAL_CODE.length,
            Template.prefix(
              Template.asString([
                `if (!${globalObject}.__gojiWebpackModuleCache) {`,
                Template.indent([
                  `Object.defineProperty(${globalObject}, '__gojiWebpackModuleCache', {`,
                  Template.indent(['enumerable: false,', 'value: {}']),
                  '});',
                ]),
                '}',
                `var __webpack_module_cache__ = ${globalObject}.__gojiWebpackModuleCache;`,
              ]),
              '/*goji*/ ',
            ),
            SOURCE_NAME,
          );
          return new webpack.sources.RawSource(output.source(), false);
        },
      );

      // wrap all code with `Object.__gojiWebpackModuleCache` check to ensure this file only run once
      webpack.javascript.JavascriptModulesPlugin.getCompilationHooks(compilation).renderMain.tap(
        'GojiFixIndependentRuntimePlugin',
        (source, context) => {
          if (!context.chunk.name.endsWith('runtime')) {
            return source;
          }

          const { globalObject } = compilation.mainTemplate.outputOptions;

          const output = new webpack.sources.ConcatSource();
          output.add(
            new webpack.sources.PrefixSource(
              '/*goji*/ ',
              Template.asString([
                `var _chunkPath = ${JSON.stringify(context.chunk.name)};`,
                `if (!${globalObject}.__gojiFixIndependentRuntime) {`,
                Template.indent([
                  `Object.defineProperty(${globalObject}, '__gojiFixIndependentRuntime', {`,
                  Template.indent(['enumerable: false,', 'value: {}']),
                  '});',
                ]),
                '}',
                `if (!${globalObject}.__gojiFixIndependentRuntime[_chunkPath]) {`,
                '',
              ]),
            ),
          );
          output.add(source);
          output.add(
            new webpack.sources.PrefixSource(
              '/*goji*/ ',
              Template.asString([
                '',
                '}',
                `${globalObject}.__gojiFixIndependentRuntime[_chunkPath] = true;`,
              ]),
            ),
          );
          return new webpack.sources.RawSource(output.source(), false);
        },
      );
    });
  }
}

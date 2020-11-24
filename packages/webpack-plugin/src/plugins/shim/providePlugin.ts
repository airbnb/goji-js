/**
 * FIXME:
 * This file is copied from https://github.com/webpack/webpack/blob/master/lib/ProvidePlugin.js and
 *  inspired from https://github.com/webpack/webpack/pull/9420
 * This file is aimed to enable `exclude` options for ProvidePlugin
 * Usages:
 *   new ProvidePlugin({ variableName: { module: './path/to/module, exclude: 'path_string' }})
 *   new ProvidePlugin({ variableName: { module: ['./path/to/module', 'propertyName'], exclude: /path_string/ }})
 */

/* eslint-disable */
/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

const ConstDependency = require('webpack/lib/dependencies/ConstDependency');
const ProvidedDependency = require('webpack/lib/dependencies/ProvidedDependency');
const { approve } = require('webpack/lib/javascript/JavascriptParserHelpers');

/** @typedef {import("./Compiler")} Compiler */

class PatchedProvidePlugin {
  /**
   * @param {Record<string, string | string[]>} definitions the provided identifiers
   */
  constructor(definitions) {
    // @ts-ignore
    this.definitions = definitions;
  }

  /**
   * Apply the plugin
   * @param {Compiler} compiler the compiler instance
   * @returns {void}
   */
  apply(compiler) {
    // @ts-ignore
    const definitions = this.definitions;
    compiler.hooks.compilation.tap('ProvidePlugin', (compilation, { normalModuleFactory }) => {
      compilation.dependencyTemplates.set(ConstDependency, new ConstDependency.Template());
      compilation.dependencyFactories.set(ProvidedDependency, normalModuleFactory);
      compilation.dependencyTemplates.set(ProvidedDependency, new ProvidedDependency.Template());
      const handler = (parser, parserOptions) => {
        Object.keys(definitions).forEach(name => {
          /* patch start */
          // Support `exclude` option
          let provideFile = definitions[name];
          // @ts-ignore
          let excludeFiles = [];
          if (
            !Array.isArray(provideFile) &&
            provideFile !== null &&
            typeof provideFile === 'object'
          ) {
            if (
              typeof definitions[name].exclude === 'string' ||
              Array.isArray(definitions[name].exclude)
            ) {
              excludeFiles = [].concat(definitions[name].exclude);
            }
            provideFile = provideFile.module;
          }
          // var request = [].concat(definitions[name]);
          const request = [].concat(provideFile);
          /* patch end */
          const splittedName = name.split('.');
          if (splittedName.length > 0) {
            splittedName.slice(1).forEach((_, i) => {
              const name = splittedName.slice(0, i + 1).join('.');
              parser.hooks.canRename.for(name).tap('ProvidePlugin', approve);
            });
          }

          parser.hooks.expression.for(name).tap('ProvidePlugin', expr => {
            /* patch start */
            // exclude files
            const currentFile = parser.state.current.request;
            // @ts-ignore
            for (let i in excludeFiles) {
              // @ts-ignore
              if (currentFile.match(excludeFiles[i])) {
                return false;
              }
            }
            /* patch start */

            const nameIdentifier = name.includes('.')
              ? `__webpack_provided_${name.replace(/\./g, '_dot_')}`
              : name;
            const dep = new ProvidedDependency(
              request[0],
              nameIdentifier,
              request.slice(1),
              expr.range,
            );
            dep.loc = expr.loc;
            parser.state.module.addDependency(dep);
            return true;
          });
        });
      };
      normalModuleFactory.hooks.parser.for('javascript/auto').tap('ProvidePlugin', handler);
      normalModuleFactory.hooks.parser.for('javascript/dynamic').tap('ProvidePlugin', handler);
      normalModuleFactory.hooks.parser.for('javascript/esm').tap('ProvidePlugin', handler);
    });
  }
}

export { PatchedProvidePlugin };

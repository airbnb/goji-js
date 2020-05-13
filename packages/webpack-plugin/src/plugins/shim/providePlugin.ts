/**
 * FIXME:
 * this file is copied from https://github.com/webpack/webpack/pull/9420 and rebased with `webpack-4`
 * to enable `exclude` options for ProvidePlugin
 * usage:
 *   new ProvidePlugin({ variableName: { module: './path/to/module, exclude: 'path_string' }})
 *   new ProvidePlugin({ variableName: { module: ['./path/to/module', 'propertyName'], exclude: /path_string/ }})
 */

/* eslint-disable */
const ParserHelpers = require('webpack/lib/ParserHelpers');
const ConstDependency = require('webpack/lib/dependencies/ConstDependency');

const NullFactory = require('webpack/lib/NullFactory');

export class PatchedProvidePlugin {
  // @ts-ignore
  constructor(definitions) {
    // @ts-ignore
    this.definitions = definitions;
  }

  // @ts-ignore
  apply(compiler) {
    // @ts-ignore
    const definitions = this.definitions;
    // @ts-ignore
    compiler.hooks.compilation.tap('ProvidePlugin', (compilation, { normalModuleFactory }) => {
      compilation.dependencyFactories.set(ConstDependency, new NullFactory());
      compilation.dependencyTemplates.set(ConstDependency, new ConstDependency.Template());
      // @ts-ignore
      const handler = (parser, parserOptions) => {
        Object.keys(definitions).forEach(name => {
          // Support ignore file
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

          var request = [].concat(provideFile);

          var splittedName = name.split('.');
          if (splittedName.length > 0) {
            splittedName.slice(1).forEach((_, i) => {
              const name = splittedName.slice(0, i + 1).join('.');
              parser.hooks.canRename.for(name).tap('ProvidePlugin', ParserHelpers.approve);
            });
          }
          // @ts-ignore
          parser.hooks.expression.for(name).tap('ProvidePlugin', expr => {
            // exclude files
            const currentFile = parser.state.current.request;
            // @ts-ignore
            for (let i in excludeFiles) {
              // @ts-ignore
              if (currentFile.match(excludeFiles[i])) {
                return false;
              }
            }

            let nameIdentifier = name;
            const scopedName = name.includes('.');
            let expression = `require(${JSON.stringify(request[0])})`;
            if (scopedName) {
              nameIdentifier = `__webpack_provided_${name.replace(/\./g, '_dot_')}`;
            }
            if (request.length > 1) {
              expression += request
                .slice(1)
                .map(r => `[${JSON.stringify(r)}]`)
                .join('');
            }
            if (!ParserHelpers.addParsedVariableToModule(parser, nameIdentifier, expression)) {
              return false;
            }
            if (scopedName) {
              ParserHelpers.toConstantDependency(parser, nameIdentifier)(expr);
            }
            return true;
          });
        });
      };
      normalModuleFactory.hooks.parser.for('javascript/auto').tap('ProvidePlugin', handler);
      normalModuleFactory.hooks.parser.for('javascript/dynamic').tap('ProvidePlugin', handler);

      // Disable ProvidePlugin for javascript/esm, see https://github.com/webpack/webpack/issues/7032
    });
  }
}

import webpack from 'webpack';
import path from 'path';
import escapeStringRegexp from 'escape-string-regexp';
import { GojiBasedWebpackPlugin } from '../based';
import { PatchedProvidePlugin as ProvidePlugin } from '../../forked/providePlugin';
import * as meta from './meta';
import { getApiVariableDefinitions } from './variable';

export class GojiShimPlugin extends GojiBasedWebpackPlugin {
  public apply(compiler: webpack.Compiler) {
    const provides: Record<
      string,
      | string
      | [string, string]
      | { module: string | [string, string]; exclude?: string | RegExp | Array<string | RegExp> }
    > = {};
    const definitions: Record<string, string> = {};
    const patchGlobalVariable = (
      variableName: string,
      moduleName: string,
      propertyName: string | undefined,
      isUndefined: boolean,
    ) => {
      if (isUndefined) {
        // use DefinePlugin for less bundle size
        definitions[variableName] = 'undefined';
      } else {
        provides[variableName] = {
          module: propertyName
            ? [require.resolve(moduleName), propertyName]
            : require.resolve(moduleName),
          // this is not a standard usage so I forked the `ProvidePlugin`
          exclude: [
            // exclude all patches
            new RegExp(escapeStringRegexp(path.join(__dirname, 'patches'))),
          ],
        };
      }
    };

    // patch global variables like `globalThis`, `self`, `global`
    // `Function('return this')` will be patched in `patches/function`
    // ref: https://github.com/zloirock/core-js/blob/76d9bf50b1b15439366af92885c5a7a1d0ad61c6/packages/core-js/internals/global.js
    patchGlobalVariable('globalThis', path.resolve(__dirname, './global'), undefined, false);
    patchGlobalVariable('self', path.resolve(__dirname, './global'), undefined, false);
    patchGlobalVariable('global', path.resolve(__dirname, './global'), undefined, false);

    // patch each global variables
    for (const variableName of meta.patchedVariables) {
      patchGlobalVariable(variableName, path.resolve(__dirname, './patches'), variableName, false);
    }
    for (const variableName of meta.undefinedVariables) {
      patchGlobalVariable(variableName, path.resolve(__dirname, './patches'), variableName, true);
    }

    new ProvidePlugin(provides).apply(compiler);
    new webpack.DefinePlugin({
      ...definitions,
      ...getApiVariableDefinitions(this.options.target),
    }).apply(compiler);
  }
}

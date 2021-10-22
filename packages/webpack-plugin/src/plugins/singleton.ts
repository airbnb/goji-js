import webpack from 'webpack';
import { RUNTIME_FILE_NAME } from '../constants/paths';
import { GojiBasedWebpackPlugin } from './based';

/**
 * this plugin is designed to support multi `_goji_runtime.js` in mini program.
 * there are several cases caused multi runtime:
 * 1. independent sub-packages, webpack will copy all necessary chunks into the sub-package.
 * 2. Alipay sub-packages, Alipay auto copy the chunks into the sub-package and this bug(feature)
 *   can only reproduce on physical devices rather than dev tool simulator.
 * this plugin hacks the `_goji_runtime.js` to ensure there is always a singleton local variables, including
 *  the most important `installedChunks`.
 */
export class GojiSingletonRuntimeWebpackPlugin extends GojiBasedWebpackPlugin {
  public apply(compiler: webpack.Compiler) {
    // use `make` for these reasons:
    // 1. should patch `compilation.mainTemplate.hooks.localVars` after `hooks.thisCompilation`
    // 2. `hooks.compilation` is not suitable because it runs for both parent and child compilers
    // 3. Runtime source is generated during `compilation.seal`
    compiler.hooks.make.tap('GojiSingletonRuntimeWebpackPlugin', compilation => {
      // TODO: this hook would be deprecated in webpack@5 and removed in webpack@6
      // https://github.com/webpack/webpack/pull/9784/commits/69a545c4444d881c87e6462ea6da707f7793fc93
      // no documentation for this internal hook
      // https://github.com/webpack/webpack/blob/6b6342e94be36b09342b69938fbcd4d1f18c0f8b/lib/web/JsonpMainTemplatePlugin.js#L102
      compilation.mainTemplate.hooks.localVars.tap(
        'GojiSingletonRuntimeWebpackPlugin',
        (source, chunk) => {
          if (!chunk.name.endsWith(RUNTIME_FILE_NAME)) {
            return source;
          }
          const { globalObject } = compilation.mainTemplate.outputOptions;
          // FIXME: should refactor with Babel and add test cases
          return (
            // eslint-disable-next-line prefer-template
            source.replace(
              /var installedChunks = /,
              `// these lines hacked by GojiSingletonRuntimeWebpackPlugin
              var initialed = Boolean(${globalObject}.__gojiInstalledChunks);
              if (!initialed) {
                Object.defineProperty(${globalObject}, '__gojiInstalledChunks', {
                  enumerable: false,
                  value: {}
                });
              }
              var installedChunks = ${globalObject}.__gojiInstalledChunks;
              var newInstalledChunks = `,
            ) +
            '\n' +
            `for (var key in newInstalledChunks) {
              installedChunks[key] = newInstalledChunks[key];
            }
            if (initialed) {
              return;
            }
            // hacked end`
          );
        },
      );
    });
  }
}

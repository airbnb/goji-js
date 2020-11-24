import enhancedResolve from 'enhanced-resolve';
import Module from 'module';
import webpack from 'webpack';
import { GojiTarget } from '@goji/core';
import { safeUrlToRequest } from './path';

// from https://github.com/webpack/webpack.js.org/issues/1268#issuecomment-313513988
export const exec = (code: string, filename: string, context: string) => {
  /* eslint-disable no-underscore-dangle */
  const module = new Module(filename, undefined);
  // @ts-ignore
  module.paths = Module._nodeModulePaths(context);
  module.filename = filename;
  // @ts-ignore
  module._compile(code, filename);

  return module.exports;
  /* eslint-enable no-underscore-dangle */
};

export const resolveConfigPath = (
  entrypoint: string,
  context: string,
  extensions: Array<string> = ['.js'],
) =>
  new Promise<string | undefined>(resolvePromise => {
    const configResolver = enhancedResolve.create({
      extensions: ['.json', ...extensions.map(ext => `.config${ext}`)],
    });
    configResolver(context, safeUrlToRequest(entrypoint), (err, resolved) => {
      if (err) {
        // no config file found
        resolvePromise(undefined);
        return;
      }
      resolvePromise(resolved);
    });
  });

const CHILD_FILENAME = 'GojiConfigFilename';

export const loadConfigSourceByChildCompiler = async (
  configPath: string,
  context: string,
  parentCompilation: webpack.Compilation,
) =>
  // load `.config.js` file by child compiler
  new Promise<string>((resolvePromise, rejectPromise) => {
    // @ts-ignore
    const configCompiler: webpack.compiler.Compiler = parentCompilation.createChildCompiler(
      'GojiConfigCompiler',
      {
        filename: CHILD_FILENAME,
        publicPath: '/',
        library: { type: 'commonjs2' },
      },
      [
        // add `.config.js` as entry
        // @ts-ignore
        new webpack.EntryPlugin(context, configPath, 'GojiConfigEntry'),
        // should export commonjs2 bundle
        // @ts-ignore
        new webpack.library.EnableLibraryPlugin('commonjs2'),
      ],
    );
    configCompiler.hooks.thisCompilation.tap('GojiConfigPlugin', compilation => {
      compilation.hooks.processAssets.tap('GojiConfigPlugin', () => {
        // resolve source code before remove it
        resolvePromise(compilation.assets[CHILD_FILENAME].source());

        // remove all chunk assets before emit
        compilation.chunks.forEach(chunk => {
          chunk.files.forEach(file => {
            delete compilation.assets[file]; // eslint-disable-line no-param-reassign
          });
        });
      });
    });
    // @ts-ignore
    configCompiler.runAsChild(err => {
      if (err) {
        rejectPromise(err);
      }
    });
  });

const getDefaultExport = (exportsObject: any) =>
  // eslint-disable-next-line no-underscore-dangle
  exportsObject.__esModule ? exportsObject.default : exportsObject;

export const evalConfigSource = (
  configInputPath: string,
  configSource: string,
  target: GojiTarget,
): object => {
  try {
    const jsConetent = exec(configSource, 'GojiVM/file', 'GojiVM');
    // support both `module.exports` and `export default`
    let defaultObject = getDefaultExport(jsConetent);
    if (typeof defaultObject === 'function') {
      defaultObject = defaultObject({ target });
    }
    if (process.env.PAGE_FILTER_REGEX && defaultObject?.subPackages) {
      const pageFilterRegexp = new RegExp(process.env.PAGE_FILTER_REGEX);
      const { subPackages = [] } = defaultObject;
      subPackages.forEach(subPackage => {
        subPackage.pages = (subPackage.pages || []).filter(page => pageFilterRegexp.test(`${subPackage.root}/${page}`));
      });
      defaultObject.subPackages = defaultObject.subPackages.filter(subPackage => !!subPackage?.pages?.length);
    }
    return defaultObject;
  } catch (e) {
    if (
      e.name === 'TypeError' &&
      e.message === `Cannot assign to read only property 'exports' of object '#<Object>'`
    ) {
      throw new TypeError(
        `${e.message}\n\tUsually it's because you cannot mix \`import\` and \`module.exports\` in ${configInputPath}\n\tFor more details see https://github.com/webpack/webpack/issues/4039#issuecomment-273804003`,
      );
    }
    throw e;
  }
};

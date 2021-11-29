import webpack from 'webpack';
import path from 'path';
import { GojiWebpackPluginRequiredOptions } from '../types';
import { transformExtension } from '../utils/transformExtension';
import { replaceExtPosix } from '../utils/path';

export abstract class GojiBasedWebpackPlugin implements webpack.WebpackPluginInstance {
  public constructor(protected options: GojiWebpackPluginRequiredOptions) {}

  public abstract apply(compiler: webpack.Compiler): void;

  protected transformExt(extension: string) {
    return transformExtension({
      extension,
      miniProgramTarget: this.options.target,
    });
  }

  protected transformExtForPath(pathname: string) {
    const ext = path.posix.extname(pathname);
    return replaceExtPosix(pathname, this.transformExt(ext));
  }

  protected isJsExt(ext: string) {
    return this.transformExt('.js') === ext;
  }

  protected isCssExt(ext: string) {
    return this.transformExt('.wxss') === ext;
  }
}

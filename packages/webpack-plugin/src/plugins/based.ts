import webpack from 'webpack';
import path from 'path';
import replaceExt from 'replace-ext';
import { GojiWebpackPluginOptions } from '../types';
import { transformExtension } from '../utils/transformExtension';

export abstract class GojiBasedWebpackPlugin implements webpack.WebpackPluginInstance {
  public constructor(protected options: GojiWebpackPluginOptions) {}

  public abstract apply(compiler: webpack.Compiler): void;

  protected transformExt(extension: string) {
    return transformExtension({
      extension,
      // use WeChat extensions in integration mode
      miniProgramTarget: this.options.unsafe_integrationMode ? 'wechat' : this.options.target,
    });
  }

  protected transformExtForPath(pathname: string) {
    const ext = path.extname(pathname);
    return replaceExt(pathname, this.transformExt(ext));
  }

  protected isJsExt(ext: string) {
    return this.transformExt('.js') === ext;
  }

  protected isCssExt(ext: string) {
    return this.transformExt('.wxss') === ext;
  }
}

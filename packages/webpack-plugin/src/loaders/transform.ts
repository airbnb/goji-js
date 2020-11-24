import loaderUtils from 'loader-utils';
import { GojiTarget } from '@goji/core';
import { transformTemplate } from '../utils/render';
import { WebpackLoaderContext } from '../types/patch';

interface TransformLoaderOptions {
  target?: GojiTarget;
  type?: string;
}

module.exports = async function GojiTransformLoader(
  this: WebpackLoaderContext,
  source: string | Buffer,
) {
  if (this.cacheable) {
    this.cacheable();
  }
  const callback = this.async();
  const options: TransformLoaderOptions = loaderUtils.getOptions(this);
  const { target = process.env.GOJI_TARGET as GojiTarget, type } = options;
  if (!target) {
    throw new Error("loader's query param `target` expected but not found");
  }
  if (!type) {
    throw new Error("loader's query param `type` expected but not found");
  }

  const output = await transformTemplate(source.toString(), target, type);
  callback!(null, output);
};

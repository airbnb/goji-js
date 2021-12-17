/* eslint-disable import/no-import-module-exports */
// this plugin is inspired from https://github.com/yingye/postcss-px2units
// and refactored to support PostCSS 8
import type { PluginCreator } from 'postcss';

interface Options {
  divisor: number;
  multiple: number;
  decimalPlaces: number;
  targetUnits: string;
  comment: string;
}

const DEFAULT_OPTIONS: Options = {
  divisor: 1,
  multiple: 1,
  decimalPlaces: 2,
  targetUnits: 'rpx',
  comment: 'no',
};

const postcssPx2units: PluginCreator<Partial<Options>> = (options = {}) => {
  const mergedOptions = { ...DEFAULT_OPTIONS, ...options };

  const replacePx = (str: string) => {
    if (!str) {
      return '';
    }

    return str.replace(/\b(\d+(\.\d+)?)px\b/gi, (match, x) => {
      const size = (x * mergedOptions.multiple) / mergedOptions.divisor;
      return size % 1 === 0
        ? size + mergedOptions.targetUnits
        : size.toFixed(mergedOptions.decimalPlaces) + mergedOptions.targetUnits;
    });
  };

  return {
    postcssPlugin: 'postcss-px2units',
    Declaration(declaration) {
      const nextNode = declaration.next();
      if (nextNode?.type === 'comment' && nextNode.text === mergedOptions.comment) {
        nextNode.remove();
      } else {
        declaration.value = replacePx(declaration.value);
      }
    },
  };
};

postcssPx2units.postcss = true;

module.exports = postcssPx2units;

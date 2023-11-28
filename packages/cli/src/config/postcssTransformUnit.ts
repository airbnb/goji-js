/* eslint-disable import/no-import-module-exports */
// this plugin is inspired from https://github.com/yingye/postcss-px2units
// and refactored to support PostCSS 8
import type { PluginCreator } from 'postcss';

interface Options {
  divisor: number;
  multiple: number;
  decimalPlaces: number;
  sourceUnit: string;
  targetUnit: string;
  comment: string;
}

const DEFAULT_OPTIONS: Options = {
  divisor: 1,
  multiple: 1,
  decimalPlaces: 2,
  sourceUnit: 'px',
  targetUnit: 'rpx',
  comment: 'no',
};

const postcssTransformUnit: PluginCreator<Partial<Options>> = (options = {}) => {
  const mergedOptions = { ...DEFAULT_OPTIONS, ...options };

  const replacePx = (str: string) => {
    if (!str) {
      return '';
    }

    return str.replace(
      new RegExp(`\\b(\\d+(\\.\\d+)?)${mergedOptions.sourceUnit}\\b`, 'g'),
      (_match, x) => {
        const size = (x * mergedOptions.multiple) / mergedOptions.divisor;
        return size % 1 === 0
          ? size + mergedOptions.targetUnit
          : size.toFixed(mergedOptions.decimalPlaces) + mergedOptions.targetUnit;
      },
    );
  };

  return {
    postcssPlugin: 'postcss-transform-unit',
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

postcssTransformUnit.postcss = true;

module.exports = postcssTransformUnit;

/* eslint-disable global-require */

export type TransformUnit = 'keep' | 'to-px' | 'to-rpx';

const getTransformUnitsPlugin = (unit: TransformUnit) => {
  switch (unit) {
    case 'keep':
      return [];
    case 'to-px':
      // use this plugin because some plugins, like postcss-calc, don't support `rpx` unit
      return [
        require('./postcssTransformUnit')({
          divisor: 2,
          multiple: 1,
          sourceUnit: 'rpx',
          targetUnit: 'px',
        }),
      ];
    case 'to-rpx':
      return [
        require('./postcssTransformUnit')({
          divisor: 1,
          multiple: 2,
          sourceUnit: 'px',
          targetUnit: 'rpx',
        }),
      ];
    default:
      throw new Error(`Unknown unit ${unit}`);
  }
};

// to improve PostCSS performance, we should always use `require(name)(options)` rather than `[name, options]`
// also we should set `postcssOptions.config` to `false` to avoid loading any `postcss.config.js`
// TODO: hope PostCSS could fix this issue https://github.com/csstools/postcss-preset-env/issues/232#issuecomment-992263741
export default ({ unit }: { unit: TransformUnit }) => {
  const transformUnitPlugin = getTransformUnitsPlugin(unit);

  return {
    plugins: [
      require('postcss-each')(),
      // TODO: `postcss-nesting` from `postcss-preset-env` output `:is` pseudo-class that Mini Programs don't support.
      // We have to use `postcss-nested` manually before them to prevent `:is` being created.
      require('postcss-nested')(),
      require('postcss-preset-env')({
        stage: 0,
        preserve: false,
        insertAfter: {
          // postcss-calc must run before autoprefixer
          'environment-variables': require('postcss-calc')(),
        },
      }),
      ...transformUnitPlugin,
      require('cssnano')({ preset: 'default' }),
      require('postcss-reporter')({ clearReportedMessages: true }),
    ],
  };
};

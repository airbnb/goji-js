/* eslint-disable global-require */

// to improve PostCSS performance, we should always use `require(name)(options)` rather than `[name, options]`
// also we should set `postcssOptions.config` to `false` to avoid loading any `postcss.config.js`
// TODO: hope PostCSS could fix this issue https://github.com/csstools/postcss-preset-env/issues/232#issuecomment-992263741
export default {
  plugins: [
    require('postcss-each')(),
    // TODO: `postcss-nesting` from `postcss-preset-env` output `:is` pseudo-class that
    // Mini Programs don't support.
    // We have to `postcss-nested` manually before them to prevent `:is` being created.
    require('postcss-nested'),
    require('postcss-preset-env')({
      stage: 0,
      preserve: false, // for reducing file size
      insertAfter: {
        // postcss-calc must run before autoprefixer
        'environment-variables': require('postcss-calc')(),
      },
    }),
    // use postcss-px2units because some plugins, like postcss-calc, don't support `rpx` unit
    require('./postcssPx2units')({
      multiple: 2,
      targetUnits: 'rpx',
    }),
    require('cssnano')({ preset: 'default' }),
    require('postcss-reporter')({ clearReportedMessages: true }),
  ],
};

/* eslint-disable global-require */
module.exports = () => ({
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
    require('postcss-px2units')({
      multiple: 2,
      targetUnits: 'rpx',
    }),
    require('cssnano')({ preset: 'default' }),
    require('postcss-reporter')({ clearReportedMessages: true }),
  ],
});

/* eslint-disable global-require */
module.exports = ({ options }: { options: { integrationMode?: boolean } }) => {
  const { integrationMode = false } = options;

  return {
    plugins: [
      require('postcss-each')(),
      require('postcss-preset-env')({
        stage: 0,
        preserve: false, // for reducing file size
        features: {
          'color-mod-function': {
            unresolved: 'warn',
          },
        },
        insertAfter: {
          // postcss-calc must run before autoprefixer
          'environment-variables': require('postcss-calc')(),
        },
      }),
      require('postcss-nested'),
      // use postcss-px2units because some plugins, like postcss-calc, don't support `rpx` unit
      !integrationMode &&
        require('postcss-px2units')({
          multiple: 2,
          targetUnits: 'rpx',
        }),
      !integrationMode && require('postcss-clean')({}),
      require('postcss-reporter')(),
    ].filter(Boolean),
  };
};

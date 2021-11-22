const nodeEnv = process.env.NODE_ENV || 'development';

const BABEL_PRESET_TARGETS = {
  // wechat dev tools use Chrome 60.0.3112.113
  // see `/Applications/wechatwebdevtools.app/Contents/Versions`
  development: {
    browsers: 'Chrome >= 60',
  },
  // use .browserslistrc in prod mode
  production: undefined,
  test: {
    node: '10',
  },
};

const BABEL_MODULES = {
  development: false,
  production: false,
  test: 'commonjs',
};

module.exports = {
  assumptions: {
    noDocumentAll: true,
    noClassCalls: true,
  },
  presets: [
    [
      require.resolve('@babel/preset-env'),
      {
        modules: BABEL_MODULES[nodeEnv],
        targets: BABEL_PRESET_TARGETS[nodeEnv],
        useBuiltIns: 'entry',
        corejs: 3,
      },
    ],
    require.resolve('@babel/preset-typescript'),
    require.resolve('@babel/preset-react'),
    require.resolve('linaria/babel'),
  ],
  plugins: [require.resolve('@babel/plugin-transform-runtime')],
  // https://github.com/webpack/webpack/issues/4039#issuecomment-419284940
  // https://babeljs.io/docs/en/options#sourcetype
  // https://github.com/babel/babel/issues/8900
  sourceType: 'unambiguous',
};

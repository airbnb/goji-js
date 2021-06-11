import { BabelConfig } from '@beemo/driver-babel';

const config: BabelConfig = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current',
        },
        useBuiltIns: 'entry',
        corejs: 3,
      },
    ],
    '@babel/preset-typescript',
    '@babel/preset-react',
    'linaria/babel',
  ],
  plugins: [
    ['@babel/plugin-transform-runtime', { useESModules: true }],
    ['@babel/plugin-proposal-optional-chaining', { loose: true }],
    ['@babel/plugin-proposal-nullish-coalescing-operator', { loose: true }],
  ],
  // https://github.com/webpack/webpack/issues/4039#issuecomment-419284940
  // https://babeljs.io/docs/en/options#sourcetype
  // https://github.com/babel/babel/issues/8900
  sourceType: 'unambiguous',
};

export default config;

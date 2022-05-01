import { BabelConfig } from '@beemo/driver-babel';

const config: BabelConfig & { assumptions: Record<string, boolean> } = {
  assumptions: {
    noDocumentAll: true,
    noClassCalls: true,
  },
  presets: [
    [
      require.resolve('@babel/preset-env'),
      {
        targets: {
          node: 'current',
        },
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

export default config;

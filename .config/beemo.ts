import { BeemoConfig } from '@beemo/core';

const config: BeemoConfig = {
  module: '@goji/beemo-dev',
  drivers: {
    eslint: {
      args: ['--color', '--ext', '.js,.ts,.jsx,.tsx'],
    },
    prettier: true,
    lerna: true,
    babel: true,
    jest: true,
  },
};

export default config;

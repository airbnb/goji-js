import type { BeemoConfig } from '@beemo/core';
import path from 'path';

const config: BeemoConfig = {
  module: path.join(__dirname, '../packages/beemo-dev'),
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

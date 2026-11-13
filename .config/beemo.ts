import type { BeemoConfig } from '@beemo/core';

const config: BeemoConfig = {
  module: '@goji/beemo-dev',
  drivers: {
    prettier: true,
    lerna: true,
    babel: true,
  },
};

export default config;

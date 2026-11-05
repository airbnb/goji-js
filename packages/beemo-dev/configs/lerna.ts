import type { LernaConfig } from '@beemo/driver-lerna';

const config: LernaConfig = {
  packages: ['packages/*'],
  npmClient: 'yarn',
  version: '1.5.0',
};

export default config;

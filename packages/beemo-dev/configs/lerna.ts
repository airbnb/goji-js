import { LernaConfig } from '@beemo/driver-lerna';

const config: LernaConfig = {
  packages: ['packages/*'],
  npmClient: 'yarn',
  version: '1.4.0',
};

export default config;

import { LernaConfig } from '@beemo/driver-lerna';

const config: LernaConfig = {
  packages: ['packages/*', 'packages/goji.js.org/*'],
  npmClient: 'yarn',
  useWorkspaces: true,
  version: '1.0.0-alpha.16',
};

export default config;

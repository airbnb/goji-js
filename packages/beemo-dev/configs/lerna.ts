import { LernaConfig } from '@beemo/driver-lerna';

const config: LernaConfig = {
  packages: ['packages/*', 'packages/goji.js.org/*'],
  npmClient: 'yarn',
  useWorkspaces: true,
  version: '1.0.1',
};

export default config;

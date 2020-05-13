import { GojiTarget } from '@goji/core';

export interface GojiWebpackPluginOptions {
  maxDepth: number;
  target: GojiTarget;
  minimize: boolean;
  // `unsafe_integrationMode` is used for bundle GojiJS within Mina project
  // we should remove it after GojiJS fully migrated
  // eslint-disable-next-line camelcase
  unsafe_integrationMode?: boolean;
  // eslint-disable-next-line camelcase
  unstable_componentWhitelist?: Array<string>;
}

export interface AppSubpackage {
  root?: string;
  pages?: Array<string>;
  independent?: boolean;
}

export interface AppConfig {
  pages?: Array<string>;
  subpackages?: Array<AppSubpackage>;
  subPackages?: Array<AppSubpackage>;
}

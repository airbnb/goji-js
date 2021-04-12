import { GojiTarget } from '@goji/core';

export interface GojiWebpackPluginOptions {
  maxDepth: number;
  target: GojiTarget;
  minimize: boolean;
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

import type { GojiTarget } from '@goji/core';
import webpack from 'webpack';

/**
 * This interface is used for internal plugins
 */
export interface GojiWebpackPluginRequiredOptions {
  target: GojiTarget;
  maxDepth: number;
  minimize: boolean;
  nohoist: {
    enable: boolean;
    maxPackages: number;
    test?:
      | string
      | RegExp
      | ((module: webpack.compilation.Module, chunks: Array<webpack.compilation.Chunk>) => boolean);
  };
}

/**
 * This interface is used for create new GojiWebpackPlugin
 */
export interface GojiWebpackPluginOptions {
  target: GojiTarget;
  maxDepth?: number;
  minimize?: boolean;
  nohoist?: {
    enable?: boolean;
    maxPackages?: number;
    test?:
      | string
      | RegExp
      | ((module: webpack.compilation.Module, chunks: Array<webpack.compilation.Chunk>) => boolean);
  };
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

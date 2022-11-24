import type { GojiTarget } from '@goji/core';
import webpack from 'webpack';

/**
 * This interface is used for internal plugins
 */
export interface GojiWebpackPluginRequiredOptions {
  target: GojiTarget;
  nodeEnv: string;
  maxDepth: number;
  minimize: boolean;
  nohoist: {
    enable: boolean;
    maxPackages: number;
    test?: string | RegExp | ((module: webpack.Module, chunks: Array<webpack.Chunk>) => boolean);
  };
}

/**
 * This interface is used for create new GojiWebpackPlugin
 */
export interface GojiWebpackPluginOptions {
  target: GojiTarget;
  nodeEnv?: string;
  maxDepth?: number;
  minimize?: boolean;
  nohoist?: {
    enable?: boolean;
    maxPackages?: number;
    test?: string | RegExp | ((module: webpack.Module, chunks: Array<webpack.Chunk>) => boolean);
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

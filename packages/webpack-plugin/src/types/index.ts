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

export interface AppTabBarItem {
  pagePath: string;
  text?: string;
  iconPath?: string;
  selectedIconPath?: string;
  [key: string]: any;
}

export interface AppTabBar {
  custom?: boolean;
  list?: Array<AppTabBarItem>;
  [key: string]: any;
}

export interface AppConfig {
  pages?: Array<string>;
  subpackages?: Array<AppSubpackage>;
  subPackages?: Array<AppSubpackage>;
  tabBar?: AppTabBar;
  usingComponents?: Record<string, string>;
}

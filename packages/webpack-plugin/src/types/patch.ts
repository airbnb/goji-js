/**
 * this file patch the missing types from `@types/webpack` to `webpack@5`
 */
import webpack from 'webpack';

// FIXME:
export type WebpackLoaderContext = any;

export interface WebpackEntrypoint {
  name: string;
}
type Truthy<T> = T extends false ? never : T;
type WebpackOptimization = NonNullable<webpack.Configuration['optimization']>;
type WebpackSplitChunks = NonNullable<WebpackOptimization['splitChunks']>;
export type WebpackCacheGroups = Truthy<WebpackSplitChunks>['cacheGroups'];
export type WebpackRuntimeChunk = WebpackOptimization['runtimeChunk'];

export type WebpackReasonType =
  | 'amd define'
  | 'amd require array'
  | 'amd require context'
  | 'amd require'
  | 'cjs require context'
  | 'cjs require'
  | 'context element'
  | 'delegated exports'
  | 'delegated source'
  | 'dll entry'
  | 'accepted harmony modules'
  | 'harmony accept'
  | 'harmony export expression'
  | 'harmony export header'
  | 'harmony export imported specifier'
  | 'harmony export specifier'
  | 'harmony import specifier'
  | 'harmony side effect evaluation'
  | 'harmony init'
  | 'import() context development'
  | 'import() context production'
  | 'import() eager'
  | 'import() weak'
  | 'import()'
  | 'json exports'
  | 'loader'
  | 'module.hot.accept'
  | 'module.hot.decline'
  | 'multi entry'
  | 'null'
  | 'prefetch'
  | 'require.context'
  | 'require.ensure'
  | 'require.ensure item'
  | 'require.include'
  | 'require.resolve'
  | 'single entry'
  | 'wasm export import'
  | 'wasm import';

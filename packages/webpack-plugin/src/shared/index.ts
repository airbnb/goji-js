import webpack from 'webpack';
import { AppConfig } from '../types';

export const appConfigMap = new WeakMap<webpack.Compiler, AppConfig>();
export const appEntryMap = new WeakMap<webpack.Compiler, string>();
export const pathEntriesMap = new WeakMap<webpack.Compiler, Array<string>>();
export const customTabBarEntryMap = new WeakMap<webpack.Compiler, string | undefined>();
export const usedComponentsMap = new WeakMap<webpack.Compilation, Array<string> | undefined>();
// mutable definitions passed to `DefinePlugin`, some values are only known after `app.json` resolved
export const definitionsMap = new WeakMap<webpack.Compiler, Record<string, string>>();

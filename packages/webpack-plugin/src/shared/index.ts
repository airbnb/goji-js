import webpack from 'webpack';
import { AppConfig } from '../types';

export const appConfigMap = new WeakMap<webpack.Compiler, AppConfig>();
export const appEntryMap = new WeakMap<webpack.Compiler, string>();
export const pathEntriesMap = new WeakMap<webpack.Compiler, Array<string>>();
export const usedComponentsMap = new WeakMap<webpack.Compilation, Array<string> | undefined>();

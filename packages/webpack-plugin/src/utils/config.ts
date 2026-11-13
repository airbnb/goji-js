import path from 'path';
import { GojiTarget } from '@goji/core';
import { AppConfig, AppSubpackage } from '../types';
import { getFeatures } from '../constants/features';
import { CUSTOM_TAB_BAR_ENTRY } from '../constants/paths';

export const readPathsFromAppConfig = (config: AppConfig): Array<string> => {
  const paths = config.pages || [];
  const subPackages = [...(config.subpackages || []), ...(config.subPackages || [])];
  for (const subPackage of subPackages) {
    if (!subPackage.root) {
      throw new Error(
        `field \`root\` not found in sub package config ${JSON.stringify(subPackage)}`,
      );
    }
    if (subPackage.root && subPackage.pages) {
      for (const subPage of subPackage.pages) {
        paths.push(path.posix.join(subPackage.root, subPage));
      }
    }
  }

  return paths;
};

export const getTabBarList = (config: AppConfig) => config.tabBar?.list ?? [];

/**
 * The `tabBar.list` injected into the runtime for `useTabBar`.
 *
 * Icon fields are dropped on purpose: `iconPath` in the source config points to a file which is
 * emitted as a hashed asset (e.g. `assets/icon.1b627c.png`), so the raw path cannot be used at
 * runtime. Components should `require()` their icons instead, see the docs.
 */
export const getRuntimeTabBarList = (config: AppConfig) => {
  const list = getTabBarList(config);
  const hasIcon = list.some(item => item.iconPath || item.selectedIconPath);
  if (hasIcon) {
    console.warn(
      '[GojiJS] `iconPath` and `selectedIconPath` in `tabBar.list` are not available in the custom tabBar, ' +
        'please use `require()` to load icons inside `custom-tab-bar/index` instead.',
    );
  }
  return list.map(({ pagePath, text }) => ({ pagePath, text }));
};

/**
 * Resolve the entry of the custom tabBar component.
 *
 * WeChat requires the custom tabBar to be implemented as a custom component placed in
 * `custom-tab-bar/index`, which means it should be built as an entry rather than a page.
 * https://developers.weixin.qq.com/miniprogram/dev/framework/ability/custom-tabbar.html
 */
export const getCustomTabBarEntry = (config: AppConfig, target: GojiTarget): string | undefined => {
  if (!config.tabBar?.custom) {
    return undefined;
  }
  if (!getFeatures(target).customTabBar) {
    console.warn(
      `[GojiJS] \`tabBar.custom\` is not supported on target "${target}" yet, the native tabBar is used instead.`,
    );
    return undefined;
  }
  const tabBarList = getTabBarList(config);
  if (!tabBarList.length) {
    throw new Error(
      '`tabBar.list` must be declared completely when `tabBar.custom` is enabled, see https://developers.weixin.qq.com/miniprogram/dev/framework/ability/custom-tabbar.html',
    );
  }
  // the tab pages must be declared in `pages` so that WeChat can identify them
  const pages = config.pages ?? [];
  for (const item of tabBarList) {
    if (!item.pagePath) {
      throw new Error(`field \`pagePath\` not found in tabBar item ${JSON.stringify(item)}`);
    }
    if (!pages.includes(item.pagePath)) {
      throw new Error(
        `tabBar page \`${item.pagePath}\` not found in \`app.json\` -> \`pages\`, tab pages must be declared inside the main package`,
      );
    }
  }
  return CUSTOM_TAB_BAR_ENTRY;
};

export const getSubpackagesInfo = (config: AppConfig) => {
  const all = config.subPackages ?? [];
  const independents: Array<AppSubpackage> = [];
  const dependents: Array<AppSubpackage> = [];
  for (const item of all) {
    if (item.independent) {
      independents.push(item);
    } else {
      dependents.push(item);
    }
  }
  return [all, independents, dependents] as const;
};

export const isBelongsTo = (pagePath: string, subPackage: string) =>
  pagePath.startsWith(`${subPackage}/`);

export const MAIN_PACKAGE = Symbol('MAIN_PACKAGE');

export const findBelongingSubPackage = (
  pagePath: string,
  subPackages: Array<string>,
): string | typeof MAIN_PACKAGE =>
  subPackages.find(subPackage => isBelongsTo(pagePath, subPackage)) ?? MAIN_PACKAGE;

export const findBelongingSubPackages = (
  pagePaths: Array<string>,
  subPackages: Array<string>,
): Set<string | typeof MAIN_PACKAGE> => {
  const result = new Set<string | typeof MAIN_PACKAGE>();
  for (const pagePath of pagePaths) {
    const belongingSubPackage = findBelongingSubPackage(pagePath, subPackages);
    result.add(belongingSubPackage);
  }
  return result;
};

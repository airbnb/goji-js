import { useCallback, useState } from 'react';
import { useVisibility } from './lifecycles/universal';

export interface TabBarItem {
  pagePath: string;
  text?: string;
}

const parseTabBarList = (value: unknown): Array<TabBarItem> => {
  // `process.env.GOJI_TAB_BAR_LIST` is replaced by an array literal by webpack's DefinePlugin,
  // but it stays a JSON string when the code is not bundled by `@goji/webpack-plugin`
  if (Array.isArray(value)) {
    return value;
  }
  if (typeof value === 'string') {
    try {
      const parsed: unknown = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  }
  return [];
};

/**
 * The `tabBar.list` in `app.json` which is injected by `@goji/webpack-plugin` at build time.
 * In a custom tabBar, `tabBar.list` is not rendered natively but still needed to tell the
 * Mini Program which pages are tab pages.
 */
export const getTabBarList = (): Array<TabBarItem> =>
  parseTabBarList(process.env.GOJI_TAB_BAR_LIST);

const normalizeRoute = (route: string) => route.replace(/^\//, '');

const getCurrentPageRoute = (): string | undefined => {
  if (typeof getCurrentPages !== 'function') {
    return undefined;
  }
  const pages = getCurrentPages();
  const page = pages[pages.length - 1] as any;
  // the name of the `route` field is not unified on all platforms, see
  // `packages/webpack-plugin/src/plugins/shim/patches/getCurrentPages.ts`
  // eslint-disable-next-line no-underscore-dangle
  const route: unknown = page?.route ?? page?.__route__;
  return typeof route === 'string' ? normalizeRoute(route) : undefined;
};

/**
 * Get the index of the current page in `tabBar.list`, or `-1` if it's not a tab page.
 */
export const getSelectedTabIndex = (): number => {
  const route = getCurrentPageRoute();
  if (!route) {
    return -1;
  }
  return getTabBarList().findIndex(item => normalizeRoute(item.pagePath) === route);
};

export interface UseTabBarResult {
  /** The index of the current tab, or `-1` if the current page is not a tab page. */
  selected: number;
  list: Array<TabBarItem>;
  switchTab: (index: number) => void;
}

/**
 * Use this hook inside the custom tabBar component, which should be rendered by
 * `render(<TabBar />, { type: 'component' })` at `custom-tab-bar/index`.
 *
 * The selected tab is derived from the route of the host page rather than page-side
 * `getTabBar().setData()`, each tab page owns its own tabBar instance so there is no
 * state to sync between pages.
 */
export const useTabBar = (): UseTabBarResult => {
  const list = getTabBarList();
  const [selected, setSelected] = useState(() => getSelectedTabIndex());

  // refresh when the host page shows, e.g. after `switchTab` or navigating back
  useVisibility(visible => {
    if (!visible) {
      return;
    }
    const index = getSelectedTabIndex();
    setSelected(previous => (previous === index ? previous : index));
  });

  const switchTab = useCallback(
    (index: number) => {
      const item = list[index];
      if (!item) {
        return;
      }
      // `wx` is shimmed to the platform API by `@goji/webpack-plugin`
      wx.switchTab({ url: `/${normalizeRoute(item.pagePath)}` });
    },
    [list],
  );

  return { selected, list, switchTab };
};

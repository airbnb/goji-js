import { getCustomTabBarEntry, getRuntimeTabBarList, getTabBarList } from '../config';
import { AppConfig } from '../../types';
import { CUSTOM_TAB_BAR_ENTRY } from '../../constants/paths';

describe('getRuntimeTabBarList', () => {
  test('strip icon fields which are build-time only', () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => undefined);
    const config: AppConfig = {
      pages: ['pages/index/index'],
      tabBar: {
        list: [
          {
            pagePath: 'pages/index/index',
            text: 'Index',
            iconPath: './image/icon.png',
            selectedIconPath: './image/icon-hl.png',
          },
        ],
      },
    };
    expect(getRuntimeTabBarList(config)).toEqual([
      { pagePath: 'pages/index/index', text: 'Index' },
    ]);
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });

  test('does not warn when no icon is used', () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => undefined);
    expect(
      getRuntimeTabBarList({
        tabBar: { list: [{ pagePath: 'pages/index/index', text: 'Index' }] },
      }),
    ).toEqual([{ pagePath: 'pages/index/index', text: 'Index' }]);
    expect(warn).not.toHaveBeenCalled();
    warn.mockRestore();
  });
});

describe('getTabBarList', () => {
  test('return empty list when no tabBar', () => {
    expect(getTabBarList({ pages: [] })).toEqual([]);
  });

  test('return tabBar list', () => {
    const config: AppConfig = {
      pages: ['pages/index/index'],
      tabBar: {
        list: [{ pagePath: 'pages/index/index', text: 'Index' }],
      },
    };
    expect(getTabBarList(config)).toEqual([{ pagePath: 'pages/index/index', text: 'Index' }]);
  });
});

describe('getCustomTabBarEntry', () => {
  const baseConfig: AppConfig = {
    pages: ['pages/index/index', 'pages/me/index'],
    tabBar: {
      list: [
        { pagePath: 'pages/index/index', text: 'Index' },
        { pagePath: 'pages/me/index', text: 'Me' },
      ],
    },
  };

  test('return undefined when `custom` is disabled', () => {
    expect(getCustomTabBarEntry(baseConfig, 'wechat')).toBeUndefined();
  });

  test('return undefined when `custom` is false', () => {
    expect(
      getCustomTabBarEntry(
        { ...baseConfig, tabBar: { ...baseConfig.tabBar, custom: false } },
        'wechat',
      ),
    ).toBeUndefined();
  });

  test('return custom tabBar entry on wechat', () => {
    expect(
      getCustomTabBarEntry(
        { ...baseConfig, tabBar: { ...baseConfig.tabBar, custom: true } },
        'wechat',
      ),
    ).toBe(CUSTOM_TAB_BAR_ENTRY);
  });

  test('warn and ignore on unsupported targets', () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => undefined);
    expect(
      getCustomTabBarEntry(
        { ...baseConfig, tabBar: { ...baseConfig.tabBar, custom: true } },
        'alipay',
      ),
    ).toBeUndefined();
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });

  test('throw if `tabBar.list` is empty', () => {
    expect(() =>
      getCustomTabBarEntry({ pages: ['pages/index/index'], tabBar: { custom: true } }, 'wechat'),
    ).toThrow('`tabBar.list` must be declared completely');
  });

  test('throw if a tab page is not declared in `pages`', () => {
    expect(() =>
      getCustomTabBarEntry(
        {
          pages: ['pages/index/index'],
          tabBar: { custom: true, list: [{ pagePath: 'pages/me/index' }] },
        },
        'wechat',
      ),
    ).toThrow('tabBar page `pages/me/index` not found');
  });
});

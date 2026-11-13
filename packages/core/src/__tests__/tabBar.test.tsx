import React from 'react';
import { act, create } from 'react-test-renderer';
import { View, useTabBar, getSelectedTabIndex, getTabBarList } from '..';
import { GojiProvider } from '../components';
import { createEventProxy } from '../components/eventProxy';

const TAB_BAR_LIST = [
  { pagePath: 'pages/index/index', text: 'Index' },
  { pagePath: 'pages/me/index', text: 'Me' },
];

describe('tabBar', () => {
  let originalGetCurrentPages: any;
  let originalSwitchTab: any;

  beforeEach(() => {
    process.env.GOJI_TAB_BAR_LIST = JSON.stringify(TAB_BAR_LIST);
    originalGetCurrentPages = (global as any).getCurrentPages;
    originalSwitchTab = (global as any).wx?.switchTab;
    (global as any).getCurrentPages = () => [{ route: 'pages/index/index' }];
    (global as any).wx = { switchTab: jest.fn() };
  });

  afterEach(() => {
    delete process.env.GOJI_TAB_BAR_LIST;
    (global as any).getCurrentPages = originalGetCurrentPages;
    (global as any).wx = { switchTab: originalSwitchTab };
  });

  test('getTabBarList returns the injected list', () => {
    expect(getTabBarList()).toEqual(TAB_BAR_LIST);
  });

  test('getSelectedTabIndex matches the current route', () => {
    expect(getSelectedTabIndex()).toBe(0);
    (global as any).getCurrentPages = () => [{ route: 'pages/me/index' }];
    expect(getSelectedTabIndex()).toBe(1);
    (global as any).getCurrentPages = () => [{ route: 'pages/other/index' }];
    expect(getSelectedTabIndex()).toBe(-1);
  });

  test('getSelectedTabIndex works with a leading slash and `__route__`', () => {
    (global as any).getCurrentPages = () => [{ __route__: '/pages/me/index' }];
    expect(getSelectedTabIndex()).toBe(1);
  });

  test('useTabBar switches tabs and refreshes on page show', () => {
    const eventProxy = createEventProxy();
    let result: ReturnType<typeof useTabBar> | undefined;
    const TabBar = () => {
      result = useTabBar();
      return <View />;
    };

    create(
      <GojiProvider container={{ eventProxy } as any}>
        <TabBar />
      </GojiProvider>,
    );

    expect(result?.selected).toBe(0);

    act(() => result?.switchTab(1));
    expect((global as any).wx.switchTab).toHaveBeenCalledWith({ url: '/pages/me/index' });

    // simulate switching to another tab page
    (global as any).getCurrentPages = () => [{ route: 'pages/me/index' }];
    act(() => {
      eventProxy.lifecycleChannel.onShow.emit(undefined);
    });
    expect(result?.selected).toBe(1);
  });
});

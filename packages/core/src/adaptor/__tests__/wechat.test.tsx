import React from 'react';
import { View } from '../..';
import { WeChatAdaptor, WeChatComponentConfig, WeChatPageConfig, WeChatInstance } from '../wechat';

describe('WeChatAdaptor', () => {
  describe('page', () => {
    let data: any;
    beforeAll(() => {
      global.Page = function Page(options: WeChatPageConfig) {
        const instance: WeChatInstance = {
          setData(newData) {
            data = newData;
          },
        };
        options.onLoad?.call(instance, {});
      };
    });

    test('works with Page', () => {
      const adaptor = new WeChatAdaptor('page', {}, false);
      adaptor.run(<View />);
      expect(data).toMatchSnapshot();
    });

    afterAll(() => {
      // @ts-expect-error
      delete global.Page;
    });
  });

  describe('component', () => {
    let componentConfig: WeChatComponentConfig;
    let componentInstance: WeChatInstance;
    let data: any;

    beforeEach(() => {
      data = undefined;
      // @ts-expect-error
      global.Component = function Component(options: WeChatComponentConfig) {
        componentConfig = options;
      };
      componentInstance = {
        setData(newData) {
          data = newData;
        },
      };
    });

    afterEach(() => {
      // @ts-expect-error
      delete global.Component;
    });

    test('render inside `attached` rather than `methods`', () => {
      const adaptor = new WeChatAdaptor('component', {}, false);
      adaptor.run(<View />);

      // lifecycles must be declared in `lifetimes`, otherwise they never run
      expect(Object.keys(componentConfig.methods ?? {})).toEqual(['e']);
      expect(componentConfig.lifetimes?.attached).toBeInstanceOf(Function);

      componentConfig.lifetimes?.attached?.call(componentInstance);
      expect(data).toMatchSnapshot();
    });

    test('adds global class by default and allows overriding', () => {
      new WeChatAdaptor('component', {}, false, { options: { addGlobalClass: false } }).run(
        <View />,
      );
      expect(componentConfig.options?.addGlobalClass).toBe(false);

      new WeChatAdaptor('component', {}, false).run(<View />);
      expect(componentConfig.options?.addGlobalClass).toBe(true);
    });

    test('forwards page show/hide into lifecycle channels', () => {
      const onShow = jest.fn();
      const onHide = jest.fn();
      const adaptor = new WeChatAdaptor('component', {}, false);
      adaptor.run(<View />);

      componentConfig.lifetimes?.attached?.call(componentInstance);
      const container = componentInstance.__GOJI_CONTAINER!;
      container.eventProxy.lifecycleChannel.onShow.on(onShow);
      container.eventProxy.lifecycleChannel.onHide.on(onHide);

      componentConfig.pageLifetimes?.show?.call(componentInstance);
      expect(onShow).toHaveBeenCalledTimes(1);

      componentConfig.pageLifetimes?.hide?.call(componentInstance);
      expect(onHide).toHaveBeenCalledTimes(1);
    });

    test('clear container when detached', () => {
      const adaptor = new WeChatAdaptor('component', {}, false);
      adaptor.run(<View />);

      componentConfig.lifetimes?.attached?.call(componentInstance);
      expect(componentInstance.__GOJI_CONTAINER).toBeDefined();

      componentConfig.lifetimes?.detached?.call(componentInstance);
      expect(componentInstance.__GOJI_CONTAINER).toBeUndefined();
    });
  });
});

import React from 'react';
import { View } from '../..';
import { WeChatAdaptor, WeChatPageConfig, WeChatInstance } from '../wechat';

describe('WeChatAdaptor', () => {
  let data: any;
  beforeAll(() => {
    // @ts-ignore
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
    // @ts-ignore
    delete global.Page;
  });
});

import React, { useState } from 'react';
import { View } from '..';
import { WeChatAdaptor, WeChatPageConfig, WeChatInstance } from '../adaptor/wechat';
import { Adaptor } from '../adaptor';

describe('updates', () => {
  let diff: any;
  let adaptor: Adaptor;

  beforeAll(() => {
    global.Page = function Page(options: WeChatPageConfig) {
      const instance: WeChatInstance = {
        setData(data) {
          diff = data;
        },
      };
      options.onLoad?.call(instance, {});
    };

    adaptor = new WeChatAdaptor('page', {}, false);
  });

  afterAll(() => {
    // @ts-expect-error
    delete global.Page;
  });

  it('update text, re-render the text', () => {
    let updater;
    const TestComp = () => {
      const [count, setCount] = useState(0);
      updater = setCount;
      return <View>{count}</View>;
    };

    adaptor.run(<TestComp />);
    updater(3);
    expect(diff).toEqual({ 'meta.children[0].children[0].text': '3' });
  });

  it('create or remove instance, re-render the whole sub-tree', () => {
    let updater;
    const TestComp = () => {
      const [show, setShow] = useState(false);
      updater = setShow;

      return (
        <View>
          <View>sibling</View>
          <View>{show && <View>233</View>}</View>
        </View>
      );
    };

    adaptor.run(<TestComp />);
    updater(true);

    expect(Object.keys(diff)).toEqual(['meta.children[0].children[1]']);
    expect(diff['meta.children[0].children[1]'].children.length).toEqual(1);

    updater(false);

    expect(Object.keys(diff)).toEqual(['meta.children[0].children[1]']);
    expect(diff['meta.children[0].children[1]'].children.length).toEqual(0);
  });

  it('only update events, should not trigger setData', () => {
    let updater: (fn: (e: any) => void) => void;
    const noop = () => {};

    const TestComp = () => {
      const [callback, setCallback] = useState<(e) => void>(noop);
      updater = setCallback;

      return <View onTap={callback}>233</View>;
    };

    adaptor.run(<TestComp />);
    diff = null;

    // @ts-expect-error
    updater(e => e);
    expect(diff).toEqual(null);
  });

  it('should update simplify id when comp simplify state is changed', () => {
    let updater: (bool: boolean) => void;

    const TestComp = () => {
      const [simplify, setSimplify] = useState(true);
      updater = setSimplify;

      if (simplify) {
        return <View>233</View>;
      }

      return <View onTap={() => {}}>233</View>;
    };

    adaptor.run(<TestComp />);
    diff = null;

    // @ts-expect-error
    updater(false);
    expect(Object.keys(diff)).toEqual(['meta.children[0].simplifiedId']);
  });
});

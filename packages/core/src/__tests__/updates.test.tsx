import React, { useState } from 'react';
import { View } from '..';
import { WeChatAdaptor, WeChatPageConfig, WeChatInstance } from '../adaptor/wechat';
import { Adaptor } from '../adaptor';
import { internal_resetInstanceId as resetInstanceId } from '../utils/id';

import { ScopedUpdaterTester } from './helpers/ScopedUpdaterTester';

describe('updates', () => {
  let diff: any;
  let adaptor: Adaptor;

  beforeAll(() => {
    // @ts-ignore
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
    // @ts-ignore
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
    expect(diff).toEqual({ 'c[0].c[0].text': '3' });
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

    expect(Object.keys(diff)).toEqual(['c[0].c[1]']);
    expect(diff['c[0].c[1]'].c.length).toEqual(1);

    updater(false);

    expect(Object.keys(diff)).toEqual(['c[0].c[1]']);
    expect(diff['c[0].c[1]'].c.length).toEqual(0);
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

    // @ts-ignore
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

    // @ts-ignore
    updater(false);
    expect(Object.keys(diff)).toEqual(['c[0].sid']);
  });

  it('should update in scoped updater', () => {
    resetInstanceId();
    let updater: () => void;
    let scopeDiff = {};

    const setState = (payload: any) => {
      scopeDiff = payload;
    };

    const TestComp = () => {
      const [count, setCount] = useState(0);
      updater = () => setCount(i => i + 1);

      return (
        <View>
          <View>
            <ScopedUpdaterTester gojiId={4} setState={setState}>
              <View>{count}</View>
            </ScopedUpdaterTester>
          </View>
          <View>
            <View>{count}</View>
          </View>
        </View>
      );
    };

    adaptor.run(<TestComp />);
    diff = null;

    // @ts-ignore
    updater();
    expect(Object.keys(diff)).toEqual(['c[0].c[1].c[0].c[0].text']);
    expect(Object.keys(scopeDiff)).toEqual(['c[0].c[0].text']);
  });
});

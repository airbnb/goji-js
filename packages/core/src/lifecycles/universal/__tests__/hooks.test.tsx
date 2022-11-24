import React, { useState, useReducer } from 'react';
import { act, create } from 'react-test-renderer';
import { TestingAdaptor } from '../../../__tests__/helpers/adaptor';
import { View, useLoadOptions, useRenderedEffect, setGojiBlockingMode } from '../../..';
import { GojiProvider } from '../../../components';
import { createEventProxy } from '../../../components/eventProxy';
import { render, RenderResult } from '../../../__tests__/helpers';

describe('universal lifecycles', () => {
  test('useLoadOptions works', () => {
    const useLoadOptionsCallback = jest.fn();
    let showCompCallback: Function;
    let forceRerenderCallback: Function;

    const Comp = () => {
      const [state, setState] = useState(0);
      forceRerenderCallback = () => setState(state + 1);
      useLoadOptions(useLoadOptionsCallback);
      return <View>hello</View>;
    };
    const App = () => {
      const [showComp, setShowComp] = useState(false);
      showCompCallback = () => setShowComp(true);

      return showComp ? <Comp /> : null;
    };
    const eventProxy = createEventProxy();
    create(
      <GojiProvider container={{ eventProxy } as any}>
        <App />
      </GojiProvider>,
    );

    // trigger onLoad
    const mockOnLoadOptions = { key: 'haha' };
    act(() => {
      eventProxy.lifecycleChannel.onLoad.emit(mockOnLoadOptions);
    });
    expect(useLoadOptionsCallback).not.toBeCalled();
    useLoadOptionsCallback.mockReset();

    // click button to mount the `Comp`
    act(() => showCompCallback());
    expect(useLoadOptionsCallback).toBeCalledWith({ key: 'haha' });
    useLoadOptionsCallback.mockReset();

    // force re-render should not call loadOptions callback
    act(() => forceRerenderCallback());
    expect(useLoadOptionsCallback).not.toBeCalled();
    useLoadOptionsCallback.mockReset();
  });

  test('useRenderedEffect works', () => {
    const renderedEffectCallback = jest.fn();
    let forceUpdate: () => void;
    const Page = () => {
      useRenderedEffect(renderedEffectCallback);
      [, forceUpdate] = useReducer(s => s + 1, 0);
      return <View />;
    };

    const wrapper = render(<Page />);
    wrapper.setManuallyResolvedUpdateCallback(true);

    expect(renderedEffectCallback).toBeCalledTimes(0);

    renderedEffectCallback.mockClear();
    expect(wrapper.resolveUpdateCallback()).toBe(true);
    expect(renderedEffectCallback).toBeCalled();

    // re-render the component with no UI changed
    wrapper.setManuallyResolvedUpdateCallback(false);
    renderedEffectCallback.mockClear();
    // @ts-expect-error
    forceUpdate();
    expect(renderedEffectCallback).toBeCalled();
  });

  test('useRenderedEffect with multi update', async () => {
    const renderedEffectCallback = jest.fn();
    let update: () => void;
    let renderId = 0;
    const Page = () => {
      const [count, setCount] = useState(0);
      update = () => setCount(count + 1);
      // eslint-disable-next-line no-plusplus
      const currentRenderId = renderId++;
      useRenderedEffect(() => renderedEffectCallback(currentRenderId));
      return <View>{count}</View>;
    };

    const wrapper = render(<Page />);
    wrapper.setManuallyResolvedUpdateCallback(true);
    // re-render the component
    // @ts-expect-error
    update();
    // @ts-expect-error
    update();

    renderedEffectCallback.mockClear();
    expect(wrapper.resolveUpdateCallback()).toBe(true);
    expect(renderedEffectCallback).toBeCalledWith(0); // first time rendering

    renderedEffectCallback.mockClear();
    expect(wrapper.resolveUpdateCallback()).toBe(true);
    expect(renderedEffectCallback).toBeCalledWith(1); // re-render

    renderedEffectCallback.mockClear();
    expect(wrapper.resolveUpdateCallback()).toBe(true);
    expect(renderedEffectCallback).toBeCalledWith(2); // re-render

    renderedEffectCallback.mockClear();
    expect(wrapper.resolveUpdateCallback()).toBe(false);
    expect(renderedEffectCallback).not.toBeCalled(); // done
  });

  describe('useRenderedEffect with out-of-order updates', () => {
    let renderedEffectCallback = jest.fn();
    let update: () => void = () => {};
    let wrapper: RenderResult;

    beforeEach(() => {
      renderedEffectCallback = jest.fn();
      let renderId = 0;
      const Page = () => {
        const [count, setCount] = useState(0);
        update = () => setCount(count + 1);
        // eslint-disable-next-line no-plusplus
        const currentRenderId = renderId++;
        useRenderedEffect(() => renderedEffectCallback(currentRenderId));
        return <View>{count}</View>;
      };

      const testingAdaptorInstance = new TestingAdaptor().run(<Page />);

      wrapper = new RenderResult(testingAdaptorInstance);
      wrapper.setManuallyResolvedUpdateCallback(true);
    });

    test('resolve 0 -> 1 -> 2', () => {
      update();
      update();
      update();

      renderedEffectCallback.mockClear();
      expect(wrapper.resolveUpdateCallback('0')).toBe(true);
      expect(renderedEffectCallback).toBeCalledTimes(1);
      expect(renderedEffectCallback.mock.calls[0][0]).toBe(0);
      expect(wrapper.resolveUpdateCallback('1')).toBe(true);
      expect(renderedEffectCallback).toBeCalledTimes(2);
      expect(renderedEffectCallback.mock.calls[1][0]).toBe(1);
      expect(wrapper.resolveUpdateCallback('2')).toBe(true);
      expect(renderedEffectCallback).toBeCalledTimes(3);
      expect(renderedEffectCallback.mock.calls[2][0]).toBe(2);
    });

    test('resolve 1 -> 0', () => {
      update();
      update();

      renderedEffectCallback.mockClear();
      expect(wrapper.resolveUpdateCallback('1')).toBe(true);
      expect(renderedEffectCallback).not.toBeCalled();
      expect(wrapper.resolveUpdateCallback('0')).toBe(true);

      expect(renderedEffectCallback).toBeCalledTimes(2);
      expect(renderedEffectCallback.mock.calls[0][0]).toBe(0);
      expect(renderedEffectCallback.mock.calls[1][0]).toBe(1);
    });

    test('resolve: 1 -> 0 -> 2', () => {
      update();
      update();
      update();
      expect(wrapper.resolveUpdateCallback('1')).toBe(true);
      expect(renderedEffectCallback).not.toBeCalled();
      expect(wrapper.resolveUpdateCallback('0')).toBe(true);
      expect(renderedEffectCallback).toBeCalledTimes(2);
      expect(renderedEffectCallback.mock.calls[0][0]).toBe(0);
      expect(renderedEffectCallback.mock.calls[1][0]).toBe(1);
      expect(wrapper.resolveUpdateCallback('2')).toBe(true);
      expect(renderedEffectCallback).toBeCalledTimes(3);
      expect(renderedEffectCallback.mock.calls[2][0]).toBe(2);
    });

    test('resolve: 2 -> 3 -> 0 -> 1', () => {
      update();
      update();
      update();
      expect(wrapper.resolveUpdateCallback('2')).toBe(true);
      expect(renderedEffectCallback).not.toBeCalled();
      expect(wrapper.resolveUpdateCallback('3')).toBe(true);
      expect(renderedEffectCallback).not.toBeCalled();
      expect(wrapper.resolveUpdateCallback('0')).toBe(true);
      expect(renderedEffectCallback).toBeCalledTimes(1);
      expect(renderedEffectCallback.mock.calls[0][0]).toBe(0);
      expect(wrapper.resolveUpdateCallback('1')).toBe(true);
      expect(renderedEffectCallback).toBeCalledTimes(4);
      expect(renderedEffectCallback.mock.calls[1][0]).toBe(1);
      expect(renderedEffectCallback.mock.calls[2][0]).toBe(2);
      expect(renderedEffectCallback.mock.calls[3][0]).toBe(3);
    });
  });

  describe('blocking mode: useRenderedEffect with out-of-order updates', () => {
    let renderedEffectCallback = jest.fn();
    let mockSetData = jest.fn();
    let update: () => void = () => {};
    let wrapper: RenderResult;
    const originalPage = global.Page;

    beforeEach(() => {
      mockSetData = jest.fn();
      setGojiBlockingMode(true);

      renderedEffectCallback = jest.fn();
      let renderId = 0;
      const Page = () => {
        const [count, setCount] = useState(0);
        update = () => setCount(count + 1);
        // eslint-disable-next-line no-plusplus
        const currentRenderId = renderId++;
        useRenderedEffect(() => renderedEffectCallback(currentRenderId));
        return <View>{count}</View>;
      };

      const testingAdaptorInstance = new TestingAdaptor().run(<Page />);
      testingAdaptorInstance.setData = mockSetData;

      wrapper = new RenderResult(testingAdaptorInstance);
      wrapper.setManuallyResolvedUpdateCallback(true);
    });

    afterEach(() => {
      global.Page = originalPage;
      setGojiBlockingMode(false);
    });

    it('resolve: 0 -> 1 -> 2', () => {
      update();
      wrapper.resolveUpdateCallback('0');
      expect(mockSetData.mock.calls[0][0]).toEqual({ 'meta.children[0].children[0].text': '1' });
      update();
      update();
      wrapper.resolveUpdateCallback('2');
      wrapper.resolveUpdateCallback('1');
      expect(mockSetData).toBeCalledTimes(2);
      expect(mockSetData.mock.calls[1][0]).toEqual({ 'meta.children[0].children[0].text': '3' });
    });

    it('resolve: 1 -> 0 -> 1', () => {
      update();
      wrapper.resolveUpdateCallback('1');
      expect(mockSetData).toBeCalledTimes(0);

      update();
      wrapper.resolveUpdateCallback('0');
      expect(mockSetData).toBeCalledTimes(1);
      expect(mockSetData.mock.calls[0][0]).toEqual({ 'meta.children[0].children[0].text': '2' });

      update();
      wrapper.resolveUpdateCallback('1');
      expect(mockSetData).toBeCalledTimes(2);
      expect(mockSetData.mock.calls[1][0]).toEqual({ 'meta.children[0].children[0].text': '3' });
    });

    it('resolve: 2 -> 0 -> 1 -> 1', () => {
      update();
      expect(mockSetData).toBeCalledTimes(0);

      update();
      expect(mockSetData).toBeCalledTimes(0);

      update();
      wrapper.resolveUpdateCallback('2');
      wrapper.resolveUpdateCallback('0');
      wrapper.resolveUpdateCallback('1');
      expect(mockSetData).toBeCalledTimes(1);
      expect(mockSetData.mock.calls[0][0]).toEqual({ 'meta.children[0].children[0].text': '3' });

      update();
      wrapper.resolveUpdateCallback('1');
      expect(mockSetData).toBeCalledTimes(2);
      expect(mockSetData.mock.calls[1][0]).toEqual({ 'meta.children[0].children[0].text': '4' });
    });
  });
});

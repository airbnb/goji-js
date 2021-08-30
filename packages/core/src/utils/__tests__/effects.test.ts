import { useState, useLayoutEffect, useEffect } from 'react';
import { renderHook, act } from '@testing-library/react-hooks';
import { useImmediatelyEffect } from '../effects';

describe('useImmediatelyEffect', () => {
  test('deps is `[]`', () => {
    const callback = jest.fn() as jest.Mock<undefined, [string]>;
    const useTest = () => {
      const [, setCount] = useState(0);
      callback('render');
      useImmediatelyEffect(() => {
        callback('immediately effect update');
        setCount(10);
      }, []);
      useImmediatelyEffect(() => {
        callback('immediately effect');
      });
      useLayoutEffect(() => {
        callback('layout effect');
      });
      useEffect(() => {
        callback('effect');
      });
    };
    renderHook(useTest);

    expect(callback.mock.calls).toEqual([
      ['render'],
      ['immediately effect update'], // should run immediately
      ['immediately effect'], // should run during render rather than after commit
      ['render'],
      ['immediately effect'],
      ['layout effect'],
      ['effect'],
    ]);
  });

  test('with deps', () => {
    const immediatelyEffectCallback = jest.fn();
    const immediatelyEffectUnsubscribedCallback = jest.fn();
    const useTest = () => {
      const [count, setCount] = useState(0);
      const [, setAnother] = useState(0);
      useImmediatelyEffect(() => {
        immediatelyEffectCallback();

        return () => {
          immediatelyEffectUnsubscribedCallback();
        };
      }, [count]);

      return { setCount, setAnother };
    };
    const { result } = renderHook(useTest);

    expect(immediatelyEffectCallback).toBeCalledTimes(1);
    expect(immediatelyEffectUnsubscribedCallback).toBeCalledTimes(0);
    // update deps
    act(() => {
      result.current.setCount(c => c + 1);
    });
    expect(immediatelyEffectCallback).toBeCalledTimes(2);
    expect(immediatelyEffectUnsubscribedCallback).toBeCalledTimes(1);
    // update deps with same value
    act(() => {
      result.current.setCount(c => c);
    });
    expect(immediatelyEffectCallback).toBeCalledTimes(2); // should not run
    expect(immediatelyEffectUnsubscribedCallback).toBeCalledTimes(1);
    // update non-deps
    act(() => {
      result.current.setAnother(c => c + 1);
    });
    expect(immediatelyEffectCallback).toBeCalledTimes(2); // should not run
    expect(immediatelyEffectUnsubscribedCallback).toBeCalledTimes(1);
  });

  test('unsubscribe after unmounted', () => {
    const immediatelyEffectCallback = jest.fn();
    const immediatelyEffectUnsubscribedCallback = jest.fn();
    const useTest = () => {
      useImmediatelyEffect(() => {
        immediatelyEffectCallback();
        return () => {
          immediatelyEffectUnsubscribedCallback();
        };
      }, []);
    };
    const { unmount } = renderHook(useTest);

    expect(immediatelyEffectCallback).toBeCalledTimes(1);
    expect(immediatelyEffectUnsubscribedCallback).toBeCalledTimes(0);

    unmount();
    expect(immediatelyEffectCallback).toBeCalledTimes(1);
    expect(immediatelyEffectUnsubscribedCallback).toBeCalledTimes(1);
  });

  test('callback and unsubscribe order', () => {
    const callback = jest.fn() as jest.Mock<undefined, [string]>;
    const useTest = () => {
      const [state, setState] = useState(0);
      useImmediatelyEffect(() => {
        callback(`callback${state}`);
        return () => {
          callback(`unsubscribe${state}`);
        };
      }, [state]);

      return { setState };
    };
    const { result, unmount } = renderHook(useTest);

    expect(callback.mock.calls).toEqual([['callback0']]);

    callback.mockClear();
    act(() => {
      result.current.setState(s => s + 1);
    });
    expect(callback.mock.calls).toEqual([['unsubscribe0'], ['callback1']]);

    callback.mockClear();
    unmount();
    expect(callback.mock.calls).toEqual([['unsubscribe1']]);
  });
});

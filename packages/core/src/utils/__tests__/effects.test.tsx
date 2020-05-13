import React, { useState, useLayoutEffect, useEffect } from 'react';
import { render } from '../../__tests__/helpers';
import { View } from '../..';
import { useImmediatelyEffect } from '../effects';
import { act } from '../../testUtils';

describe('useImmediatelyEffect', () => {
  test('deps is `[]`', () => {
    let renderCount = 0;
    let immediatelyEffectCount = 0;
    let effectCount = 0;
    let layoutEffectCount = 0;
    const App = () => {
      const [count, setCount] = useState(0);
      useImmediatelyEffect(() => {
        setCount(10);
      }, []);
      // count
      renderCount += 1;
      useImmediatelyEffect(() => {
        immediatelyEffectCount += 1;
      });
      useLayoutEffect(() => {
        layoutEffectCount += 1;
      });
      useEffect(() => {
        effectCount += 1;
      });
      return <View>{count}</View>;
    };

    render(<App />);
    expect(renderCount).toBe(2);
    // useImmediatelyEffect run during render rather than after commit
    expect(immediatelyEffectCount).toBe(2);
    expect(layoutEffectCount).toBe(1);
    expect(effectCount).toBe(0);
  });

  test('with deps', () => {
    let immediatelyEffectCount = 0;
    let immediatelyEffectUnsubscribedCount = 0;
    let increase: () => void;
    let increaseAnother: () => void;
    const App = () => {
      const [count, setCount] = useState(0);
      const [another, setAnother] = useState(0);
      increase = () => setCount(count + 1);
      increaseAnother = () => setAnother(another + 1);
      useImmediatelyEffect(() => {
        immediatelyEffectCount += 1;
        return () => {
          immediatelyEffectUnsubscribedCount += 1;
        };
      }, [count]);
      return <View>{count}</View>;
    };

    render(<App />);
    expect(immediatelyEffectCount).toBe(1);
    expect(immediatelyEffectUnsubscribedCount).toBe(0);
    // @ts-ignore
    act(increase);
    expect(immediatelyEffectCount).toBe(2);
    expect(immediatelyEffectUnsubscribedCount).toBe(1);
    // @ts-ignore
    act(increaseAnother);
    expect(immediatelyEffectCount).toBe(2); // should not run
    expect(immediatelyEffectUnsubscribedCount).toBe(1);
  });

  test('unsubscribe after unmounted', () => {
    let immediatelyEffectCount = 0;
    let immediatelyEffectUnsubscribedCount = 0;
    let unmount: () => void;
    const Comp = () => {
      useImmediatelyEffect(() => {
        immediatelyEffectCount += 1;
        return () => {
          immediatelyEffectUnsubscribedCount += 1;
        };
      }, []);
      return <View />;
    };
    const App = () => {
      const [show, setShow] = useState(true);
      unmount = () => setShow(false);

      return <>{show && <Comp />}</>;
    };

    render(<App />);
    expect(immediatelyEffectCount).toBe(1);
    expect(immediatelyEffectUnsubscribedCount).toBe(0);

    // @ts-ignore
    act(unmount);
    expect(immediatelyEffectCount).toBe(1);
    expect(immediatelyEffectUnsubscribedCount).toBe(1);
  });
});

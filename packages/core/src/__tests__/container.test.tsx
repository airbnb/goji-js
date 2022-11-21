import React, { useState, useEffect } from 'react';
import { View } from '..';
import { act } from '../testUtils';
import { render } from './helpers';

describe('AdaptorInstance', () => {
  test('works for mock adaptor config', () => {
    let renderedCount: number;
    let renderedSetCount: (newValue: number) => void;
    let effectCount: number;

    const App = () => {
      const [count, setCount] = useState(0);
      [renderedCount, renderedSetCount] = [count, setCount];
      useEffect(() => {
        effectCount = count;
      }, [count]);

      return <View>count is {count}</View>;
    };

    act(() => {
      render(<App />);
    });
    // @ts-expect-error
    expect(renderedCount).toBe(0);
    // @ts-expect-error
    expect(effectCount).toBe(0);
    act(() => {
      renderedSetCount(10);
      renderedSetCount(20);
    });
    // @ts-expect-error
    expect(renderedCount).toBe(20);
    // @ts-expect-error
    expect(effectCount).toBe(20);
  });
});

import React, { useState } from 'react';
import { act, create } from 'react-test-renderer';
import { View } from '../../..';
import { useOnPageScroll } from '../hooks';
import { GojiProvider } from '../../../components';
import { createEventProxy } from '../../../components/eventProxy';

describe('native lifecycles', () => {
  it('onLoad works', () => {
    let onPageScrollOptions: any;
    const App = () => {
      const [value, setValue] = useState(0);
      useOnPageScroll(options => {
        onPageScrollOptions = options;
        setValue(options.scrollTop);
      });
      return <View>value is {value}</View>;
    };
    const eventProxy = createEventProxy();
    const wrapper = create(
      <GojiProvider container={{ eventProxy } as any}>
        <View className="text">hello, world!</View>
        <App />
      </GojiProvider>,
    );

    expect(wrapper.toJSON()).toMatchSnapshot();

    // trigger onLoad
    const mockOnPageScroll = { scrollTop: 1024 };
    act(() => {
      eventProxy.lifecycleChannel.onPageScroll.emit(mockOnPageScroll);
    });

    expect(onPageScrollOptions).toEqual(mockOnPageScroll);
    expect(wrapper.toJSON()).toMatchSnapshot();
  });
});

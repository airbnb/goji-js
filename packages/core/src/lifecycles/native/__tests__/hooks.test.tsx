import React, { useState, createRef } from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { View } from '../../..';
import { useOnPageScroll } from '../hooks';
import { GojiProvider } from '../../../components';
import { EventProxy } from '../../../components/eventProxy';

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
    const eventProxyRef = createRef<EventProxy>();
    const wrapper = mount(
      <GojiProvider container={{ eventProxyRef } as any}>
        <View className="text">hello, world!</View>
        <App />
      </GojiProvider>,
    );

    expect(wrapper.text()).toContain('hello, world!');
    expect(wrapper.text()).toContain('value is 0');

    // trigger onLoad
    const mockOnPageScroll = { scrollTop: 1024 };
    act(() => {
      eventProxyRef.current!.emitEvent('onPageScroll', mockOnPageScroll);
    });

    expect(onPageScrollOptions).toEqual(mockOnPageScroll);
    expect(wrapper.text()).toContain('value is 1024');
  });
});

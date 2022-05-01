import React from 'react';
import { View } from '@goji/core';
import { render } from '../..';

describe('ByTestId', () => {
  test('getByTestId', () => {
    const App = () => <View testID="a">hello, world!</View>;
    const wrapper = render(<App />);
    const view = wrapper.getByTestId('a');
    expect(view).toBeTruthy();
    expect(view.props.children).toBe('hello, world!');
    expect(() => wrapper.getByTestId('z')).toThrow();
  });
});

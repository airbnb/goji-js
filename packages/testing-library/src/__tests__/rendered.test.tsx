import React from 'react';
import { View, Button, Text } from '@goji/core';
import { render, within } from '..';

describe('rendered', () => {
  test('debug', () => {
    const App = () => (
      <View testID="a">
        <Button onTap={() => {}}>hello</Button>
        <Text className="a b c">world</Text>
      </View>
    );

    const wrapper = render(<App />);
    const log = jest.spyOn(console, 'log').mockImplementation(() => {});
    wrapper.debug(wrapper.getByTestId('a'));
    expect(log).toHaveBeenCalledTimes(1);
    const output = log.mock.calls[0][0];
    expect(typeof output).toBe('string');
    expect(output).toMatchSnapshot();
    log.mockRestore();
  });

  test('within', () => {
    const App = () => (
      <>
        <View testID="a">
          <View testID="z" />
        </View>
        <View testID="b" />
      </>
    );

    const wrapper = render(<App />);
    expect(wrapper.getAllByTestId('z')).toHaveLength(1);
    const viewA = wrapper.getByTestId('a');
    expect(within(viewA).getAllByTestId('z')).toHaveLength(1);
    const viewB = wrapper.getByTestId('b');
    expect(() => within(viewB).getByTestId('z')).toThrow();
  });
});

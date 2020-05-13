import React from 'react';
import { View, Button, Text } from '@goji/core';
import { render } from '..';

describe('rendered', () => {
  const App = () => {
    return (
      <View testID="a">
        <Button onTap={() => {}}>hello</Button>
        <Text className="a b c">world</Text>
      </View>
    );
  };
  test('debug', () => {
    const wrapper = render(<App />);
    const log = jest.spyOn(console, 'log').mockImplementation(() => {});
    wrapper.debug(wrapper.getByTestId('a'));
    expect(log).toHaveBeenCalledTimes(1);
    const output = log.mock.calls[0][0];
    expect(typeof output).toBe('string');
    expect(output).toMatchSnapshot();
    log.mockRestore();
  });
});

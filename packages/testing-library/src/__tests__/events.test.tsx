import React, { useState } from 'react';
import { Button, View, Text, Input, Image } from '@goji/core';
import { render, fireEvent } from '..';

describe('fireEvent', () => {
  test('tap', () => {
    const buttonHandler = jest.fn();
    const App = () => <Button onTap={buttonHandler}>click me</Button>;
    const wrapper = render(<App />);
    fireEvent.tap(wrapper.getByText('click me'));
    expect(buttonHandler).toHaveBeenCalledTimes(1);
    expect(buttonHandler.mock.calls[0][0].target).toBeTruthy();
  });

  test('tap bubbling', () => {
    const viewHandler = jest.fn();
    const textHandler = jest.fn(e => {
      e.stopPropagation();
    });
    const buttonHandler = jest.fn();
    const App = () => (
      <View onTap={viewHandler}>
        <Text onTap={textHandler}>
          <Button onTap={buttonHandler}>click me</Button>
        </Text>
      </View>
    );
    const wrapper = render(<App />);
    fireEvent.tap(wrapper.getByText('click me'));
    expect(viewHandler).toHaveBeenCalledTimes(0);
    expect(textHandler).toHaveBeenCalledTimes(1);
    expect(buttonHandler).toHaveBeenCalledTimes(1);
  });

  test('input', () => {
    const App = () => {
      const [value, setValue] = useState('hello');

      return <Input value={value} onInput={e => setValue(e.detail.value)} testID="input" />;
    };
    const wrapper = render(<App />);
    expect(wrapper.getByTestId('input').props.value).toBe('hello');
    fireEvent.input(wrapper.getByTestId('input'), 'world');
    expect(wrapper.getByTestId('input').props.value).toBe('world');
  });

  test('load and error', () => {
    let state = 'hello';

    const App = ({ callback }: { callback: (s: string) => void }) => (
      <Image
        testID="image"
        src="test.jpg"
        onLoad={() => callback('ok')}
        onError={() => callback('error')}
      />
    );
    const wrapper = render(
      <App
        callback={v => {
          state = v;
        }}
      />,
    );
    expect(state).toBe('hello');
    fireEvent.load(wrapper.getByTestId('image'));
    expect(state).toBe('ok');
    fireEvent.error(wrapper.getByTestId('image'));
    expect(state).toBe('error');
  });
});

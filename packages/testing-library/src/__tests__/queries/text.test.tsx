import React, { useState } from 'react';
import { View, Button } from '@goji/core';
import { render, fireEvent } from '../..';

jest.setTimeout(10000);

describe('ByText works', () => {
  test('getByText', () => {
    const App = () => {
      return (
        <>
          <View className="a">a</View>
          <View className="b">b</View>
          <View className="c">c</View>
        </>
      );
    };

    const wrapper = render(<App />);
    expect(wrapper.getByText('a')).toBeTruthy();
    expect(wrapper.getByText('b').props.children).toBe('b');
    expect(() => wrapper.getByText('z')).toThrow();
  });

  test('getAllByText', () => {
    const App = () => {
      return (
        <>
          <View className="a1">a</View>
          <View className="a2">a</View>
          <View className="a3">a</View>
        </>
      );
    };
    const wrapper = render(<App />);
    expect(wrapper.getAllByText('a')).toHaveLength(3);
    expect(() => wrapper.getAllByText('z')).toThrow();
  });

  test('queryByText', () => {
    const App = () => {
      return (
        <>
          <View className="a">a</View>
          <View className="b">b</View>
          <View className="c">c</View>
        </>
      );
    };

    const wrapper = render(<App />);
    expect(wrapper.queryByText('a')).toBeTruthy();
    expect(wrapper.queryByText('b').props.children).toBe('b');
    expect(wrapper.queryByText('z')).toBe(null);
  });

  test('queryAllByText', () => {
    const App = () => {
      return (
        <>
          <View className="a1">a</View>
          <View className="a2">a</View>
          <View className="a3">a</View>
        </>
      );
    };
    const wrapper = render(<App />);
    expect(wrapper.queryAllByText('a')).toHaveLength(3);
    expect(wrapper.queryAllByText('z')).toHaveLength(0);
  });

  test('findByText', async () => {
    const App = () => {
      const [show, setShow] = useState(false);

      return (
        <>
          <Button
            onTap={() => {
              setTimeout(() => {
                setShow(true);
              }, 500);
            }}
          >
            click me
          </Button>
          {show && <View>show</View>}
        </>
      );
    };

    const wrapper = render(<App />);
    await expect(wrapper.findByText('show')).rejects.toBeTruthy();

    fireEvent.tap(wrapper.getByText('click me'));
    expect(await wrapper.findByText('show')).toBeTruthy();
  });
});

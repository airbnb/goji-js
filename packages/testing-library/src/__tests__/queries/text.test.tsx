import React, { useState } from 'react';
import { View, Button, Text } from '@goji/core';
import { render, fireEvent } from '../..';

jest.setTimeout(10000);

describe('ByText works', () => {
  test('getByText', () => {
    const App = () => (
      <>
        <View className="a">a</View>
        <View className="b">b</View>
        <View className="c">c</View>
      </>
    );

    const wrapper = render(<App />);
    expect(wrapper.getByText('a')).toBeTruthy();
    expect(wrapper.getByText('b').props.children).toBe('b');
    expect(() => wrapper.getByText('z')).toThrow();
  });

  test('getAllByText', () => {
    const App = () => (
      <>
        <View className="a1">a</View>
        <View className="a2">a</View>
        <View className="a3">a</View>
      </>
    );
    const wrapper = render(<App />);
    expect(wrapper.getAllByText('a')).toHaveLength(3);
    expect(() => wrapper.getAllByText('z')).toThrow();
  });

  test('queryByText', () => {
    const App = () => (
      <>
        <View className="a">a</View>
        <View className="b">b</View>
        <View className="c">c</View>
      </>
    );

    const wrapper = render(<App />);
    expect(wrapper.queryByText('a')).toBeTruthy();
    expect(wrapper.queryByText('b').props.children).toBe('b');
    expect(wrapper.queryByText('z')).toBe(null);
  });

  test('queryAllByText', () => {
    const App = () => (
      <>
        <View className="a1">a</View>
        <View className="a2">a</View>
        <View className="a3">a</View>
      </>
    );
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

  test('options.exact', () => {
    const App = () => <View className="a">hello, world!</View>;

    const wrapper = render(<App />);
    expect(() => wrapper.getByText('llo, world')).toThrow();
    expect(wrapper.getByText('llo, world', { exact: false })).toBeTruthy();
    expect(() => wrapper.getByText('llo, world', { exact: true })).toThrow();

    // ignore case
    expect(() => wrapper.getByText('hEllO, WoRlD!')).toThrow();
    expect(wrapper.getByText('hEllO, WoRlD!', { exact: false })).toBeTruthy();
  });

  test('options.trim', () => {
    const App = () => (
      <View className="a">
        {'\t\n'} hello, world! {'\t\n'}
      </View>
    );

    const wrapper = render(<App />);
    expect(wrapper.getByText('hello, world!')).toBeTruthy();
    expect(() => wrapper.getByText('hello, world!', { trim: false })).toThrow();
    expect(wrapper.getByText('hello, world!', { trim: true })).toBeTruthy();
  });

  test('options.collapseWhitespace', () => {
    const App = () => <View className="a">hello,{'\n\n'}world!</View>;

    const wrapper = render(<App />);
    expect(wrapper.getByText('hello, world!')).toBeTruthy();
    expect(wrapper.getByText('hello,\n\nworld!', { collapseWhitespace: false })).toBeTruthy();
    expect(wrapper.getByText('hello, world!', { collapseWhitespace: true })).toBeTruthy();
  });

  test('TextMatch is RegExp', () => {
    const App = () => <View className="a">hello, world!</View>;

    const wrapper = render(<App />);
    expect(wrapper.getByText(/world/)).toBeTruthy();
    expect(wrapper.getByText(/^hello/)).toBeTruthy();
    expect(wrapper.getByText(/^HELLO/i)).toBeTruthy();
  });

  test('TextMatch is function', () => {
    const App = () => (
      <View className="a">
        hello, <Text>world!</Text>
      </View>
    );

    const wrapper = render(<App />);
    expect(wrapper.getByText(text => text.includes('world'))).toBeTruthy();
    expect(
      wrapper.getByText((text, node) => text.includes('world') && node.type === 'text'),
    ).toBeTruthy();
  });
});

import React, { useState } from 'react';
import { ReactTestInstance } from 'react-test-renderer';
import { Button, View } from '@goji/core';
import { render, fireEvent, act } from '..';
import { waitFor, waitForElement } from '../wait';

describe('test', () => {
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

  beforeEach(() => {
    jest.setTimeout(10000);
  });

  test('test', async () => {
    const wrapper = render(<App />);
    fireEvent.tap(wrapper.getByText('click me'));
    await waitFor(() => expect(wrapper.getByText('show')).toBeTruthy());
  });

  test('waitForElement', async () => {
    const wrapper = render(<App />);
    fireEvent.tap(wrapper.getByText('click me'));
    let element: ReactTestInstance;
    await act(async () => {
      element = await waitForElement(() => wrapper.getByText('show'));
    });
    expect(element!).toBeTruthy();
    expect(element!.props.children).toBe('show');
  });
});

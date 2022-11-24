import React, { useState } from 'react';
import { createPortal } from '..';
import { View } from '../..';
import { render } from '../../__tests__/helpers';
import { act } from '../../testUtils';
import { ElementNodeDevelopment } from '../../reconciler/instance';

describe('createPortal', () => {
  test('works', () => {
    const Content = () => createPortal(<View>Content</View>);
    const App = () => (
      <View>
        <View>title</View>
        <Content />
      </View>
    );
    const wrapper = render(<App />);
    expect((wrapper.getContainer() as { meta: ElementNodeDevelopment }).meta.children.length).toBe(
      2,
    );
  });

  test('works in condition', () => {
    let showPortal: Function;
    const App = () => {
      const [show, setShow] = useState(false);
      showPortal = () => setShow(true);

      return (
        <View>
          <View>title</View>
          {show && createPortal(<View>Content</View>)}
        </View>
      );
    };
    const wrapper = render(<App />);
    expect((wrapper.getContainer() as { meta: ElementNodeDevelopment }).meta.children.length).toBe(
      1,
    );

    const spy = jest.spyOn(global.console, 'error');
    act(() => {
      showPortal();
    });
    expect((wrapper.getContainer() as { meta: ElementNodeDevelopment }).meta.children.length).toBe(
      2,
    );
    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });
});

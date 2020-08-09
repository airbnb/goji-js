import React from 'react';
import { render, fireEvent, act } from '@goji/testing-library';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { Footer } from '../Footer';
import { todoReducer } from '../../duck/todo';

describe('Footer', () => {
  it('1 item', () => {
    const store = createStore(todoReducer, {
      todos: [
        {
          text: 'hello',
          completed: false,
          id: 0,
        },
      ],
      visibilityFilter: 'All',
    });
    const wrapper = render(
      <Provider store={store}>
        <Footer />
      </Provider>,
    );
    expect(wrapper.getByText('1 item')).toBeTruthy();
  });

  it('2 items', () => {
    const store = createStore(todoReducer, {
      todos: [
        {
          text: 'hello',
          completed: false,
          id: 0,
        },
        {
          text: 'world',
          completed: false,
          id: 0,
        },
      ],
      visibilityFilter: 'All',
    });
    const wrapper = render(
      <Provider store={store}>
        <Footer />
      </Provider>,
    );
    expect(wrapper.getByText('2 items')).toBeTruthy();
  });

  it.only('clear works', () => {
    const store = createStore(todoReducer, {
      todos: [
        {
          text: 'hello',
          completed: true,
          id: 0,
        },
        {
          text: 'world',
          completed: false,
          id: 0,
        },
      ],
      visibilityFilter: 'All',
    });
    const wrapper = render(
      <Provider store={store}>
        <Footer />
      </Provider>,
    );
    const clear = wrapper.getByText('Clear');
    wrapper.debug(clear);
    act(() => {
      fireEvent.tap(clear);
    });
    expect(wrapper.getByText('1 item')).toBeTruthy();
  });
});

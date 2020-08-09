import React from 'react';
import { render } from '@goji/core';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { MainSection } from '../../components/MainSection';
import { todoReducer } from '../../duck/todo';

const store = createStore(todoReducer);

const TodoList = () => (
  <Provider store={store}>
    <MainSection />
  </Provider>
);

render(<TodoList />);

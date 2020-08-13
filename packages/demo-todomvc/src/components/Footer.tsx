import React from 'react';
import cx from 'classnames';
import { View } from '@goji/core';
import { useDispatch, useSelector } from 'react-redux';
import { FilterLink } from './Link';
import { clearCompletedTodos, StoreState, Todo } from '../duck/todo';
import styles from './Footer.css';

const FILTER_TITLES = ['All', 'Active', 'Completed'];

export const Footer = () => {
  const dispatch = useDispatch();
  const todos = useSelector((store: StoreState) => store.todos);
  const todosCount = todos.length;
  const completedCount = todos.filter((todo: Todo) => todo.completed).length;
  const activeCount = todosCount - completedCount;
  const itemWord = activeCount <= 1 ? 'item' : 'items';

  if (!todosCount) {
    return null;
  }

  return (
    <View className={styles.footer}>
      <View className={styles.todoCount}>
        {activeCount} {itemWord}
      </View>
      <View className={styles.filters}>
        {FILTER_TITLES.map((filter: string) => (
          <FilterLink key={filter} filter={filter}>
            {filter}
          </FilterLink>
        ))}
      </View>
      <View
        className={cx(styles.clearCompleted, completedCount && styles.showClear)}
        onTap={() => dispatch(clearCompletedTodos())}
      >
        Clear
      </View>
    </View>
  );
};

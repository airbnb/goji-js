import React from 'react';
import { View } from '@goji/core';
import { css, cx } from 'linaria';
import { useDispatch, useSelector } from 'react-redux';
import { FilterLink } from './Link';
import { clearCompletedTodos, StoreState, Todo } from '../duck/todo';

const FILTER_TITLES = ['All', 'Active', 'Completed'];

const footer = css`
  color: #777;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  font-weight: 400;
  padding: 15rpx 30rpx;
  text-align: center;
  border-top: 1rpx solid #e6e6e6;

  &::before {
    content: '';
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    height: 50rpx;
    overflow: hidden;
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2), 0 8px 0 -3px #f6f6f6,
      0 9px 1px -3px rgba(0, 0, 0, 0.2), 0 16px 0 -6px #f6f6f6, 0 17px 2px -6px rgba(0, 0, 0, 0.2);
  }
`;

const todoCount = css`
  width: 100rpx;
`;

const clearCompleted = css`
  float: right;
  position: relative;
  line-height: 20rpx;
  text-decoration: none;
  cursor: pointer;
  opacity: 0;
`;

const filters = css`
  z-index: 100;
  display: flex;
  flex-direction: row;
`;

const showClear = css`
  opacity: 1;
  z-index: 100;
`;

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
    <View className={footer}>
      <View className={todoCount}>
        {activeCount} {itemWord}
      </View>
      <View className={filters}>
        {FILTER_TITLES.map((filter: string) => (
          <FilterLink key={filter} filter={filter}>
            {filter}
          </FilterLink>
        ))}
      </View>
      <View
        className={cx(clearCompleted, completedCount && showClear)}
        onTap={() => dispatch(clearCompletedTodos())}
      >
        Clear
      </View>
    </View>
  );
};

import React from 'react';
import { useDispatch } from 'react-redux';
import { View, Subtree } from '@goji/core';
import { css, cx } from 'linaria';
import { Checkbox } from './Checkbox';
import { deleteTodo, completeTodo, Todo } from '../duck/todo';

interface Props {
  todo: Todo;
}

const todoItem = css`
  font-size: 24rpx;
  border-bottom: 1rpx solid #ededed;
  height: 100rpx;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 20rpx;
`;

const todoLabel = css`
  word-break: break-all;
  padding: 15rpx;
  line-height: 1.2;
  transition: color 0.4s;
  display: inline-flex;
  flex: 1;
`;

const completedLabel = css`
  color: #d9d9d9;
  text-decoration: line-through;
`;

const toggle = css`
  width: 60rpx;
  height: 60rpx;
`;

const destroy = css`
  display: none;
  flex: 0;
  color: #cc9a9a;
  margin: 20rpx;
  font-size: 60rpx;
  transition: color 0.2s ease-out;
`;

const completed = css`
  .${destroy} {
    display: inline-flex;
  }
`;

export const TodoItem = ({ todo }: Props) => {
  const dispatch = useDispatch();

  return (
    <Subtree>
      <View className={cx(todo.completed && completed, todoItem)}>
        <Checkbox
          className={toggle}
          checked={todo.completed}
          onChange={() => dispatch(completeTodo(todo.id))}
        />
        <View className={cx(todo.completed && completedLabel, todoLabel)}>{todo.text}</View>
        <View className={destroy} onTap={() => dispatch(deleteTodo(todo.id))}>
          ×
        </View>
      </View>
    </Subtree>
  );
};

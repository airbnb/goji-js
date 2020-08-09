import React from 'react';
import cx from 'classnames';
import { useDispatch } from 'react-redux';
import { View, Subtree } from '@goji/core';
import { Checkbox } from './Checkbox';
import { deleteTodo, completeTodo, Todo } from '../duck/todo';
import styles from './TodoItem.css';

interface Props {
  todo: Todo;
}

export const TodoItem = ({ todo }: Props) => {
  const dispatch = useDispatch();

  return (
    <Subtree>
      <View className={cx(todo.completed && styles.completed, styles.todoItem)}>
        <Checkbox
          className={styles.toggle}
          checked={todo.completed}
          onChange={() => dispatch(completeTodo(todo.id))}
        />
        <View className={cx(todo.completed && styles.completedLabel, styles.todoLabel)}>
          {todo.text}
        </View>
        <View className={styles.destroy} onTap={() => dispatch(deleteTodo(todo.id))}>
          ×
        </View>
      </View>
    </Subtree>
  );
};

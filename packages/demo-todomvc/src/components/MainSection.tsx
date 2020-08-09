import React from 'react';
import { useDispatch } from 'react-redux';
import { View } from '@goji/core';
import { Footer } from './Footer';
import { TodoList } from './TodoList';
import { addTodo } from '../duck/todo';
import styles from './MainSection.css';
import { TodoTextInput } from './TodoTextInput';

export const MainSection = () => {
  const dispatch = useDispatch();

  return (
    <View className={styles.container}>
      <View className={styles.todosHeader}>todos</View>
      <View className={styles.main}>
        <TodoTextInput
          onSave={(text: string) => {
            if (text.length !== 0) {
              dispatch(addTodo(text));
            }
          }}
          placeholder="What needs to be done?"
        />
        <TodoList />
        <Footer />
      </View>
    </View>
  );
};

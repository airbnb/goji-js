import React from 'react';
import { useDispatch } from 'react-redux';
import { View } from '@goji/core';
import { css } from 'linaria';
import { Footer } from './Footer';
import { TodoList } from './TodoList';
import { addTodo } from '../duck/todo';
import { TodoTextInput } from './TodoTextInput';

const main = css`
  z-index: 2;
  border-top: 1px solid #e6e6e6;
  font-size: 26rpx;
`;

const todosHeader = css`
  padding: 10px 0;
  width: 100%;
  font-size: 100px;
  font-weight: 100;
  text-align: center;
  color: rgba(175, 47, 47, 0.15);
  -webkit-text-rendering: optimizeLegibility;
  -moz-text-rendering: optimizeLegibility;
  text-rendering: optimizeLegibility;
  background: #f5f5f5;
`;

const container = css`
  background: #fff;
  margin: 0 0 40px 0;
  position: relative;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2), 0 25px 50px 0 rgba(0, 0, 0, 0.1);
`;

export const MainSection = () => {
  const dispatch = useDispatch();

  return (
    <View className={container}>
      <View className={todosHeader}>todos</View>
      <View className={main}>
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

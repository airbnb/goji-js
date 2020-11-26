import React, { useState, useCallback } from 'react';
import { View, Input } from '@goji/core';
import { css } from 'linaria';

interface Props {
  onSave: (text: string) => void;
  placeholder: string;
}

const newTodo = css`
  display: flex;
  flex-direction: row;
  align-items: center;
  font-size: 24px;
  font-style: italic;
  font-weight: 200;
  line-height: 1.4em;
  height: 100rpx;
  color: inherit;
  padding: 35rpx 35rpx 35rpx 90rpx;
  border: none;
  box-shadow: inset 0 -2px 1px rgba(0, 0, 0, 0.03);
  box-sizing: border-box;
  background: rgba(0, 0, 0, 0.003);
`;

const newTodoInput = css`
  font-size: 26rpx;
`;

export const TodoTextInput = ({ placeholder, onSave }: Props) => {
  const [text, setText] = useState('');
  const [id, setId] = useState(0);
  const onConfirm = useCallback(() => {
    onSave(text);
    setId(id + 1);
    setText('');
  }, [id, onSave, text]);

  return (
    <View className={newTodo}>
      <Input
        testID="todo-text-input"
        className={newTodoInput}
        type="text"
        placeholder={placeholder}
        onInput={(e: any) => {
          setText(e.detail.value);
        }}
        onConfirm={onConfirm}
        value={text}
      />
    </View>
  );
};

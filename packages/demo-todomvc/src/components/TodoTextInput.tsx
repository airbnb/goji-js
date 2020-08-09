import React, { useState, useCallback } from 'react';
import { View, Input } from '@goji/core';
import styles from './TodoTextInput.css';

interface Props {
  onSave: (text: string) => void;
  placeholder: string;
}

export const TodoTextInput = ({ placeholder, onSave }: Props) => {
  const [text, setText] = useState('');
  const [id, setId] = useState(0);
  const onConfirm = useCallback(() => {
    onSave(text);
    setId(id + 1);
    setText('');
  }, [id, onSave, text]);

  return (
    <View className={styles.newTodo}>
      <Input
        testID="todo-text-input"
        className={styles.newTodoInput}
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

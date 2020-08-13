import React from 'react';
import { useSelector } from 'react-redux';
import { TodoItem } from './TodoItem';
import { StoreState } from '../duck/todo';

export const TodoList = () => {
  const { todos, visibilityFilter } = useSelector((store: StoreState) => store);
  let filteredTodos;

  switch (visibilityFilter) {
    case 'All':
      filteredTodos = todos;
      break;
    case 'Completed':
      filteredTodos = todos.filter(t => t.completed);
      break;
    case 'Active':
      filteredTodos = todos.filter(t => !t.completed);
      break;
    default:
      throw new Error(`Unknown filter: ${visibilityFilter}`);
  }

  return (
    <>
      {filteredTodos.map(todo => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </>
  );
};

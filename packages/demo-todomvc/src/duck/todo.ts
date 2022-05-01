import { Action } from 'redux';

export type VisibilityFilterState = 'All' | 'Active' | 'Completed';

export interface Todo {
  text: string;
  completed: boolean;
  id: number;
}

export interface StoreState {
  todos: Todo[];
  visibilityFilter: VisibilityFilterState;
}

export interface ActionPayload extends Action {
  payload: any;
}

// Actions
export const addTodo = (text: string) => ({
  type: 'ADD_TODO',
  payload: { text },
});

export const deleteTodo = (id: number) => ({
  type: 'DELETE_TODO',
  payload: { id },
});

export const editTodo = (id: number, text: string) => ({
  type: 'EDIT_TODO',
  payload: { id, text },
});

export const completeTodo = (id: number) => ({
  type: 'COMPLETE_TODO',
  payload: { id },
});

export const completeAllTodos = () => ({
  type: 'COMPLETE_ALL_TODO',
});

export const clearCompletedTodos = () => ({
  type: 'CLEAR_ALL_TODO',
});

export const setVisibilityFilter = (visibilityFilter: VisibilityFilterState) => ({
  type: 'SET_VISIBILITY_FILTER',
  payload: { visibilityFilter },
});

const INITIAL_STATE: StoreState = {
  todos: [
    {
      text: '1',
      completed: false,
      id: 0,
    },
    {
      text: '2',
      completed: true,
      id: 1,
    },
    {
      text: '3',
      completed: false,
      id: 2,
    },
  ],
  visibilityFilter: 'All',
};

export const todoReducer = (
  // eslint-disable-next-line default-param-last
  state: StoreState = INITIAL_STATE,
  { type, payload }: ActionPayload,
) => {
  const { todos } = state;
  switch (type) {
    case 'ADD_TODO':
      return {
        ...state,
        todos: [
          ...todos,
          {
            id: todos.reduce((maxId, todo) => Math.max(todo.id, maxId), -1) + 1,
            completed: false,
            text: payload.text,
          },
        ],
      };
    case 'DELETE_TODO':
      return {
        ...state,
        todos: todos.filter(todo => todo.id !== payload.id),
      };
    case 'EDIT_TODO':
      return {
        ...state,
        todos: todos.map(todo => (todo.id === payload.id ? { ...todo, text: payload.text } : todo)),
      };
    case 'COMPLETE_TODO':
      return {
        ...state,
        todos: todos.map(todo =>
          todo.id === payload.id ? { ...todo, completed: !todo.completed } : todo,
        ),
      };
    case 'COMPLETE_ALL_TODO':
      return {
        ...state,
        todos: todos.map(todo => ({
          ...todo,
          completed: true,
        })),
      };
    case 'CLEAR_ALL_TODO':
      return {
        ...state,
        todos: todos.filter(todo => !todo.completed),
      };
    case 'SET_VISIBILITY_FILTER':
      return {
        ...state,
        visibilityFilter: payload.visibilityFilter,
      };
    default:
      return state;
  }
};

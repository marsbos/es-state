import { useState } from '../src/es-state.js';
import { directive } from '../node_modules/lit-html/lit-html.js';

export const observers = useState(
  { 
    store: {
      counter: 3, selectedTodo: undefined, todos: [],
    },
    reducers: {
      getTodos: selector => selector({ todos: (state, action) => ({...state, todos: [...action.payload]})}),
      addTodo: selector => selector({ todos: (state, action) => ({...state, todos: [...state.todos, action.payload]})}),
      selectTodo: selector => selector({ selectedTodo: (state, action) => ({...state, selectedTodo: action.payload})}),
      increment: selector => selector({ counter: (state, action) => ({...state, counter: state.counter + action.payload })}),
    },
  },
);

export const observeTodos = observers.todos;
export const observeSelectedTodo = observers.selectedTodo;
export const observeCounter = observers.counter;

export const commitCallback = directive((committer) => (part) => {
  committer((value) => {
    part.setValue(value); 
    part.commit();
  });
});



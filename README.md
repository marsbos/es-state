# es-state
Easy state management, inspired by Redux and React.  

### Features
* Compact syntax; create store and reducers in one function call.
* An actions proxy which allows dispatching actions from everywhere.
* Observe only slices of your state instead of invoking all observers on a state change.
* Optional lit-element/lit-html directive for easy updating from an observer.

### Examples
`todos-state.js`
```js
import { useState } from '../src/es-state.js';
// Here we define our store & reducers:
export const myObservers = useState(
  { 
    store: {
      counter: 3, selectedTodo: undefined, todos: [],
    },
    reducers: {
      getTodos: slice => slice({ todos: (state, action) => ({...state, todos: [...action.payload]})}),
      addTodo: slice => slice({ todos: (state, action) => ({...state, todos: [...state.todos, action.payload]})}),
      selectTodo: slice => slice({ selectedTodo: (state, action) => ({...state, selectedTodo: action.payload})}),
      increment: slice => slice({ counter: (state, action) => ({...state, counter: state.counter + action.payload })}),
    },
  },
);
// From returned object 'myObservers', export the observers per slice:
export const observeTodos = myObservers.todos;
export const observeSelectedTodo = myObservers.selectedTodo;
export const observeCounter = myObservers.counter;
```

### Usage (lit-element/lit-html)
`todo-app.js`
```js
import { observeTodos, observeCounter, observeSelectedTodo } from  '../state/todos-state.js';
import { commitCallback } from '../src/lit-commit-callback.js';
import './todo-add.js';

// You can add as many observers to an observer as you like.

// Whenever 'counter' changes, only the 'observeCounter' will be called.
// Likewise, when 'todos' changes, only observer 'observeTodos' will be called.
...
 render() {
    return html`
      <todo-add></todo-add>
      ${commitCallback(commit => {
        observeCounter(state => commit(html`<h3>${state.counter}</h3>`))
      })}
      ${commitCallback(commit => {
        observeTodos(state => commit(state.todos.map(todo => html`<p>${todo.title}</p>`)))
      })}
    `;
  }
```

`todo-add.js`
```js
import { actions } from '../src/es-state.js';
...
// We import 'actions', so we can 'dispatch' whatever action we like.
// Actions proxy finds the reducers which are registered for the action.
// Note that actions are not bound to one 'useState', they can access all 'useStates'.

render() {
  return html`
    <div>
    <button @click="${_ => 
      actions.addTodo({ title: 'My new todo' })
      }">Add</button>
    <button @click="${_ => 
      actions.increment(2)
    }">Increment</button>
    <button @click="${_ => 
      actions.selectTodo({ title: 'The selected todo' })
    }">Select Todo</button>
    </div>
  `;
}
```



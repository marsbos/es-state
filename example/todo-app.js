import { LitElement } from '../node_modules/lit-element/lit-element.js';
import { html } from '../node_modules/lit-html/lit-html.js';
import { observeTodos, observeCounter, observeSelectedTodo } from  './todo-state.js';
import { actions } from '../src/es-state.js';
import { commitCallback } from '../src/lit-commit-callback.js';
import './todo-add.js';

observeCounter(state => console.log('Counter observer', state.counter));
observeSelectedTodo(state => console.log('SelectedTodo obs:', state.selectedTodo));
observeTodos(state => console.log('Todos obs:', state.todos));

customElements.define('todo-app', class extends LitElement {

  connectedCallback() {
    actions.getTodos(fetch('/todos'))(response => response.json());
    super.connectedCallback();
  }

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
});

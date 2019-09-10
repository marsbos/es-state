import { LitElement } from '../node_modules/lit-element/lit-element.js';
import { html } from '../node_modules/lit-html/lit-html.js';
import { actions } from '../src/es-state.js';
import '../node_modules/chance/chance.js';

customElements.define('todo-add', class extends LitElement {
  render() {
    return html`
      <div>
      <button @click="${_ => 
        actions.addTodo({ title: chance.sentence({ words: 3 })})
        }">Add</button>
      <button @click="${_ => 
        actions.increment(2)
      }">Increment</button>
      <button @click="${_ => 
        actions.selectTodo({title: 'Hi Ia m selected'})
      }">Select Todo</button>
      </div>
    `;
  }
});

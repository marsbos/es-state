const notifyObservers = (slice, observers, state) => {
  if (!observers[slice]) return;
  observers[slice].forEach(obs => obs.apply(null, [state]))
};

const stateProducer = () => {
  function _producer(state, slice, observers = {}) {
    notifyObservers(slice, observers, {...state});
    return {
      value: state,
      observers,
      unobserve(slice, observer) {
        this.observers[slice] = this.observers[slice].filter(obs => obs !== observer);
      },
      observe(slice, observer) {
        if (!this.observers[slice]) {
          this.observers[slice] = [];
        }
        this.observers[slice].push(observer);
        observer({...state});
        return () => {
          this.observers[slice] = this.observers[slice].filter(obs => obs !== observer);
        }
      },
      next(nextState, statePart) {
        return _producer(nextState, statePart, this.observers);
      },
    };
  }
  return state => _producer(state);
};

const dispatchAction = (() => {
  const _registry = {};
  return {
    on(action, reducer) {
      _registry[action] = _registry[action]?[..._registry[action], reducer]:[reducer];
    },
    dispatch(action) {
      _registry[action.type].forEach( reducer => {
        reducer(action);
      });
    },
    hasAction(action) {
      return Object.keys(_registry).find(key => key.toLowerCase()===action.toLowerCase());
    },
  }
})();

const createStore = ({ store, reducers } = {}) => {
  let state = stateProducer()(store);
  const observers = {};

  const createObserverForSlice = statePart => obs => {
    return state.observe(statePart, obs);
  };

  const reduce = (statePart, reducer) => action => {
    state = state.next(reducer(state.value, action), statePart);
  };
  for (const action in reducers) {
    dispatchAction.on(action, reducers[action](reducerObj => {
      const statePart = Object.keys(reducerObj)[0];
      const reducer = reducerObj[statePart];
      const reducerFunc = reduce(statePart, reducer);
      observers[statePart] = createObserverForSlice(statePart);
      return reducerFunc;
    }));
  }
  return observers;
};

export const useState = ({ store, reducers } = {}) => createStore({ store, reducers });

export const actions = (() => {
  return new Proxy({}, {
    get(target, key, receiver) {
      if (dispatchAction.hasAction(key)) {
        return promiseOrNot => {
          if (promiseOrNot instanceof Promise) {
            return async (promiseCb) => {
              const response = await promiseOrNot;
              const json = await promiseCb(response);
              dispatchAction.dispatch({ type: key, payload: json});
            }
          }
          dispatchAction.dispatch.apply(null, [{type: key, payload: promiseOrNot}]);
        }
      } else {
        return args => args;
      }
    },
  });
})();

export const dispatch = ({ type, payload } = action) => dispatchAction.dispatch({ type, payload });

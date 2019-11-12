import { routerMiddleware } from 'react-router-redux';
import { applyMiddleware, compose, createStore } from 'redux';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger'
import history from './history';
import reducers from './reducers';
import {projectMiddleware} from "./projects/project-middleware"

let middleware = [
  thunk,
  projectMiddleware
];

// add redux logger for non production env
if(process.env.NODE_ENV !== "production"){
  middleware.push(createLogger({
    collapsed: true,
    diff: true //this is alpha - might slow down the app
  }))
}

export default (initialState = {}) => {
   middleware = applyMiddleware(...middleware, routerMiddleware(history));

  if (process.env.NODE_ENV !== 'production') {
    const devToolsExtension = window.devToolsExtension;
    if (typeof devToolsExtension === 'function') {
      middleware = compose(middleware, devToolsExtension());
    }
  }

  const store = createStore(reducers, initialState, middleware);

  if (module.hot) {
    module.hot.accept('./reducers', () => {
      store.replaceReducer(require('./reducers').default);
    });
  }

  return store;
};

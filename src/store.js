import { routerMiddleware } from 'react-router-redux';
import { applyMiddleware, compose, createStore } from 'redux';
import thunk from 'redux-thunk';
import history from './history';
import reducers from './reducers';
import { projectMiddleware } from './projects/project-middleware';

let middleware = [thunk, projectMiddleware];

// TODO!! WARNING - UNCOMMENT THIS BUT DONT COMMIT THIS - THIS REALLY SLOWS DOWN THE APP FOR DEVELOPERS
// add redux logger for non production env
// if(process.env.NODE_ENV !== "production"){
//   import { createLogger } from 'redux-logger'
//   middleware.push(createLogger({
//     collapsed: true,
//     diff: true
//   }))
// }

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

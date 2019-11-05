import './views/styles/styles.css';

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';

import { initAuth } from './auth';
import { initProject } from './projects/initializer';
import history from './history';
import configureStore from './store';
import /*registerServiceWorker, */{ unregister } from './utils/register-service-worker';
import App from './views/app';
import { initializeApp } from './config/app-init';

const store = configureStore();
const rootElement = document.getElementById('root');


function render(Component) {
  ReactDOM.render(
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <div>
          <Component/>
        </div>
      </ConnectedRouter>
    </Provider>,
    rootElement
  );
}


initializeApp();

if (module.hot) {
  module.hot.accept('./views/app', () => {
    render(require('./views/app').default);
  })
}


//registerServiceWorker();
unregister();




initAuth(store.dispatch)
  .then(() => {
      render(App);
      initProject(store.dispatch);
    }
  )
  .catch(error => console.error(error));

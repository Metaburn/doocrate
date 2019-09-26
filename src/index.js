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
import './i18n.js';

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


if (module.hot) {
  module.hot.accept('./views/app', () => {
    render(require('./views/app').default);
  })
}


//registerServiceWorker();
unregister();


// TODO - this is not being called when the user is signed in / signed up for the first time
// TODO Only after refresh
initAuth(store.dispatch)
  .then(() => {
      render(App);
      initProject(store.dispatch);
    }
  )
  .catch(error => console.error(error));

//
// Renders app
//

import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';

import App from './components/App/App.js';
import ErrorBoundary from './components/App/ErrorBoundary';
import store from './configureStore';

import * as serviceWorker from './serviceWorker';

ReactDOM.render(
  <Provider store={store}>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </Provider>,
  document.getElementById('root')
);

serviceWorker.unregister();

//
// Configures redux store
//

import { createStore, combineReducers, compose, applyMiddleware } from 'redux';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import { createBrowserHistory } from 'history';

import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';

import auth from './components/Auth/AuthReducer.js';
import connection from './components/Connection/ConnectionReducer.js';
import cat from './components/Cat/CatReducer.js';

export const history = createBrowserHistory();
const initialState = {};

const reducers = combineReducers({
  router: connectRouter(history), // synchronize router state with redux
  auth,
  connection,
  cat
});

// redux devtools extension
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const logger = createLogger({
  collapsed: true,
  logErrors: false,
  diff: true
});

const store = createStore(
  reducers,
  initialState,
  composeEnhancers(applyMiddleware(routerMiddleware(history), thunk, logger))
);

export default store;

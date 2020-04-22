import { createStore, applyMiddleware, Store, Middleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension/logOnlyInProduction';
import { routerMiddleware } from 'connected-react-router';
import thunk from 'redux-thunk';
import history from '../routes/history';
import createRootReducer from '../reducers';

let store: Store;
const middlewares: Middleware[] = [];
const configureStore = (initialState?: any): Store => {
  if (store) {
    return store;
  }
  middlewares.push(routerMiddleware(history));
  middlewares.push(thunk);
  if ('development' === process.env.NODE_ENV) {
    const { logger } = require('redux-logger'); // eslint-disable-line
    middlewares.push(logger);
  }

  const composeEnhancers = composeWithDevTools({
    // options like actionSanitizer, stateSanitizer
  });

  store = createStore(
    createRootReducer(history),
    initialState,
    composeEnhancers(applyMiddleware(...middlewares))
  );

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      // const nextRootReducer = require('../reducers').default; // eslint-disable-line
      store.replaceReducer(createRootReducer(history));
    });
  }
  return store;
};

export default configureStore;

import {
  createStore,
  applyMiddleware,
} from 'redux';
import {
  routerMiddleware,
} from 'react-router-redux';
import thunk from 'redux-thunk';
import reducers from 'frontend/reducers';

export default function configureStore(browserHistory) {
  const reduxRouterMiddleware = routerMiddleware(browserHistory);
  return createStore(reducers, applyMiddleware(reduxRouterMiddleware, thunk));
}

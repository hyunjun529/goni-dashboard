import React from 'react';
import { render } from 'react-dom';
import { Router, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import { Provider } from 'react-redux';
import routes from 'frontend/routes';
import configureStore from 'frontend/util/redux/createStore';

const appContainer = document.getElementById('app');
const store = configureStore(browserHistory);
const history = syncHistoryWithStore(browserHistory, store);

function run() {
  render(
    (
      <Provider store={store}>
        <Router history={history} routes={routes(store)} />
      </Provider>
    ),
    appContainer
  );
}

if (['complete', 'loaded', 'interactive'].includes(document.readyState) && document.body) {
  run();
} else {
  document.addEventListener('DOMContentLoaded', run, false);
}

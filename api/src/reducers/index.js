// React
import {
  combineReducers,
} from 'redux';
import {
  routerReducer,
} from 'react-router-redux';

import auth from './auth';
import metric from './metric';
import project from './project';
import projects from './projects';

const reducers = combineReducers({
  routing: routerReducer,
  auth,
  metric,
  project,
  projects,
});

export default reducers;

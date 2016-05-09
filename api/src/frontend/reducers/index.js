// React
import {
  combineReducers,
} from 'redux';
import {
  routerReducer,
} from 'react-router-redux';

import auth from './auth';
import apimetric from './apimetric';
import metrics from './metrics';
import project from './project';
import projects from './projects';

const reducers = combineReducers({
  routing: routerReducer,
  auth,
  apimetric,
  metrics,
  project,
  projects,
});

export default reducers;

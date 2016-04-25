// React
import {
  combineReducers,
} from 'redux';
import {
  routerReducer,
} from 'react-router-redux';

import auth from './auth';
import project from './project';
import projects from './projects';

const reducers = combineReducers({
  routing: routerReducer,
  auth,
  project,
  projects,
});

export default reducers;

// React
import React from 'react';
import { IndexRoute, Redirect, Route } from 'react-router';

// React Components
import {
  App,
  AuthContainer,
  GoniPlus,
  Login,
  Projects,
  Register,
} from 'frontend/components';

import {
  Auth as AuthAction,
  Project as ProjectAction,
} from 'frontend/actions';

function routes(store) {
  const _isAuthenticated = (nextState, replace, callback) => {
    const { dispatch } = store;
    const { auth } = store.getState();
    const { currentUser } = auth;
    if (!currentUser && localStorage.getItem('token')) {
      dispatch(AuthAction.getUser());
    } else if (!localStorage.getItem('token')) {
      replace('/login');
    }
    callback();
  };
  const _isProjectExists = (nextState, replace, callback) => {
    const { dispatch } = store;
    const { project } = store.getState();
    const { currentProject } = project;
    let id = nextState.params.id;
    id = parseInt(id, 10);
    if (id && !currentProject) {
      dispatch(ProjectAction.getProject(id));
    } else if (id !== currentProject.id) {
      dispatch(ProjectAction.getProject(id));
    }
    callback();
  };
  return (
    <Route component={App}>
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/" component={AuthContainer} onEnter={_isAuthenticated}>
        <IndexRoute component={Projects} />
        <Route path="/goniplus/:id" component={GoniPlus} onEnter={_isProjectExists} />
      </Route>
      <Redirect from="*" to="/" />
    </Route>
  );
}

export default routes;

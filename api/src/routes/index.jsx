// React
import React from 'react';
import { IndexRoute, Redirect, Route } from 'react-router';

// React Components
import App from 'components/App';
import AuthContainer from 'components/AuthContainer';
import GoniPlus from 'components/GoniPlus';
import Login from 'components/Login';
import Projects from 'components/Projects';
import Register from 'components/Register';

import Actions from 'actions/Auth';
import ProjectActions from 'actions/Project';

function routes(store) {
  const _isAuthenticated = (nextState, replace, callback) => {
    const { dispatch } = store;
    const { auth } = store.getState();
    const { currentUser } = auth;
    if (!currentUser && localStorage.getItem('token')) {
      dispatch(Actions.getUser());
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
      dispatch(ProjectActions.getProject(id));
    } else if (id !== currentProject.id) {
      dispatch(ProjectActions.getProject(id));
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

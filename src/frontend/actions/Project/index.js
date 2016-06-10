import {
  PROJECT_CHANGE_DASHBOARD,
  PROJECT_ENTER_GONIPLUS,
  PROJECT_FETCHED,
  PROJECT_FETCHING,
} from 'constants/project';
import {
  httpGet,
} from 'frontend/util/fetch';
import {
  push,
} from 'react-router-redux';

const PROJECT_URL = '/api/project';

function getProjectUrl(id) {
  return `${PROJECT_URL}/${id}`;
}

const Actions = {
  changeDashboard: (dashboard) => {
    return async dispatch => {
      dispatch({
        type: PROJECT_CHANGE_DASHBOARD,
        dashboard,
      });
    };
  },
  enterProject: () => {
    return async dispatch => {
      dispatch({
        type: PROJECT_ENTER_GONIPLUS,
      });
    };
  },
  getProject: (id) => {
    return async dispatch => {
      try {
        dispatch({
          type: PROJECT_FETCHING,
        });
        const token = localStorage.getItem('token');
        const project = await httpGet(getProjectUrl(id), token);
        dispatch({
          type: PROJECT_FETCHED,
          project,
        });
      } catch (error) {
        dispatch(push('/'));
      }
    };
  },
};

export default Actions;

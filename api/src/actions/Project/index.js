import {
  PROJECT_FETCHED,
  PROJECT_FETCHING,
} from 'constants/project';
import {
  push,
} from 'react-router-redux';
import {
  httpGet,
} from 'util/fetch';

const PROJECT_URL = '/api/project';

function getProjectUrl(id) {
  return `${PROJECT_URL}/${id}`;
}

const Actions = {
  getProject: (id) => {
    return async dispatch => {
      try {
        dispatch({
          type: PROJECT_FETCHING,
        });
        const token = localStorage.getItem('token');
        const res = await httpGet(getProjectUrl(id), token);
        dispatch({
          type: PROJECT_FETCHED,
          project: res,
        });
      } catch (error) {
        dispatch(push('/'));
      }
    };
  },
};

export default Actions;

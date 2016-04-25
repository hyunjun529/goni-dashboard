import {
  PROJECT_FETCH_ERROR,
  PROJECT_FETCHED,
  PROJECT_FETCHING,
} from 'constants/project';
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
        dispatch({
          type: PROJECT_FETCH_ERROR,
        });
      }
    };
  },
};

export default Actions;

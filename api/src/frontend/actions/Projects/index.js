import {
  PROJECT_CLEAR,
  PROJECT_ENTER,
  PROJECT_ENTER_GONI,
  PROJECT_ENTER_GONIPLUS,
} from 'constants/project';
import {
  PROJECTS_FETCH_ERROR,
  PROJECTS_FETCHING,
  PROJECTS_FETCHED,
} from 'constants/projects';
import {
  push,
} from 'react-router-redux';
import {
  httpGet,
} from 'frontend/util/fetch';

const PROJECTS_URL = '/api/projects';

function getProjectPageUrl(project) {
  return `/${project.is_plus ? 'goniplus' : 'goni'}/${project.id}`;
}

const Actions = {
  getProjects: () => {
    return async dispatch => {
      try {
        dispatch({
          type: PROJECT_CLEAR,
        });
        dispatch({
          type: PROJECTS_FETCHING,
        });
        const token = localStorage.getItem('token');
        const res = await httpGet(PROJECTS_URL, token);
        dispatch({
          type: PROJECTS_FETCHED,
          projects: res,
        });
      } catch (error) {
        // TODO : change alert to modal
        alert('프로젝트 리스트를 받아오는도중 에러가 발생했습니다.'); // eslint-disable-line
        dispatch({
          type: PROJECTS_FETCH_ERROR,
        });
      }
    };
  },
  enterProject: (project) => {
    return async dispatch => {
      try {
        if (project) {
          dispatch({
            type: PROJECT_ENTER,
            project,
          });
          dispatch({
            type: project.is_plus ? PROJECT_ENTER_GONIPLUS : PROJECT_ENTER_GONI,
          });
          dispatch(push(getProjectPageUrl(project)));
        }
      } catch (err) { // eslint-disable-line
        // TODO : push to eror page
        dispatch(push('/'));
      }
    };
  },
};

export default Actions;

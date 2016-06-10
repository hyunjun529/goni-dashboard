import {
  PROJECT_ENTER_NON_METRIC_PAGE,
} from 'constants/project';
import {
  SETTINGS_NOTIFICATION_FETCH_ERROR,
  SETTINGS_NOTIFICATION_FETCHED,
  SETTINGS_NOTIFICATION_FETCHING,
  SETTINGS_NOTIFICATION_INIT,
  SETTINGS_NOTIFICATION_MODAL_CLOSE,
  SETTINGS_NOTIFICATION_MODAL_FETCH_ERROR,
  SETTINGS_NOTIFICATION_MODAL_FETCHED,
  SETTINGS_NOTIFICATION_MODAL_FETCHING,
  SETTINGS_NOTIFICATION_MODAL_OPEN,
} from 'constants/settings';
import {
  httpDelete,
  httpGet,
} from 'frontend/util/fetch';

const PROJECT_URL = '/api/project';

function getProjectUrl(id) {
  return `${PROJECT_URL}/${id}`;
}

const Actions = {
  closeModal: () => {
    return async dispatch => {
      dispatch({
        type: SETTINGS_NOTIFICATION_MODAL_CLOSE,
      });
    };
  },
  enterDashboard: () => {
    return async dispatch => {
      dispatch({
        type: PROJECT_ENTER_NON_METRIC_PAGE,
      });
      dispatch({
        type: SETTINGS_NOTIFICATION_INIT,
      });
    };
  },
  getSlackIntegrationData: (id) => {
    return async dispatch => {
      try {
        dispatch({
          type: SETTINGS_NOTIFICATION_FETCHING,
        });
        const token = localStorage.getItem('token');
        const res = await httpGet(`${getProjectUrl(id)}/notification/slack`, token);
        dispatch({
          type: SETTINGS_NOTIFICATION_FETCHED,
          data: res,
        });
      } catch (error) {
        dispatch({
          type: SETTINGS_NOTIFICATION_FETCH_ERROR,
        });
      }
    };
  },
  openModal: () => {
    return async dispatch => {
      dispatch({
        type: SETTINGS_NOTIFICATION_MODAL_OPEN,
      });
    };
  },
  removeSlackIntegeration: (id) => {
    return async dispatch => {
      try {
        dispatch({
          type: SETTINGS_NOTIFICATION_MODAL_FETCHING,
        });
        const token = localStorage.getItem('token');
        await httpDelete(`${getProjectUrl(id)}/notification/slack`, token);
        dispatch({
          type: SETTINGS_NOTIFICATION_MODAL_FETCHED,
          data: null,
        });
        dispatch({
          type: SETTINGS_NOTIFICATION_MODAL_CLOSE,
        });
      } catch (error) {
        dispatch({
          type: SETTINGS_NOTIFICATION_MODAL_FETCH_ERROR,
          error: error.statusText,
        });
      }
    };
  },
};

export default Actions;

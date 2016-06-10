import _ from 'lodash';
import {
  PROJECT_ENTER_NON_METRIC_PAGE,
} from 'constants/project';
import {
  SETTINGS_MEMBER_FETCH_ERROR,
  SETTINGS_MEMBER_FETCHED,
  SETTINGS_MEMBER_FETCHING,
  SETTINGS_MEMBER_INIT,
  SETTINGS_MEMBER_MODAL_CLOSE,
  SETTINGS_MEMBER_MODAL_FETCH_ERROR,
  SETTINGS_MEMBER_MODAL_FETCHED,
  SETTINGS_MEMBER_MODAL_FETCHING,
  SETTINGS_MEMBER_MODAL_OPEN,
} from 'constants/settings';
import {
  httpDelete,
  httpGet,
  httpPost,
} from 'frontend/util/fetch';

const PROJECT_URL = '/api/project';

function getProjectUrl(id) {
  return `${PROJECT_URL}/${id}`;
}

const Actions = {
  addMember: (id, data, member) => {
    return async dispatch => {
      try {
        dispatch({
          type: SETTINGS_MEMBER_MODAL_FETCHING,
        });
        const token = localStorage.getItem('token');
        const res = await httpPost(`${getProjectUrl(id)}/member`, token, data);
        member.push(res);
        dispatch({
          type: SETTINGS_MEMBER_MODAL_FETCHED,
          data: member,
        });
        dispatch({
          type: SETTINGS_MEMBER_MODAL_CLOSE,
        });
      } catch (error) {
        dispatch({
          type: SETTINGS_MEMBER_MODAL_FETCH_ERROR,
          error: error.statusText,
        });
      }
    };
  },
  closeModal: () => {
    return async dispatch => {
      dispatch({
        type: SETTINGS_MEMBER_MODAL_CLOSE,
      });
    };
  },
  enterDashboard: () => {
    return async dispatch => {
      dispatch({
        type: PROJECT_ENTER_NON_METRIC_PAGE,
      });
      dispatch({
        type: SETTINGS_MEMBER_INIT,
      });
    };
  },
  getMemberList: (id) => {
    return async dispatch => {
      try {
        dispatch({
          type: SETTINGS_MEMBER_FETCHING,
        });
        const token = localStorage.getItem('token');
        const res = await httpGet(`${getProjectUrl(id)}/member`, token);
        dispatch({
          type: SETTINGS_MEMBER_FETCHED,
          data: res,
        });
      } catch (error) {
        dispatch({
          type: SETTINGS_MEMBER_FETCH_ERROR,
        });
      }
    };
  },
  openModal: (modal, data) => {
    return async dispatch => {
      dispatch({
        type: SETTINGS_MEMBER_MODAL_OPEN,
        data,
        modal,
      });
    };
  },
  removeMember: (id, user, member) => {
    return async dispatch => {
      try {
        dispatch({
          type: SETTINGS_MEMBER_MODAL_FETCHING,
        });
        const token = localStorage.getItem('token');
        await httpDelete(`${getProjectUrl(id)}/member/${user}`, token);
        const memberIdx = _.findIndex(member, (o) => {
          return o.id === user;
        });
        member.splice(memberIdx, 1);
        dispatch({
          type: SETTINGS_MEMBER_MODAL_FETCHED,
          data: member,
        });
        dispatch({
          type: SETTINGS_MEMBER_MODAL_CLOSE,
        });
      } catch (error) {
        dispatch({
          type: SETTINGS_MEMBER_MODAL_FETCH_ERROR,
          error: error.statusText,
        });
      }
    };
  },
};

export default Actions;

import _ from 'lodash';
import {
  PROJECT_FETCHED,
  PROJECT_FETCHING,
  PROJECT_MEMBER_FETCHED,
  PROJECT_MEMBER_FETCHING,
  PROJECT_MEMBER_FETCH_ERROR,
  PROJECT_MEMBER_UPDATED,
  PROJECT_MODAL_CLOSE,
  PROJECT_MODAL_OPEN,
  PROJECT_MODAL_TYPE,
  PROJECT_SETTING_REQUEST,
  PROJECT_SETTING_REQUEST_CLEAR_ERROR,
  PROJECT_SETTING_REQUEST_END,
  PROJECT_SETTING_REQUEST_ERROR,
} from 'constants/project';
import {
  push,
} from 'react-router-redux';
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
  addUserToProject: (id, data, member) => {
    return async dispatch => {
      try {
        dispatch({
          type: PROJECT_SETTING_REQUEST,
        });
        const token = localStorage.getItem('token');
        const res = await httpPost(`${getProjectUrl(id)}/member`, token, data);
        dispatch({
          type: PROJECT_SETTING_REQUEST_END,
        });
        member.push(res);
        dispatch({
          type: PROJECT_MEMBER_UPDATED,
          data: member,
        });
        dispatch({
          type: PROJECT_MODAL_CLOSE,
        });
      } catch (error) {
        dispatch({
          type: PROJECT_SETTING_REQUEST_ERROR,
          error: error.statusText,
        });
      }
    };
  },
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
  getProjectMemberList: (id) => {
    return async dispatch => {
      try {
        dispatch({
          type: PROJECT_MEMBER_FETCHING,
        });
        const token = localStorage.getItem('token');
        const res = await httpGet(`${getProjectUrl(id)}/member`, token);
        dispatch({
          type: PROJECT_MEMBER_FETCHED,
          member: res,
        });
      } catch (error) {
        dispatch({
          type: PROJECT_MEMBER_FETCH_ERROR,
        });
      }
    };
  },
  openModal: (modal, data) => {
    return async dispatch => {
      dispatch({
        type: PROJECT_MODAL_TYPE,
        data,
        modal,
      });
      dispatch({
        type: PROJECT_SETTING_REQUEST_CLEAR_ERROR,
      });
      dispatch({
        type: PROJECT_MODAL_OPEN,
      });
    };
  },
  removeUserFromProject: (id, user, member) => {
    return async dispatch => {
      try {
        dispatch({
          type: PROJECT_SETTING_REQUEST,
        });
        const token = localStorage.getItem('token');
        await httpDelete(`${getProjectUrl(id)}/member/${user}`, token);
        const memberIdx = _.findIndex(member, (o) => {
          return o.id === user;
        });
        dispatch({
          type: PROJECT_SETTING_REQUEST_END,
        });
        member.splice(memberIdx, 1);
        dispatch({
          type: PROJECT_MEMBER_UPDATED,
          data: member,
        });
        dispatch({
          type: PROJECT_MODAL_CLOSE,
        });
      } catch (error) {
        dispatch({
          type: PROJECT_SETTING_REQUEST_ERROR,
          error: error.statusText,
        });
      }
    };
  },
};

export default Actions;

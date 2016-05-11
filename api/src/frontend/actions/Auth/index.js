import {
  AUTH_CURRENT_USER,
  AUTH_ERROR,
  AUTH_LOGGEDOUT,
} from 'constants/auth';
import {
  push,
} from 'react-router-redux';
import {
  httpGet,
  httpPost,
} from 'frontend/util/fetch';

const LOGIN_URL = '/api/auth';

function setCurrentUser(dispatch, user) {
  dispatch({
    type: AUTH_CURRENT_USER,
    currentUser: user,
  });
}

const Actions = {
  getUser: () => {
    return async dispatch => {
      try {
        const token = localStorage.getItem('token');
        const res = await httpGet(LOGIN_URL, token);
        localStorage.setItem('token', res.token);
        setCurrentUser(dispatch, res);
      } catch (error) {
        localStorage.removeItem('token');
        setCurrentUser(dispatch, null);
        dispatch(push('/login'));
      }
    };
  },
  login: (data) => {
    return async dispatch => {
      try {
        const res = await httpPost(LOGIN_URL, data);
        localStorage.setItem('token', res.token);
        setCurrentUser(dispatch, res);
        dispatch(push('/'));
      } catch (error) {
        dispatch({
          type: AUTH_ERROR,
          errors: error,
        });
      }
    };
  },
  logout: () => {
    return async dispatch => {
      localStorage.removeItem('token');
      dispatch({
        type: AUTH_LOGGEDOUT,
      });
      dispatch(push('/login'));
    };
  },
};

export default Actions;

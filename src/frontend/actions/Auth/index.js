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
  httpPostAuth,
} from 'frontend/util/fetch';

const LOGIN_URL = '/api/auth';
const REGISTER_URL = '/api/auth/register';

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
        const res = await httpPostAuth(LOGIN_URL, data);
        localStorage.setItem('token', res.token);
        setCurrentUser(dispatch, res);
        dispatch(push('/'));
      } catch (error) {
        dispatch({
          type: AUTH_ERROR,
          errors: error.statusText,
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
  registerUser: (data) => {
    return async dispatch => {
      try {
        const res = await httpPostAuth(REGISTER_URL, data);
        if (res.token) {
          localStorage.setItem('token', res.token);
          setCurrentUser(dispatch, res);
        }
        dispatch(push('/'));
      } catch (error) {
        dispatch({
          type: AUTH_ERROR,
          errors: error.statusText,
        });
      }
    };
  },
};

export default Actions;

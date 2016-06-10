import {
  AUTH_CLEAR_ERROR,
  AUTH_CURRENT_USER,
  AUTH_ERROR,
  AUTH_LOGGED_OUT,
} from 'constants/auth';

const initialState = {
  currentUser: null,
  error: null,
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case AUTH_CURRENT_USER:
      return {
        ...state,
        currentUser: action.currentUser,
        error: null,
      };

    case AUTH_LOGGED_OUT:
      return initialState;

    case AUTH_ERROR:
      return {
        ...state,
        error: action.errors,
      };

    case AUTH_CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
}

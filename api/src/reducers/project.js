import {
  PROJECT_CLEAR,
  PROJECT_ENTER,
  PROJECT_FETCH_ERROR,
  PROJECT_FETCHED,
  PROJECT_FETCHING,
} from 'constants/project';

const initialState = {
  currentProject: null,
  fetching: false,
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case PROJECT_CLEAR:
      return initialState;

    case PROJECT_ENTER:
      return {
        ...state,
        currentProject: action.project,
      };

    case PROJECT_FETCH_ERROR:
      return {
        ...state,
        currentProject: null,
        fetching: false,
      };

    case PROJECT_FETCHED:
      return {
        ...state,
        currentProject: action.project,
        fetching: false,
      };

    case PROJECT_FETCHING:
      return {
        ...state,
        currentProject: null,
        fetching: true,
      };

    default:
      return state;
  }
}

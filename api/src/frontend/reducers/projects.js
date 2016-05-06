import {
  PROJECTS_FETCH_ERROR,
  PROJECTS_FETCHING,
  PROJECTS_FETCHED,
} from 'constants/projects';

const initialState = {
  fetching: false,
  list: [],
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case PROJECTS_FETCH_ERROR:
      return {
        ...state,
        fetching: false,
        list: [],
      };

    case PROJECTS_FETCHING:
      return {
        ...state,
        fetching: true,
      };

    case PROJECTS_FETCHED:
      return {
        ...state,
        fetching: false,
        list: action.projects,
      };

    default:
      return state;
  }
}

import {
  PROJECTS_FETCH_ERROR,
  PROJECTS_FETCHING,
  PROJECTS_FETCHED,
  PROJECTS_MODAL_OPEN,
  PROJECTS_MODAL_CLOSE,
} from 'constants/projects';

const initialState = {
  fetching: false,
  isModalOpen: false,
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

    case PROJECTS_MODAL_OPEN:
      return {
        ...state,
        isModalOpen: true,
      };

    case PROJECTS_MODAL_CLOSE:
      return {
        ...state,
        isModalOpen: false,
      };

    default:
      return state;
  }
}

import {
  PROJECT_CHANGE_DASHBOARD,
  PROJECT_CLEAR,
  PROJECT_ENTER,
  PROJECT_ENTER_GONI,
  PROJECT_ENTER_GONIPLUS,
  PROJECT_FETCH_ERROR,
  PROJECT_FETCHED,
  PROJECT_FETCHING,
} from 'constants/project';

const initialState = {
  currentDashboard: '',
  currentDuration: '6h',
  currentProject: null,
  fetching: false,
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case PROJECT_CLEAR:
      return initialState;

    case PROJECT_CHANGE_DASHBOARD:
      return {
        ...state,
        currentDashboard: action.selected,
      };

    case PROJECT_ENTER:
      return {
        ...state,
        currentProject: action.project,
      };

    case PROJECT_ENTER_GONI:
      return {
        ...state,
        currentDashboard: 'Instances',
      };

    case PROJECT_ENTER_GONIPLUS:
      return {
        ...state,
        currentDashboard: 'Runtime',
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

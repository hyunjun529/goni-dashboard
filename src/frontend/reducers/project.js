import {
  PROJECT_CHANGE_DASHBOARD,
  PROJECT_ENTER,
  PROJECT_ENTER_GONIPLUS,
  PROJECT_ENTER_METRIC_PAGE,
  PROJECT_ENTER_NON_METRIC_PAGE,
  PROJECT_ENTER_OVERVIEW_PAGE,
  PROJECT_ENTER_PAGE,
  PROJECT_FETCH_ERROR,
  PROJECT_FETCHED,
  PROJECT_FETCHING,
  PROJECT_INIT,
} from 'constants/project';

const initialState = {
  dashboard: {
    isMetricDashboard: false,
    isOverviewDashboard: false,
    key: 'overview_dashboard',
    title: 'Dashboard',
  },
  project: {
    data: null,
    error: null,
    fetching: false,
  },
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case PROJECT_CHANGE_DASHBOARD:
      return {
        ...state,
        dashboard: {
          ...state.dashboard,
          key: action.dashboard.key,
          title: action.dashboard.title,
        },
      };
    case PROJECT_ENTER:
      return {
        ...state,
        project: {
          ...state.project,
          data: action.project,
        },
      };
    case PROJECT_ENTER_GONIPLUS:
      return {
        ...state,
        dashboard: initialState.dashboard,
      };
    case PROJECT_ENTER_METRIC_PAGE:
      return {
        ...state,
        dashboard: {
          ...state.dashboard,
          isMetricDashboard: true,
          isOverviewDashboard: false,
        },
      };
    case PROJECT_ENTER_NON_METRIC_PAGE:
      return {
        ...state,
        dashboard: {
          ...state.dashboard,
          isMetricDashboard: false,
          isOverviewDashboard: false,
        },
      };
    case PROJECT_ENTER_OVERVIEW_PAGE:
      return {
        ...state,
        dashboard: {
          ...state.dashboard,
          isMetricDashboard: true,
          isOverviewDashboard: true,
        },
      };
    case PROJECT_ENTER_PAGE:
      return {
        ...state,
        dashboard: {
          ...state.dashboard,
          isMetricDashboard: false,
          isOverviewDashboard: false,
        },
      };
    case PROJECT_FETCH_ERROR:
      return {
        ...state,
        project: {
          data: null,
          error: action.error,
          fetching: false,
        },
      };
    case PROJECT_FETCHED:
      return {
        ...state,
        project: {
          data: action.project,
          error: null,
          fetching: false,
        },
      };
    case PROJECT_FETCHING:
      return {
        ...state,
        project: {
          ...state.project,
          data: null,
          error: null,
          fetching: true,
        },
      };
    case PROJECT_INIT:
      return initialState;
    default:
      return state;
  }
}

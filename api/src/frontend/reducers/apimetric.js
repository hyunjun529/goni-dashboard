import {
  METRIC_CHANGE_PATH,
  METRIC_CLEAR,
  METRIC_CLEAR_ALL,
  METRIC_FETCH_ERROR,
  METRIC_FETCHED,
  METRIC_FETCHING,
  METRIC_PATH_FETCHED,
  METRIC_PATH_FETCHING,
  METRIC_PATH_FETCH_ERROR,
} from 'constants/metric';

const initialState = {
  currentPath: null,
  errored: false,
  fetchedData: null,
  fetchedPaths: null,
  fetching: false,
  pathFetching: false,
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case METRIC_CHANGE_PATH:
      return {
        ...state,
        currentPath: action.path,
      };

    case METRIC_CLEAR:
      return {
        ...state,
        errored: false,
        fetchedData: null,
      };

    case METRIC_CLEAR_ALL:
      return {
        ...state,
        currentPath: null,
        errored: false,
        fetchedData: null,
        fetchedInstances: null,
      };

    case METRIC_FETCH_ERROR:
      return {
        ...state,
        errored: true,
        fetchedData: null,
        fetching: false,
      };

    case METRIC_FETCHED:
      return {
        ...state,
        fetchedData: action.fetchedData,
        fetching: false,
      };

    case METRIC_FETCHING:
      return {
        ...state,
        errored: false,
        fetchedData: null,
        fetching: true,
      };

    case METRIC_PATH_FETCH_ERROR:
      return {
        ...state,
        errored: true,
        fetchedPaths: null,
        pathFetching: false,
      };

    case METRIC_PATH_FETCHED:
      return {
        ...state,
        fetchedPaths: action.paths,
        pathFetching: false,
      };

    case METRIC_PATH_FETCHING:
      return {
        ...state,
        errored: false,
        fetchedPaths: null,
        pathFetching: true,
      };

    default:
      return state;
  }
}

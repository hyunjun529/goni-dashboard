import {
  METRIC_CLEAR,
  METRIC_FETCH_ERROR,
  METRIC_FETCHED,
  METRIC_FETCHING,
} from 'constants/metric';

const initialState = {
  errored: false,
  fetchedData: null,
  fetching: false,
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case METRIC_CLEAR:
      return {
        ...state,
        errored: false,
        fetchedData: null,
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

    default:
      return state;
  }
}

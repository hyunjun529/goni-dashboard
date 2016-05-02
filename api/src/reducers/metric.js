import {
  METRIC_CLEAR,
  METRIC_FETCH_ERROR,
  METRIC_FETCHED,
  METRIC_FETCHING,
} from 'constants/metric';

const initialState = {
  fetchedData: null,
  fetching: false,
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case METRIC_CLEAR:
      return {
        ...state,
        fetchedData: null,
      };

    case METRIC_FETCH_ERROR:
      return {
        ...state,
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
        fetchedData: null,
        fetching: true,
      };

    default:
      return state;
  }
}

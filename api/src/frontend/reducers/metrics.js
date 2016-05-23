import {
  METRIC_DATA_FETCH_ERROR,
  METRIC_DATA_FETCHED,
  METRIC_DATA_FETCHING,
  METRIC_INIT,
  METRIC_FILTER_CHANGED,
  METRIC_FILTER_FETCH_ERROR,
  METRIC_FILTER_FETCHED,
  METRIC_FILTER_FETCHING,
  METRIC_TIME_CHANGED,
} from 'constants/metric';

const initialState = {
  filter: {
    data: [],
    error: null,
    fetching: false,
    selected: null,
    time: '6h',
  },
  metric: {
    data: {},
    error: null,
    fetching: false,
  },
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case METRIC_DATA_FETCH_ERROR:
      return {
        ...state,
        metric: {
          data: {},
          error: action.error,
          fetching: false,
        },
      };
    case METRIC_DATA_FETCHED:
      return {
        ...state,
        metric: {
          data: action.data,
          error: null,
          fetching: false,
        },
      };
    case METRIC_DATA_FETCHING:
      return {
        ...state,
        metric: {
          ...state.metric,
          error: null,
          fetching: true,
        },
      };
    case METRIC_INIT:
      return {
        ...state,
        filter: {
          ...state.filter,
          data: [],
          error: null,
          fetching: false,
          selected: null,
        },
        metric: initialState.metric,
      };
    case METRIC_FILTER_CHANGED:
      return {
        ...state,
        filter: {
          ...state.filter,
          selected: action.selected,
        },
      };
    case METRIC_FILTER_FETCH_ERROR:
      return {
        ...state,
        filter: {
          ...state.filter,
          data: [],
          error: action.error,
          fetching: false,
        },
      };
    case METRIC_FILTER_FETCHED:
      return {
        ...state,
        filter: {
          ...state.filter,
          data: action.data,
          error: null,
          fetching: false,
        },
      };
    case METRIC_FILTER_FETCHING:
      return {
        ...state,
        filter: {
          ...state.filter,
          data: [],
          error: null,
          fetching: true,
          selected: null,
        },
      };
    case METRIC_TIME_CHANGED:
      return {
        ...state,
        filter: {
          ...state.filter,
          time: action.time,
        },
      };

    default:
      return state;
  }
}

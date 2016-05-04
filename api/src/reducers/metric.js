import {
  METRIC_CHANGE_INSTANCE,
  METRIC_CLEAR,
  METRIC_CLEAR_ALL,
  METRIC_FETCH_ERROR,
  METRIC_FETCHED,
  METRIC_FETCHING,
  METRIC_INSTANCE_FETCHED,
  METRIC_INSTANCE_FETCHING,
  METRIC_INSTANCE_FETCH_ERROR,
} from 'constants/metric';

const initialState = {
  currentInstance: null,
  errored: false,
  fetchedData: null,
  fetchedInstances: null,
  fetching: false,
  instanceFetching: false,
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case METRIC_CHANGE_INSTANCE:
      return {
        ...state,
        currentInstance: action.instance,
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
        currentInstance: null,
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

    case METRIC_INSTANCE_FETCH_ERROR:
      return {
        ...state,
        errored: true,
        fetchedInstances: null,
        instanceFetching: false,
      };

    case METRIC_INSTANCE_FETCHED:
      return {
        ...state,
        fetchedInstances: action.instances,
        instanceFetching: false,
      };

    case METRIC_INSTANCE_FETCHING:
      return {
        ...state,
        errored: false,
        fetchedInstances: null,
        instanceFetching: true,
      };

    default:
      return state;
  }
}

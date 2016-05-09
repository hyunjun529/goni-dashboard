import {
  METRIC_FETCHED,
  METRIC_FETCHING,
  METRIC_FETCH_ERROR,
  METRIC_INSTANCE_FETCHED,
  METRIC_INSTANCE_FETCHING,
  METRIC_INSTANCE_FETCH_ERROR,
  METRIC_PATH_FETCHED,
  METRIC_PATH_FETCHING,
  METRIC_PATH_FETCH_ERROR,
} from 'constants/metric';
import {
  httpGet,
  httpPost,
} from 'frontend/util/fetch';

const Actions = {
  getCommonMetric: (apikey, metric, instance, duration) => {
    return async dispatch => {
      try {
        dispatch({
          type: METRIC_FETCHING,
        });
        const token = localStorage.getItem('token');
        const res = await httpGet(
          `/api/goniplus/${apikey}/${metric}/${instance}/${duration}`,
          token
        );
        dispatch({
          type: METRIC_FETCHED,
          fetchedData: res,
        });
      } catch (error) {
        dispatch({
          type: METRIC_FETCH_ERROR,
        });
      }
    };
  },
  getInstances: (apikey, metric) => {
    return async dispatch => {
      try {
        dispatch({
          type: METRIC_INSTANCE_FETCHING,
        });
        const token = localStorage.getItem('token');
        const res = await httpGet(`/api/goniplus/${apikey}/${metric}/instances`, token);
        dispatch({
          type: METRIC_INSTANCE_FETCHED,
          instances: res,
        });
      } catch (error) {
        dispatch({
          type: METRIC_INSTANCE_FETCH_ERROR,
        });
      }
    };
  },
  getPaths: (apikey, metric) => {
    return async dispatch => {
      try {
        dispatch({
          type: METRIC_PATH_FETCHING,
        });
        const token = localStorage.getItem('token');
        const res = await httpGet(`/api/goniplus/${apikey}/${metric}/paths`, token);
        dispatch({
          type: METRIC_PATH_FETCHED,
          paths: res,
        });
      } catch (error) {
        dispatch({
          type: METRIC_PATH_FETCH_ERROR,
        });
      }
    };
  },
  getResponseMetric: (apikey, type, path, duration) => {
    return async dispatch => {
      try {
        dispatch({
          type: METRIC_FETCHING,
        });
        const token = localStorage.getItem('token');
        const res = await httpPost(
          `/api/goniplus/${apikey}/${type}/${duration}`,
          token,
          { path }
        );
        dispatch({
          type: METRIC_FETCHED,
          fetchedData: res,
        });
      } catch (error) {
        dispatch({
          type: METRIC_FETCH_ERROR,
        });
      }
    };
  },
};

export default Actions;

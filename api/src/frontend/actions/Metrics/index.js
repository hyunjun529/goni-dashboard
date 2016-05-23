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
import {
  PROJECT_ENTER_METRIC_PAGE,
} from 'constants/project';
import {
  httpGet,
  httpPost,
} from 'frontend/util/fetch';

const Actions = {
  changeInstance: (instance) => {
    return async dispatch => {
      dispatch({
        type: METRIC_FILTER_CHANGED,
        selected: instance,
      });
    };
  },
  changePath: (path) => {
    return async dispatch => {
      dispatch({
        type: METRIC_FILTER_CHANGED,
        selected: path,
      });
    };
  },
  changeTime: (time) => {
    return async dispatch => {
      dispatch({
        type: METRIC_TIME_CHANGED,
        time,
      });
    };
  },
  enterDashboard: () => {
    return async dispatch => {
      dispatch({
        type: PROJECT_ENTER_METRIC_PAGE,
      });
      dispatch({
        type: METRIC_INIT,
      });
    };
  },
  getInstances: (apikey, metric) => {
    return async dispatch => {
      try {
        dispatch({
          type: METRIC_FILTER_FETCHING,
        });
        const token = localStorage.getItem('token');
        const data = await httpGet(`/api/goniplus/${apikey}/${metric}/instances`, token);
        dispatch({
          type: METRIC_FILTER_FETCHED,
          data,
        });
      } catch (error) {
        dispatch({
          type: METRIC_FILTER_FETCH_ERROR,
          error: error.statusText,
        });
      }
    };
  },
  getMetric: (apikey, metric, instance, duration) => {
    return async dispatch => {
      try {
        dispatch({
          type: METRIC_DATA_FETCHING,
        });
        const token = localStorage.getItem('token');
        const data = await httpGet(`/api/goniplus/${apikey}/${metric}/${instance}/${duration}`, token);
        dispatch({
          type: METRIC_DATA_FETCHED,
          data,
        });
      } catch (error) {
        dispatch({
          type: METRIC_DATA_FETCH_ERROR,
          error: error.statusText,
        });
      }
    };
  },
  getPaths: (apikey, metric) => {
    return async dispatch => {
      try {
        dispatch({
          type: METRIC_FILTER_FETCHING,
        });
        const token = localStorage.getItem('token');
        const data = await httpGet(`/api/goniplus/${apikey}/${metric}/paths`, token);
        dispatch({
          type: METRIC_FILTER_FETCHED,
          data,
        });
      } catch (error) {
        dispatch({
          type: METRIC_FILTER_FETCH_ERROR,
          error: error.statusText,
        });
      }
    };
  },
  getResponseMetric: (apikey, metric, path, duration) => {
    return async dispatch => {
      try {
        dispatch({
          type: METRIC_DATA_FETCHING,
        });
        const token = localStorage.getItem('token');
        const data = await httpPost(
          `/api/goniplus/${apikey}/${metric}/${duration}`,
          token, {
            path,
          }
        );
        dispatch({
          type: METRIC_DATA_FETCHED,
          data,
        });
      } catch (error) {
        dispatch({
          type: METRIC_DATA_FETCH_ERROR,
          error: error.statusText,
        });
      }
    };
  },
};

export default Actions;

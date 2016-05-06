import {
  METRIC_FETCHED,
  METRIC_FETCHING,
  METRIC_FETCH_ERROR,
  METRIC_INSTANCE_FETCHED,
  METRIC_INSTANCE_FETCHING,
  METRIC_INSTANCE_FETCH_ERROR,
} from 'constants/metric';
import {
  httpGet,
} from 'frontend/util/fetch';

const Actions = {
  getGoniPlus: (apikey, metric, instance, duration) => {
    return async dispatch => {
      try {
        dispatch({
          type: METRIC_FETCHING,
        });
        const token = localStorage.getItem('token');
        const res = await httpGet(`/api/goniplus/${apikey}/${metric}/${instance}/${duration}`, token);
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
};

export default Actions;

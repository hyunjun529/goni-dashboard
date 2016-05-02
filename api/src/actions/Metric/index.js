import {
  METRIC_FETCHED,
  METRIC_FETCHING,
} from 'constants/metric';
import {
  push,
} from 'react-router-redux';
import {
  httpGet,
} from 'util/fetch';

const Actions = {
  getGoniPlus: (apikey, metric, duration) => {
    return async dispatch => {
      try {
        dispatch({
          type: METRIC_FETCHING,
        });
        const token = localStorage.getItem('token');
        const res = await httpGet(`/api/goniplus/${apikey}/${metric}/${duration}`, token);
        dispatch({
          type: METRIC_FETCHED,
          fetchedData: res,
        });
      } catch (error) {
        dispatch(push('/'));
      }
    };
  },
};

export default Actions;

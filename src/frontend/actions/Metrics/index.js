import {
  METRIC_DATA_FETCH_ERROR,
  METRIC_DATA_FETCHED,
  METRIC_DATA_FETCHING,
  METRIC_INIT,
  METRIC_FILTER_CHANGED,
  METRIC_FILTER_FETCH_ERROR,
  METRIC_FILTER_FETCHED,
  METRIC_FILTER_FETCHING,
  METRIC_MODAL_CLOSE,
  METRIC_MODAL_OPEN,
  METRIC_OVERVIEW_API_FETCH_ERROR,
  METRIC_OVERVIEW_API_FETCHED,
  METRIC_OVERVIEW_API_FETCHING,
  METRIC_OVERVIEW_API_SELECTED,
  METRIC_OVERVIEW_API_DETAIL_FETCH_ERROR,
  METRIC_OVERVIEW_API_DETAIL_FETCHED,
  METRIC_OVERVIEW_API_DETAIL_FETCHING,
  METRIC_OVERVIEW_CPU_FETCH_ERROR,
  METRIC_OVERVIEW_CPU_FETCHED,
  METRIC_OVERVIEW_CPU_FETCHING,
  METRIC_OVERVIEW_CPU_SELECTED,
  METRIC_OVERVIEW_CRUMB_SELECTED,
  METRIC_OVERVIEW_REALTIME_FETCHED,
  METRIC_TIME_CHANGED,
} from 'constants/metric';
import {
  PROJECT_ENTER_PAGE,
  PROJECT_ENTER_METRIC_PAGE,
  PROJECT_ENTER_OVERVIEW_PAGE,
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
  closeModal: () => {
    return async dispatch => {
      dispatch({
        type: METRIC_MODAL_CLOSE,
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
  enterOverviewDashboard: () => {
    return async dispatch => {
      dispatch({
        type: PROJECT_ENTER_OVERVIEW_PAGE,
      });
      dispatch({
        type: METRIC_INIT,
      });
    };
  },
  enterPage: () => {
    return async dispatch => {
      dispatch({
        type: PROJECT_ENTER_PAGE,
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
  getOverviewAPIByTime: (apikey, time) => {
    return async dispatch => {
      try {
        dispatch({
          type: METRIC_OVERVIEW_CPU_SELECTED,
          selected: time,
        });
        dispatch({
          type: METRIC_OVERVIEW_API_FETCHING,
        });
        const token = localStorage.getItem('token');
        const data = await httpGet(`/api/goniplus/${apikey}/overview/dashboard/cpu/${time}`, token);
        dispatch({
          type: METRIC_OVERVIEW_API_FETCHED,
          data,
        });
      } catch (error) {
        dispatch({
          type: METRIC_OVERVIEW_API_FETCH_ERROR,
          error: error.statusText,
        });
      }
    };
  },
  getOverviewAPIDetail: (apikey, path, time) => {
    return async dispatch => {
      try {
        dispatch({
          type: METRIC_OVERVIEW_API_SELECTED,
          selected: path,
        });
        dispatch({
          type: METRIC_OVERVIEW_API_DETAIL_FETCHING,
        });
        const token = localStorage.getItem('token');
        const data = await httpPost(
          `/api/goniplus/${apikey}/overview/dashboard/cpu/${time}/apidetail`,
          token, {
            path,
          }
        );
        dispatch({
          type: METRIC_OVERVIEW_API_DETAIL_FETCHED,
          data,
        });
      } catch (error) {
        dispatch({
          type: METRIC_OVERVIEW_API_DETAIL_FETCH_ERROR,
          error: error.statusText,
        });
      }
    };
  },
  getOverviewCPU: (apikey) => {
    return async dispatch => {
      try {
        dispatch({
          type: METRIC_OVERVIEW_CPU_FETCHING,
        });
        const token = localStorage.getItem('token');
        const data = await httpGet(`/api/goniplus/${apikey}/overview/dashboard/cpu`, token);
        dispatch({
          type: METRIC_OVERVIEW_CPU_FETCHED,
          data,
        });
      } catch (error) {
        dispatch({
          type: METRIC_OVERVIEW_CPU_FETCH_ERROR,
          error: error.statusText,
        });
      }
    };
  },
  getOverviewRealtime: (apikey) => {
    return async dispatch => {
      try {
        const token = localStorage.getItem('token');
        const data = await httpGet(`/api/goniplus/${apikey}/overview/dashboard/realtime`, token);
        dispatch({
          type: METRIC_OVERVIEW_REALTIME_FETCHED,
          data,
        });
      } catch (error) {
        dispatch({
          type: METRIC_OVERVIEW_REALTIME_FETCHED,
          data: [[], []],
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
  openCrumbModal: (title, data) => {
    return async dispatch => {
      dispatch({
        type: METRIC_OVERVIEW_CRUMB_SELECTED,
        selected: {
          title,
          min: data.min,
          mean: data.mean,
          max: data.max,
        },
      });
      dispatch({
        type: METRIC_MODAL_OPEN,
      });
    };
  },
  openModal: () => {
    return async dispatch => {
      dispatch({
        type: METRIC_MODAL_OPEN,
      });
    };
  },
};

export default Actions;

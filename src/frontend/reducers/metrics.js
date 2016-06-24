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
    modal: {
      isOpened: false,
    },
  },
  overview: {
    api: {
      data: {},
      error: null,
      fetching: false,
      selected: null,
    },
    apiDetail: {
      data: {},
      error: null,
      fetching: false,
    },
    cpu: {
      data: {},
      error: null,
      fetching: false,
      selected: null,
    },
    crumb: {
      selected: null,
    },
    realtime: {
      data: [[], []],
    },
  },
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case METRIC_DATA_FETCH_ERROR:
      return {
        ...state,
        metric: {
          ...state.metric,
          data: {},
          error: action.error,
          fetching: false,
        },
      };
    case METRIC_DATA_FETCHED:
      return {
        ...state,
        metric: {
          ...state.metric,
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
        filter: {
          ...state.filter,
          data: [],
          error: null,
          fetching: false,
          selected: null,
        },
        metric: initialState.metric,
        overview: initialState.overview,
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
    case METRIC_MODAL_CLOSE:
      return {
        ...state,
        metric: {
          ...state.metric,
          modal: {
            isOpened: false,
          },
        },
      };
    case METRIC_MODAL_OPEN:
      return {
        ...state,
        metric: {
          ...state.metric,
          modal: {
            isOpened: true,
          },
        },
      };
    case METRIC_OVERVIEW_API_FETCH_ERROR:
      return {
        ...state,
        overview: {
          ...state.overview,
          api: {
            data: {},
            error: action.error,
            fetching: false,
            selected: null,
          },
        },
      };
    case METRIC_OVERVIEW_API_FETCHED:
      return {
        ...state,
        overview: {
          ...state.overview,
          api: {
            data: action.data,
            error: null,
            fetching: false,
            selected: null,
          },
        },
      };
    case METRIC_OVERVIEW_API_FETCHING:
      return {
        ...state,
        overview: {
          ...state.overview,
          api: {
            data: {},
            error: null,
            fetching: true,
            selected: null,
          },
        },
      };
    case METRIC_OVERVIEW_API_SELECTED:
      return {
        ...state,
        overview: {
          ...state.overview,
          api: {
            ...state.overview.api,
            selected: action.selected,
          },
        },
      };
    case METRIC_OVERVIEW_API_DETAIL_FETCH_ERROR:
      return {
        ...state,
        overview: {
          ...state.overview,
          apiDetail: {
            data: {},
            error: action.error,
            fetching: false,
            selected: null,
          },
        },
      };
    case METRIC_OVERVIEW_API_DETAIL_FETCHED:
      return {
        ...state,
        overview: {
          ...state.overview,
          apiDetail: {
            data: action.data,
            error: null,
            fetching: false,
            selected: null,
          },
        },
      };
    case METRIC_OVERVIEW_API_DETAIL_FETCHING:
      return {
        ...state,
        overview: {
          ...state.overview,
          apiDetail: {
            data: {},
            error: null,
            fetching: true,
            selected: null,
          },
        },
      };
    case METRIC_OVERVIEW_CPU_FETCH_ERROR:
      return {
        ...state,
        overview: {
          ...state.overview,
          cpu: {
            data: {},
            error: action.error,
            fetching: false,
            selected: null,
          },
        },
      };
    case METRIC_OVERVIEW_CPU_FETCHED:
      return {
        ...state,
        overview: {
          ...state.overview,
          cpu: {
            data: action.data,
            error: null,
            fetching: false,
            selected: null,
          },
        },
      };
    case METRIC_OVERVIEW_CPU_FETCHING:
      return {
        ...state,
        overview: {
          ...state.overview,
          cpu: {
            data: {},
            error: null,
            fetching: true,
            selected: null,
          },
        },
      };
    case METRIC_OVERVIEW_CPU_SELECTED:
      return {
        ...state,
        overview: {
          ...state.overview,
          cpu: {
            ...state.overview.cpu,
            selected: action.selected,
          },
        },
      };
    case METRIC_OVERVIEW_CRUMB_SELECTED:
      return {
        ...state,
        overview: {
          ...state.overview,
          crumb: {
            selected: action.selected,
          },
        },
      };
    case METRIC_OVERVIEW_REALTIME_FETCHED:
      return {
        ...state,
        overview: {
          ...state.overview,
          realtime: {
            data: action.data,
          },
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

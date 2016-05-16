import {
  PROJECT_CHANGE_DASHBOARD,
  PROJECT_CHANGE_TIME,
  PROJECT_CLEAR,
  PROJECT_ENTER,
  PROJECT_ENTER_GONI,
  PROJECT_ENTER_GONIPLUS,
  PROJECT_ENTER_METRIC_PAGE,
  PROJECT_ENTER_NON_METRIC_PAGE,
  PROJECT_FETCH_ERROR,
  PROJECT_FETCHED,
  PROJECT_FETCHING,
  PROJECT_MEMBER_FETCH_ERROR,
  PROJECT_MEMBER_FETCHED,
  PROJECT_MEMBER_FETCHING,
  PROJECT_MEMBER_UPDATED,
  PROJECT_MODAL_OPEN,
  PROJECT_MODAL_CLOSE,
  PROJECT_MODAL_TYPE,
  PROJECT_SETTING_REQUEST,
  PROJECT_SETTING_REQUEST_CLEAR_ERROR,
  PROJECT_SETTING_REQUEST_END,
  PROJECT_SETTING_REQUEST_ERROR,
} from 'constants/project';

const initialState = {
  currentDashboard: {
    title: 'Runtime',
    key: 'metrics_runtime',
  },
  currentDuration: '6h',
  currentProject: null,
  isMetricPage: false,
  isModalOpen: false,
  fetching: false,
  member: null,
  memberFetching: false,
  modalData: null,
  modalType: '',
  settingError: null,
  settingRequested: false,
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case PROJECT_CLEAR:
      return initialState;

    case PROJECT_CHANGE_DASHBOARD:
      return {
        ...state,
        currentDashboard: action.selected,
      };

    case PROJECT_CHANGE_TIME:
      return {
        ...state,
        currentDuration: action.time,
      };

    case PROJECT_ENTER:
      return {
        ...state,
        currentProject: action.project,
      };

    case PROJECT_ENTER_GONI:
      return {
        ...state,
        currentDashboard: 'Instances',
      };

    case PROJECT_ENTER_GONIPLUS:
      return {
        ...state,
        currentDashboard: initialState.currentDashboard,
      };

    case PROJECT_ENTER_METRIC_PAGE:
      return {
        ...state,
        isMetricPage: true,
      };

    case PROJECT_ENTER_NON_METRIC_PAGE:
      return {
        ...state,
        isMetricPage: false,
      };

    case PROJECT_FETCH_ERROR:
      return {
        ...state,
        currentProject: null,
        fetching: false,
      };

    case PROJECT_FETCHED:
      return {
        ...state,
        currentProject: action.project,
        fetching: false,
      };

    case PROJECT_FETCHING:
      return {
        ...state,
        currentProject: null,
        fetching: true,
      };

    case PROJECT_MEMBER_FETCH_ERROR:
      return {
        ...state,
        member: null,
        memberFetching: false,
      };

    case PROJECT_MEMBER_FETCHED:
      return {
        ...state,
        member: action.member,
        memberFetching: false,
      };

    case PROJECT_MEMBER_FETCHING:
      return {
        ...state,
        member: null,
        memberFetching: true,
      };

    case PROJECT_MEMBER_UPDATED:
      return {
        ...state,
        member: action.data,
      };

    case PROJECT_MODAL_OPEN:
      return {
        ...state,
        isModalOpen: true,
      };

    case PROJECT_MODAL_CLOSE:
      return {
        ...state,
        isModalOpen: false,
      };

    case PROJECT_MODAL_TYPE:
      return {
        ...state,
        modalType: action.modal,
        modalData: action.data,
      };

    case PROJECT_SETTING_REQUEST:
      return {
        ...state,
        settingError: null,
        settingRequested: true,
      };

    case PROJECT_SETTING_REQUEST_CLEAR_ERROR:
    case PROJECT_SETTING_REQUEST_END:
      return {
        ...state,
        settingError: null,
        settingRequested: false,
      };

    case PROJECT_SETTING_REQUEST_ERROR:
      return {
        ...state,
        settingError: action.error,
        settingRequested: false,
      };

    default:
      return state;
  }
}

// Project
export const PROJECT_CHANGE_DASHBOARD = 'PROJECT_CHANGE_DASHBOARD';
export const PROJECT_CHANGE_TIME = 'PROJECT_CHANGE_TIME';
export const PROJECT_CLEAR = 'PROJECT_CLEAR';
export const PROJECT_ENTER = 'PROJECT_ENTER';
export const PROJECT_ENTER_GONI = 'PROJECT_ENTER_GONI';
export const PROJECT_ENTER_GONIPLUS = 'PROJECT_ENTER_GONIPLUS';
export const PROJECT_ENTER_METRIC_PAGE = 'PROJECT_ENTER_METRIC_PAGE';
export const PROJECT_ENTER_NON_METRIC_PAGE = 'PROJECT_ENTER_NON_METRIC_PAGE';
export const PROJECT_FETCHED = 'PROJECT_FETCHED';
export const PROJECT_FETCHING = 'PROJECT_FETCHING';
export const PROJECT_FETCH_ERROR = 'PROJECT_FETCH_ERROR';
export const PROJECT_MEMBER_FETCHED = 'PROJECT_MEMBER_FETCHED';
export const PROJECT_MEMBER_FETCHING = 'PROJECT_MEMBER_FETCHING';
export const PROJECT_MEMBER_FETCH_ERROR = 'PROJECT_MEMBER_FETCH_ERROR';
export const PROJECT_MEMBER_UPDATED = 'PROJECT_MEMBER_UPDATED';
export const PROJECT_MODAL_CLOSE = 'PROJECT_MODAL_CLOSE';
export const PROJECT_MODAL_OPEN = 'PROJECT_MODAL_OPEN';
export const PROJECT_MODAL_TYPE = 'PROJECT_MODAL_TYPE';
export const PROJECT_SETTING_REQUEST_END = 'PROJECT_SETTING_REQUEST_END';
export const PROJECT_SETTING_REQUEST = 'PROJECT_SETTING_REQUEST';
export const PROJECT_SETTING_REQUEST_CLEAR_ERROR = 'PROJECT_SETTING_REQUEST_CLEAR_ERROR';
export const PROJECT_SETTING_REQUEST_ERROR = 'PROJECT_SETTING_REQUEST_ERROR';

export const GONIPLUS_SIDEBAR = [{
  header: 'metrics',
  item: [{
    title: 'Expvar',
    key: 'metrics_expvar',
  }, {
    title: 'Runtime',
    key: 'metrics_runtime',
  }],
}, {
  header: 'API',
  item: [{
    title: 'Response',
    key: 'api_response',
  }, {
    title: 'Statistics',
    key: 'api_statistics',
  }],
}, {
  header: 'SETTINGS',
  item: [{
    title: 'Member',
    key: 'settings_member',
  }, {
    title: 'Notification',
    key: 'settings_notification',
  }],
}];

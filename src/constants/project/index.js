// Project
export const PROJECT_CHANGE_DASHBOARD = 'PROJECT_CHANGE_DASHBOARD';
export const PROJECT_ENTER = 'PROJECT_ENTER';
export const PROJECT_ENTER_GONIPLUS = 'PROJECT_ENTER_GONIPLUS';
export const PROJECT_ENTER_METRIC_PAGE = 'PROJECT_ENTER_METRIC_PAGE';
export const PROJECT_ENTER_NON_METRIC_PAGE = 'PROJECT_ENTER_NON_METRIC_PAGE';
export const PROJECT_ENTER_OVERVIEW_PAGE = 'PROJECT_ENTER_OVERVIEW_PAGE';
export const PROJECT_ENTER_PAGE = 'PROJECT_ENTER_PAGE';
export const PROJECT_FETCH_ERROR = 'PROJECT_FETCH_ERROR';
export const PROJECT_FETCHED = 'PROJECT_FETCHED';
export const PROJECT_FETCHING = 'PROJECT_FETCHING';
export const PROJECT_INIT = 'PROJECT_INIT';

export const GONIPLUS_SIDEBAR = [{
  header: 'Overview',
  item: [{
    title: 'Now',
    key: 'overview_now',
  }, {
    title: 'Dashboard',
    key: 'overview_dashboard',
  }],
}, {
  header: 'Transaction',
  item: [{
    title: 'Response',
    key: 'api_response',
  }, {
    title: 'Statistics',
    key: 'api_statistics',
  }],
}, {
  header: 'Metrics',
  item: [{
    title: 'Expvar',
    key: 'metrics_expvar',
  }, {
    title: 'Runtime',
    key: 'metrics_runtime',
  }],
}, {
  header: 'Settings',
  item: [{
    title: 'Member',
    key: 'settings_member',
  }, {
    title: 'Notification',
    key: 'settings_notification',
  }],
}];

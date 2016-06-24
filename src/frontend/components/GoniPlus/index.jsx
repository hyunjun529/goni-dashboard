// React
import React from 'react';
import { connect } from 'react-redux';

// Actions
import { Metrics as MetricAction, Project as ProjectAction } from 'frontend/actions';

// Components
import {
  APIResponseMetrics,
  APIStatisticsMetrics,
  DashboardOverview,
  DashboardOverviewNow,
  Header,
  MemberSettings,
  Metrics,
  NotificationSettings,
  Sidebar,
} from 'frontend/components';

import {
  GONIPLUS_SIDEBAR,
} from 'constants/project';

const keyToObject = (key) => {
  switch (key) {
    case 'settings_notification':
      return {
        title: 'Notification',
        key: 'settings_notification',
      };
    default:
      return null;
  }
};

class GoniPlus extends React.Component {
  componentDidMount() {
    const { dispatch, location } = this.props;
    dispatch(ProjectAction.enterProject());
    const dashboard = location.query && location.query.dashboard ? keyToObject(location.query.dashboard) : null;
    if (dashboard) {
      dispatch(ProjectAction.changeDashboard(dashboard));
    }
  }

  _updateTimeBtn(t) {
    const { duration } = this.props;
    const prefix = t !== '30m' ? 'tag-tab-more' : 'tag-tab';
    if (t === duration) {
      return `${prefix} tag-selected`;
    }
    return prefix;
  }

  _changeTime(t) {
    const { dispatch, duration } = this.props;
    if (t !== duration) {
      dispatch(MetricAction.changeTime(t));
    }
  }

  _renderGraphs() {
    const { dashboard } = this.props;
    switch (dashboard.key) {
      case 'overview_now':
        return <DashboardOverviewNow />;
      case 'overview_dashboard':
        return <DashboardOverview />;
      case 'metrics_expvar':
        return <Metrics type="expvar" />;
      case 'metrics_runtime':
        return <Metrics type="runtime" />;
      case 'api_response':
        return <APIResponseMetrics />;
      case 'api_statistics':
        return <APIStatisticsMetrics />;
      case 'settings_member':
        return <MemberSettings />;
      case 'settings_notification':
        return <NotificationSettings />;
      default:
        return false;
    }
  }

  _renderTab() {
    const { isOverviewDashboard, isMetricDashboard } = this.props;
    if (isOverviewDashboard) {
      return (
        <div className="tag-tab-wrap">
          <div className="tag-tab tag-selected">
            <a>CPU</a>
          </div>
          <div className="tag-tab-more" onClick={() => alert('추후 제공될 기능입니다.')}>
            <a>HEAP</a>
          </div>
        </div>
      );
    }
    if (isMetricDashboard) {
      return (
        <div className="tag-tab-wrap">
          <div className={this._updateTimeBtn('30m')} onClick={() => this._changeTime('30m')}>
            <a>30 MINUTES</a>
          </div>
          <div className={this._updateTimeBtn('1h')} onClick={() => this._changeTime('1h')}>
            <a>1 HOUR</a>
          </div>
          <div className={this._updateTimeBtn('3h')} onClick={() => this._changeTime('3h')}>
            <a>3 HOURS</a>
          </div>
          <div className={this._updateTimeBtn('6h')} onClick={() => this._changeTime('6h')}>
            <a>6 HOURS</a>
          </div>
        </div>
      );
    }
    return false;
  }

  _renderLayout() {
    const { fetching, project } = this.props;
    return (
      <div className="child">
        <Sidebar menu={GONIPLUS_SIDEBAR} />
        <div className="dashboard-sidebar">
          <div className="dashboard-header">
            <h1>{ project.name }
              { fetching ?
                <i className="fa fa-circle-o-notch fa-spin" aria-hidden="true" /> :
                null
              }
            </h1>
            {this._renderTab()}
          </div>
          {this._renderGraphs()}
        </div>
      </div>
    );
  }

  render() {
    const { project } = this.props;
    if (!project) {
      return false;
    }
    return (
      <div>
        <Header page="projects" />
        {this._renderLayout()}
      </div>
    );
  }
}

GoniPlus.propTypes = {
  dashboard: React.PropTypes.object,
  dispatch: React.PropTypes.func.isRequired,
  duration: React.PropTypes.string,
  fetching: React.PropTypes.bool,
  isMetricDashboard: React.PropTypes.bool,
  isOverviewDashboard: React.PropTypes.bool,
  location: React.PropTypes.object,
  project: React.PropTypes.object,
};

const mapStateToProps = (state) => ({
  dashboard: state.project.dashboard,
  duration: state.metrics.filter.time,
  project: state.project.project.data,
  fetching: state.project.project.fetching,
  isMetricDashboard: state.project.dashboard.isMetricDashboard,
  isOverviewDashboard: state.project.dashboard.isOverviewDashboard,
});

export default connect(mapStateToProps)(GoniPlus);

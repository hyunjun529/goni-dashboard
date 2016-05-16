// React
import React from 'react';
import { connect } from 'react-redux';

// Components
import {
  APIResponseMetrics,
  APIStatisticsMetrics,
  GeneralSettings,
  Header,
  MemberSettings,
  Metrics,
  Sidebar,
} from 'frontend/components';

import {
  PROJECT_CHANGE_TIME,
  PROJECT_ENTER_GONIPLUS,
  GONIPLUS_SIDEBAR,
} from 'constants/project';

class GoniPlus extends React.Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: PROJECT_ENTER_GONIPLUS,
    });
  }

  _timeBtn(t, more) {
    const { currentDuration } = this.props;
    const prefix = more ? 'tag-tab-more' : 'tag-tab';
    if (t === currentDuration) {
      return `${prefix} tag-selected`;
    }
    return prefix;
  }

  _changeTime(t) {
    const { currentDuration, dispatch } = this.props;
    if (t !== currentDuration) {
      dispatch({
        type: PROJECT_CHANGE_TIME,
        time: t,
      });
    }
  }

  _renderGraphs() {
    const { currentDashboard } = this.props;
    switch (currentDashboard.key) {
      case 'metrics_expvar':
        return <Metrics type="expvar" />;
      case 'metrics_runtime':
        return <Metrics type="runtime" />;
      case 'api_response':
        return <APIResponseMetrics />;
      case 'api_statistics':
        return <APIStatisticsMetrics />;
      case 'settings_general':
        return <GeneralSettings />;
      case 'settings_member':
        return <MemberSettings />;
      default:
        return false;
    }
  }

  _renderLayout() {
    const { currentProject, fetching, isMetricPage } = this.props;
    return (
      <div className="child">
        <Sidebar menu={GONIPLUS_SIDEBAR} />
        <div className="dashboard-sidebar">
          <div className="dashboard-header">
            <h1>{ currentProject.name }
              { fetching ?
                <i className="fa fa-circle-o-notch fa-spin" aria-hidden="true" /> :
                null
              }
            </h1>
            { isMetricPage ?
              <div className="tag-tab-wrap">
                <div className={this._timeBtn('30m', false)} onClick={() => this._changeTime('30m')}>
                  <a>30 MINUTES</a>
                </div>
                <div className={this._timeBtn('1h', true)} onClick={() => this._changeTime('1h')}>
                  <a>1 HOUR</a>
                </div>
                <div className={this._timeBtn('3h', true)} onClick={() => this._changeTime('3h')}>
                  <a>3 HOURS</a>
                </div>
                <div className={this._timeBtn('6h', true)} onClick={() => this._changeTime('6h')}>
                  <a>6 HOURS</a>
                </div>
              </div> :
              null
            }
          </div>
          {this._renderGraphs()}
        </div>
      </div>
    );
  }

  render() {
    const { currentProject } = this.props;
    if (!currentProject) {
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
  currentDashboard: React.PropTypes.object,
  currentDuration: React.PropTypes.string,
  currentProject: React.PropTypes.object,
  dispatch: React.PropTypes.func.isRequired,
  fetching: React.PropTypes.bool,
  isMetricPage: React.PropTypes.bool,
};

const mapStateToProps = (state) => ({
  currentDashboard: state.project.currentDashboard,
  currentDuration: state.project.currentDuration,
  currentProject: state.project.currentProject,
  fetching: state.project.fetching,
  isMetricPage: state.project.isMetricPage,
});

export default connect(mapStateToProps)(GoniPlus);

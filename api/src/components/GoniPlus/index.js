// React
import React from 'react';
import { connect } from 'react-redux';

// Components
import Header from 'components/Header';
import Sidebar from 'components/Sidebar';
import { Expvar, Runtime } from 'components/Metric';

import {
  PROJECT_ENTER_GONIPLUS,
} from 'constants/project';

const sidebar = [
  {
    header: 'metrics',
    item: [
      'Expvar',
      'Runtime',
    ],
  },
  {
    header: 'API',
    item: [
      'Response',
      'Statistics',
    ],
  },
  {
    header: 'SETTINGS',
    item: [
      'Guide',
    ],
  },
];

class GoniPlus extends React.Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: PROJECT_ENTER_GONIPLUS,
    });
  }

  _renderGraphs() {
    const { currentDashboard } = this.props;
    switch (currentDashboard) {
      case 'Expvar':
        return <Expvar />;
      case 'Runtime':
        return <Runtime />;
      default:
        return <Runtime />;
    }
  }

  _renderLayout() {
    const { currentProject, fetching } = this.props;
    return (
      <div className="child">
        <Sidebar menu={sidebar} />
        <div className="dashboard-sidebar">
          <div className="dashboard-header">
            <h1>{ currentProject.name }
              { fetching ?
                <i className="fa fa-circle-o-notch fa-spin" aria-hidden="true" /> :
                null
              }
            </h1>
            <div className="tag-tab-wrap">
              <div className="tag-tab">
                <a>30 MINUTES</a>
              </div>
              <div className="tag-tab-more">
                <a>1 HOUR</a>
              </div>
              <div className="tag-tab-more">
                <a>3 HOURS</a>
              </div>
              <div className="tag-tab-more">
                <a>6 HOURS</a>
              </div>
            </div>
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
  currentDashboard: React.PropTypes.string,
  currentProject: React.PropTypes.object,
  dispatch: React.PropTypes.func.isRequired,
  fetching: React.PropTypes.bool,
};

const mapStateToProps = (state) => ({
  currentDashboard: state.project.currentDashboard,
  currentProject: state.project.currentProject,
  fetching: state.project.fetching,
});

export default connect(mapStateToProps)(GoniPlus);

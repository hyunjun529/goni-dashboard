// React
import React from 'react';
import { connect } from 'react-redux';

// Actions
import { Metrics as MetricAction } from 'frontend/actions';

// Components
import Select from 'react-select';

// Constants
import { METRIC_CHANGE_PATH } from 'constants/metric';
import { PROJECT_ENTER_METRIC_PAGE } from 'constants/project';

const type = 'response/statistics';

class Statistics extends React.Component {
  componentWillMount() {
    const { dispatch } = this.props;
    dispatch({
      type: PROJECT_ENTER_METRIC_PAGE,
    });
  }

  componentDidMount() {
    const { currentProject, dispatch } = this.props;
    dispatch(MetricAction.getPaths(currentProject.apikey, type));
  }

  _changePath(v) {
    const { currentDuration, currentProject } = this.props;
    const { dispatch } = this.props;
    dispatch({
      type: METRIC_CHANGE_PATH,
      path: v,
    });
    dispatch(MetricAction.getResponseMetric(currentProject.apikey, type,
      v, currentDuration));
  }

  render() {
    const { currentPath, fetchedPaths, pathFetching } = this.props;
    return (
      <div>
        <Select name="path" options={fetchedPaths} onChange={::this._changePath} isLoading={pathFetching} value={currentPath} placeholder="API Path" />
      </div>
    );
  }
}

Statistics.propTypes = {
  currentDuration: React.PropTypes.string,
  currentPath: React.PropTypes.string,
  currentProject: React.PropTypes.object,
  dispatch: React.PropTypes.func.isRequired,
  errored: React.PropTypes.bool,
  fetchedData: React.PropTypes.object,
  fetchedPaths: React.PropTypes.array,
  fetching: React.PropTypes.bool,
  pathFetching: React.PropTypes.bool,
};

const mapStateToProps = (state) => ({
  currentDuration: state.project.currentDuration,
  currentPath: state.apimetric.currentPath,
  currentProject: state.project.currentProject,
  errored: state.apimetric.errored,
  fetchedData: state.apimetric.fetchedData,
  fetchedPaths: state.apimetric.fetchedPaths,
  fetching: state.apimetric.fetching,
  pathFetching: state.apimetric.pathFetching,
});

export default connect(mapStateToProps)(Statistics);

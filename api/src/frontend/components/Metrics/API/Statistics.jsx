// React
import React from 'react';
import { connect } from 'react-redux';

// Actions
import { Metrics as MetricAction } from 'frontend/actions';

// Components
import { Empty, Error, Loading } from '../Common';
import { ResponsivePieChart } from 'frontend/core/chart';
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

  componentWillReceiveProps(nextProps) {
    const { currentDuration, currentPath, currentProject, dispatch } = this.props;
    if (nextProps.currentDuration !== currentDuration) {
      dispatch(MetricAction.getResponseMetric(currentProject.apikey, type,
        currentPath, nextProps.currentDuration));
    }
  }

  componentDidMount() {
    const { currentProject, dispatch } = this.props;
    dispatch(MetricAction.getPaths(currentProject.apikey, 'response'));
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

  _renderResponseStatusPie() {
    const title = 'responsestatus';
    const { currentDuration, currentPath, currentProject } = this.props;
    const { dispatch, errored, fetchedData, fetching } = this.props;
    if (!currentPath) {
      return (
        <Error title={title} msg="Path를 선택해주세요" />
      );
    }
    if (!fetchedData) {
      if (!fetching && !errored) {
        dispatch(MetricAction.getResponseMetric(currentProject.apikey, type,
          currentPath, currentDuration));
      }
      return (
        <Loading title={title} fetching={fetching} />
      );
    }
    const dataLen = fetchedData[title].length;
    if (dataLen === 0) {
      return (
        <Empty title={title} />
      );
    }
    const chartData = [];
    for (let i = 0; i < dataLen; i++) {
      chartData.push({
        label: fetchedData[title][i].status,
        value: fetchedData[title][i].count,
      });
    }
    return (
      <div>
        <div className="chart-wrapper-header">{title}</div>
        <ResponsivePieChart data={chartData} radius={125} innerRadius={20} valueTextFormatter={(val) => `${val}`} />
      </div>
    );
  }

  render() {
    const { currentPath, fetchedPaths, pathFetching } = this.props;
    return (
      <div>
        <Select name="path" options={fetchedPaths} onChange={::this._changePath} isLoading={pathFetching} value={currentPath} placeholder="API Path" />
        {this._renderResponseStatusPie()}
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

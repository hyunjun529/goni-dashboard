// React
import React from 'react';
import { connect } from 'react-redux';

// Actions
import { Metrics as MetricAction } from 'frontend/actions';

// Components
import { Empty, Error, Loading, getDuration, tickInterval } from '../Common';
import { ResponsiveScatterChart } from 'frontend/core/chart';
import Select from 'react-select';

// Constants
import { METRIC_CHANGE_PATH } from 'constants/metric';

const type = 'response';

function d3RespColor(idx) {
  return ['#4CAF50', '#009688', '#E91E63', '#F44336'][idx];
}

function d3RespColorAccessor(d, idx) { // eslint-disable-line no-unused-vars
  const status = parseInt(d.status, 10);
  if (status < 300) {
    return 0;
  }
  if (status < 400) {
    return 1;
  }
  if (status < 500) {
    return 2;
  }
  return 3;
}

class Response extends React.Component {
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

  _renderOverview() {
    const title = 'overview';
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
    return (
      <div>
        <div className="chart-wrapper-header">{title}</div>
        <div className="row">
          <div className="col-xs-12 col-sm-6 col-md-3 col-lg-3">
            <div className="overview-card">
              <p className="overview-card-header">min</p>
              <p className="overview-card-data">{fetchedData[title].min}</p>
            </div>
          </div>
          <div className="col-xs-12 col-sm-6 col-md-3 col-lg-3">
            <div className="overview-card">
              <p className="overview-card-header">average</p>
              <p className="overview-card-data">{fetchedData[title].mean}</p>
            </div>
          </div>
          <div className="col-xs-12 col-sm-6 col-md-3 col-lg-3">
            <div className="overview-card">
              <p className="overview-card-header">max</p>
              <p className="overview-card-data">{fetchedData[title].max}</p>
            </div>
          </div>
          <div className="col-xs-12 col-sm-6 col-md-3 col-lg-3">
            <div className="overview-card">
              <p className="overview-card-header">panic</p>
              <p className="overview-card-data">{fetchedData[title].panic}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  _renderResponseScatter() {
    const title = 'responsemap';
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
    const parsed = {
      name: title,
      values: [],
    };
    for (let i = 0; i < dataLen; i++) {
      parsed.values.push({
        x: new Date(fetchedData[title][i].time),
        y: fetchedData[title][i].res,
        status: fetchedData[title][i].status,
      });
    }
    chartData.push(parsed);
    return (
      <div>
        <div className="chart-wrapper-header">{title}</div>
        <ResponsiveScatterChart colors={d3RespColor} colorAccessor={(d, idx) => d3RespColorAccessor(d, idx)} duration={getDuration(currentDuration)} xAxisTickInterval={tickInterval(currentDuration)} data={chartData} />
      </div>
    );
  }

  _renderData() {
    return (
      <div>
        {this._renderOverview()}
      </div>
    );
  }

  render() {
    const { currentPath, fetchedPaths, pathFetching } = this.props;
    return (
      <div>
        <Select name="path" options={fetchedPaths} onChange={::this._changePath} isLoading={pathFetching} value={currentPath} placeholder="API Path" />
        {this._renderData()}
        {this._renderResponseScatter()}
      </div>
    );
  }
}

Response.propTypes = {
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

export default connect(mapStateToProps)(Response);

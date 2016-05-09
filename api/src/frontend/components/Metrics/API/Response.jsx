// React
import React from 'react';
import { connect } from 'react-redux';

// Actions
import { Metrics as MetricAction } from 'frontend/actions';

// Components
import { Empty, Error, Loading, tooltipFormat } from '../Common';
import Select from 'react-select';

// Constants
import { METRIC_CHANGE_PATH } from 'constants/metric';

const type = 'response';

class Response extends React.Component {
  componentDidMount() {
    const { currentProject, dispatch } = this.props;
    dispatch(MetricAction.getPaths(currentProject.apikey, type));
  }

  _changePath(v) {
    const { currentDuration, currentPath, currentProject } = this.props;
    const { dispatch } = this.props;
    dispatch({
      type: METRIC_CHANGE_PATH,
      path: v,
    });
    dispatch(MetricAction.getResponseMetric(currentProject.apikey, type,
      currentPath, currentDuration));
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
              <p className="overview-card-header">MIN</p>
              <p className="overview-card-data">{fetchedData[title].min ? `${fetchedData[title].min}ms` : 'no data'}</p>
            </div>
          </div>
          <div className="col-xs-12 col-sm-6 col-md-3 col-lg-3">
            <div className="overview-card">
              <p className="overview-card-header">AVERAGE</p>
              <p className="overview-card-data">{fetchedData[title].mean ? `${fetchedData[title].mean}ms` : 'no data'}</p>
            </div>
          </div>
          <div className="col-xs-12 col-sm-6 col-md-3 col-lg-3">
            <div className="overview-card">
              <p className="overview-card-header">MAX</p>
              <p className="overview-card-data">{fetchedData[title].max ? `${fetchedData[title].max}ms` : 'no data'}</p>
            </div>
          </div>
          <div className="col-xs-12 col-sm-6 col-md-3 col-lg-3">
            <div className="overview-card">
              <p className="overview-card-header">PANIC</p>
              <p className="overview-card-data">{fetchedData[title].panic ? `${fetchedData[title].panic}ms` : 'no data'}</p>
            </div>
          </div>
        </div>
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

// React
import React from 'react';
import { connect } from 'react-redux';

// Actions
import { Metrics as MetricAction } from 'frontend/actions';

// Components
import { Empty, Error, Loading } from '../Common';
import { ResponsivePieChart } from 'frontend/core/chart';
import Select from 'react-select';

const type = 'response/statistics';

class Statistics extends React.Component {
  componentWillMount() {
    const { dispatch } = this.props;
    dispatch(MetricAction.enterDashboard());
  }

  componentDidMount() {
    const { dispatch, project } = this.props;
    dispatch(MetricAction.getPaths(project.apikey, 'response'));
  }

  componentWillReceiveProps(nextProps) {
    const { dispatch, duration, path, project } = this.props;
    if (nextProps.duration !== duration) {
      dispatch(MetricAction.getResponseMetric(project.apikey, type, path, nextProps.duration));
    }
  }

  componentWillUpdate() {
  }

  _changePath(v) {
    const { dispatch, duration, project } = this.props;
    dispatch(MetricAction.changePath(v));
    dispatch(MetricAction.getResponseMetric(project.apikey, type, v, duration));
  }

  _renderResponseStatusPie() {
    const title = 'responsestatus';
    const { metric, metricError, metricFetching, path } = this.props;
    if (!path) {
      return (
        <Error title={title} msg="Path를 선택해주세요" />
      );
    }
    if (metricFetching) {
      return (
        <Loading title={title} fetching={metricFetching} />
      );
    }
    if (!metric) {
      if (metricError) {
        return (
          <Error title={title} msg={metricError} />
        );
      }
      return (
        <Error title={title} msg="Unknown Error" />
      );
    }
    if (!(title in metric) || metric[title].length === 0) {
      return (
        <Empty title={title} />
      );
    }
    const dataLen = metric[title].length;
    const chartData = [];
    for (let i = 0; i < dataLen; i++) {
      chartData.push({
        label: metric[title][i].status,
        value: metric[title][i].count,
      });
    }
    return (
      <div>
        <div className="chart-wrapper-header">{title}</div>
        <ResponsivePieChart data={chartData} radius={100} innerRadius={20} valueTextFormatter={(val) => `${val}`} />
      </div>
    );
  }

  render() {
    const { path, pathList, pathFetching } = this.props;
    return (
      <div>
        <Select name="path" options={pathList} onChange={::this._changePath} isLoading={pathFetching} value={path} placeholder="API Path" />
        {this._renderResponseStatusPie()}
      </div>
    );
  }
}

Statistics.propTypes = {
  duration: React.PropTypes.string,
  dispatch: React.PropTypes.func.isRequired,
  metric: React.PropTypes.object,
  metricError: React.PropTypes.string,
  metricFetching: React.PropTypes.bool,
  path: React.PropTypes.string,
  pathList: React.PropTypes.array,
  pathError: React.PropTypes.string,
  pathFetching: React.PropTypes.bool,
  project: React.PropTypes.object,
};

const mapStateToProps = (state) => ({
  duration: state.metrics.filter.time,
  metric: state.metrics.metric.data,
  metricError: state.metrics.metric.error,
  metricFetching: state.metrics.metric.fetching,
  path: state.metrics.filter.selected,
  pathList: state.metrics.filter.data,
  pathError: state.metrics.filter.error,
  pathFetching: state.metrics.filter.fetching,
  project: state.project.project.data,
});

export default connect(mapStateToProps)(Statistics);

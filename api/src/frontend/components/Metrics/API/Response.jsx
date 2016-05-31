import _ from 'lodash';

// React
import React from 'react';
import { connect } from 'react-redux';

// Actions
import { Metrics as MetricAction } from 'frontend/actions';

// Components
import { Empty, Error, Loading } from '../Common';
import SankeyChart from 'frontend/core/chart/SankeyChart';
import ReactEcharts from 'react-echarts-component';
import Select from 'react-select';

const type = 'response';

const responseColorAccessor = (s) => {
  const status = parseInt(s, 10);
  if (status < 400) {
    return '#4c80f1';
  }
  if (status < 500) {
    return '#ffda00';
  }
  return '#ff7595';
};

class Response extends React.Component {
  componentWillMount() {
    const { dispatch } = this.props;
    dispatch(MetricAction.enterDashboard());
  }

  componentDidMount() {
    const { dispatch, project } = this.props;
    dispatch(MetricAction.getPaths(project.apikey, type));
  }

  componentWillReceiveProps(nextProps) {
    const { dispatch, duration, path, project } = this.props;
    if (nextProps.duration !== duration) {
      dispatch(MetricAction.getResponseMetric(project.apikey, type, path, nextProps.duration));
    }
  }

  _changePath(v) {
    const { dispatch, duration, project } = this.props;
    dispatch(MetricAction.changePath(v));
    dispatch(MetricAction.getResponseMetric(project.apikey, type, v, duration));
  }

  _renderData(dataId, title) {
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
    if (!(dataId in metric) || metric[dataId].length === 0) {
      return (
        <Empty title={title} />
      );
    }
    switch (dataId) {
      case 'overview':
        return this._renderOverview();
      case 'responsegraph':
        return this._renderResponseGraph();
      case 'responsemap':
        return this._renderResponseScatter();
      default:
        return false;
    }
  }

  _renderOverview() {
    const dataId = 'overview';
    const title = 'Overview';
    const { metric } = this.props;
    return (
      <div>
        <div className="chart-wrapper-header">{title}</div>
        <div className="row">
          <div className="col-xs-12 col-sm-6 col-md-3 col-lg-3">
            <div className="overview-card">
              <p className="overview-card-header">min</p>
              <p className="overview-card-data">{metric[dataId].min}</p>
            </div>
          </div>
          <div className="col-xs-12 col-sm-6 col-md-3 col-lg-3">
            <div className="overview-card">
              <p className="overview-card-header">average</p>
              <p className="overview-card-data">{metric[dataId].mean}</p>
            </div>
          </div>
          <div className="col-xs-12 col-sm-6 col-md-3 col-lg-3">
            <div className="overview-card">
              <p className="overview-card-header">max</p>
              <p className="overview-card-data">{metric[dataId].max}</p>
            </div>
          </div>
          <div className="col-xs-12 col-sm-6 col-md-3 col-lg-3">
            <div className="overview-card">
              <p className="overview-card-header">panic</p>
              <p className="overview-card-data">{metric[dataId].panic}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  _renderResponseGraph() {
    const dataId = 'responsegraph';
    const title = 'Response Trace';
    const { duration, metric } = this.props;
    const dataLen = metric[dataId].length;
    const chartData = {
      nodes: [
        { name: 'Request' },
      ],
      links: [],
    };
    const targetIndex = [];
    for (let i = 0; i < dataLen; i++) {
      let breadcrumb = [];
      try {
        breadcrumb = JSON.parse(metric[dataId][i].breadcrumb);
      } catch (err) { // eslint-disable-line no-empty-block
      }
      const breadcrumbLen = breadcrumb.length;
      const count = metric[dataId][i].count;
      const status = metric[dataId][i].status;
      if (_.indexOf(targetIndex, status) === -1) {
        chartData.nodes.push({
          name: status,
        });
        targetIndex.push(status);
      }
      if (breadcrumbLen === 0) {
        chartData.links.push({
          source: 0,
          target: _.indexOf(targetIndex, status) + 1,
          value: count,
        });
        continue;
      }
      for (let j = 0; j < breadcrumbLen; j++) {
        const target = breadcrumb[j];
        if (_.indexOf(targetIndex, target) === -1) {
          chartData.nodes.push({
            name: target,
          });
          targetIndex.push(target);
        }
        const statusIdx = _.indexOf(targetIndex, status) + 1;
        const targetIdx = _.indexOf(targetIndex, target) + 1;
        if (breadcrumbLen === 1) {
          chartData.links.push({
            source: 0,
            target: targetIdx,
            value: count,
          });
          chartData.links.push({
            source: targetIdx,
            target: statusIdx,
            value: count,
          });
          continue;
        }
        if (j === 0) {
          chartData.links.push({
            source: 0,
            target: targetIdx,
            value: count,
          });
          continue;
        }
        chartData.links.push({
          source: _.indexOf(targetIndex, breadcrumb[j - 1]) + 1,
          target: targetIdx,
          value: count,
        });
        if (j === breadcrumbLen - 1) {
          chartData.links.push({
            source: targetIdx,
            target: statusIdx,
            value: count,
          });
          continue;
        }
      }
    }
    // TODO : add modal when graph clicked
    return (
      <div>
        <div className="chart-wrapper-header">{title}</div>
        <SankeyChart clickFunc={(e) => e} data={chartData} duration={duration} />
      </div>
    );
  }

  _renderResponseScatter() {
    const dataId = 'responsemap';
    const title = 'Response Status / Time';
    const { metric } = this.props;
    const dataLen = metric[dataId].length;
    const option = {
      tooltip: {
        formatter: (params) => {
          return `Status ${params.seriesName}<br/>${params.value[0]}<br/>${params.value[1]}ms`;
        },
      },
      legend: {
        data: [],
        left: 'right',
      },
      xAxis: [
        {
          type: 'time',
          scale: true,
          splitLine: {
            show: false,
          },
        },
      ],
      yAxis: [
        {
          type: 'value',
          scale: true,
          axisLabel: {
            formatter: '{value}ms',
          },
          splitLine: {
            lineStyle: {
              type: 'dotted',
            },
          },
        },
      ],
      series: [],
    };
    const tempData = {};
    for (let i = 0; i < dataLen; i++) {
      const status = metric[dataId][i].status;
      if (!tempData[status]) {
        tempData[status] = {
          name: status,
          type: 'scatter',
          itemStyle: {
            normal: {
              color: responseColorAccessor(status),
            },
          },
          data: [],
        };
        option.legend.data.push(status);
      }
      tempData[status].data.push([new Date(metric[dataId][i].time), metric[dataId][i].res]);
    }
    _.forEach(tempData, (v) => {
      option.series.push(v);
    });
    option.legend.data = _.sortBy(option.legend.data);
    return (
      <div>
        <div className="chart-wrapper-header">{title}</div>
        <div className="chart-wrapper">
          <ReactEcharts option={option} height={300} />
        </div>
      </div>
    );
  }

  render() {
    const { path, pathList, pathFetching } = this.props;
    return (
      <div>
        <Select name="path" options={pathList} onChange={::this._changePath} isLoading={pathFetching} value={path} placeholder="API Path" />
        {this._renderData('overview', 'Overview')}
        {this._renderData('responsemap', 'Response Time')}
        {this._renderData('responsegraph', 'Response Trace')}
      </div>
    );
  }
}

Response.propTypes = {
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

export default connect(mapStateToProps)(Response);

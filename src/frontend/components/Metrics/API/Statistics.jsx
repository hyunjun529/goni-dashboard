import _ from 'lodash';

// React
import React from 'react';
import { connect } from 'react-redux';

// Actions
import { Metrics as MetricAction } from 'frontend/actions';

// Components
import { Empty, Error, Loading, responseColorAccessor } from '../Common';
import ReactEcharts from 'react-echarts-component';
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
      case 'responsestatus':
        return this._renderResponseStatusPie(dataId, title);
      case 'responsebrowser':
        return this._renderResponseBrowserPie(dataId, title);
      default:
        return false;
    }
  }

  _renderResponseStatusPie(dataId, title) {
    const { metric } = this.props;
    const dataLen = metric[dataId].length;
    const option = {
      tooltip: {
        trigger: 'item',
        formatter: 'Status {b}<br/>{c} ({d}%)',
      },
      legend: {
        orient: 'vertical',
        x: 'right',
        data: [],
      },
      series: [],
    };
    const tempData = {
      type: 'pie',
      radius: ['50%', '70%'],
      avoidLabelOverlap: false,
      label: {
        normal: {
          show: false,
        },
        emphasis: {
          show: false,
        },
      },
      labelLine: {
        normal: {
          show: false,
        },
      },
      data: [],
    };
    for (let i = 0; i < dataLen; i++) {
      const status = metric[dataId][i].status;
      option.legend.data.push(status);
      tempData.data.push({
        name: status,
        value: metric[dataId][i].count,
        itemStyle: {
          normal: {
            color: responseColorAccessor(status),
          },
        },
      });
    }
    option.series.push(tempData);
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

  _renderResponseBrowserPie(dataId, title) {
    const { metric } = this.props;
    const dataLen = metric[dataId].length;
    const option = {
      tooltip: {
        trigger: 'item',
        formatter: '{b}<br/>{c} ({d}%)',
      },
      legend: {
        orient: 'vertical',
        x: 'right',
        data: [],
      },
      series: [],
    };
    const tempData = {
      type: 'pie',
      radius: ['50%', '70%'],
      avoidLabelOverlap: false,
      label: {
        normal: {
          show: false,
        },
        emphasis: {
          show: false,
        },
      },
      labelLine: {
        normal: {
          show: false,
        },
      },
      data: [],
    };
    for (let i = 0; i < dataLen; i++) {
      const browser = metric[dataId][i].browser;
      option.legend.data.push(browser);
      tempData.data.push({
        name: browser,
        value: metric[dataId][i].count,
      });
    }
    option.series.push(tempData);
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
        {this._renderData('responsestatus', 'Status')}
        {this._renderData('responsebrowser', 'Browser Statistics')}
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

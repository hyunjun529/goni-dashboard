// React
import React from 'react';
import { connect } from 'react-redux';

// Actions
import { Metrics as MetricAction } from 'frontend/actions';

// Components
import { Empty, Error, Loading } from './Common';
import ReactEcharts from 'react-echarts-component';
import Select from 'react-select';

class Metrics extends React.Component {
  componentWillMount() {
    const { dispatch } = this.props;
    dispatch(MetricAction.enterDashboard());
  }

  componentDidMount() {
    const { dispatch, project, type } = this.props;
    dispatch(MetricAction.getInstances(project.apikey, type));
  }

  componentWillReceiveProps(nextProps) {
    const { dispatch, duration, instance, project, type } = this.props;
    if (nextProps.type !== type) {
      dispatch(MetricAction.getInstances(project.apikey, type));
    }
    if (nextProps.duration !== duration) {
      if (instance) {
        dispatch(MetricAction.getMetric(project.apikey, type,
          instance, nextProps.duration));
      }
    }
  }

  _changeInstance(v) {
    const { dispatch, duration, project, type } = this.props;
    dispatch(MetricAction.changeInstance(v));
    dispatch(MetricAction.getMetric(project.apikey, type, v, duration));
  }

  _renderChart(title, unit, mod) {
    const { instance, metric, metricError, metricFetching } = this.props;
    if (!instance) {
      return (
        <Error title={title} msg="인스턴스를 선택해주세요" />
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
    const axisLine = {
      lineStyle: {
        color: '#4d5256',
      },
    };
    const chartData = {
      color: ['#4c80f1'],
      tooltip: {
        trigger: 'axis',
      },
      grid: {
        containLabel: true,
      },
      xAxis: {
        type: 'time',
        axisLabel: {
          textStyle: {
            color: '#4d5256',
          },
        },
        axisLine,
      },
      yAxis: {
        type: 'value',
        minInterval: 1,
        axisLabel: {
          formatter: `{value}${unit}`,
          textStyle: {
            color: '#4d5256',
          },
        },
        axisLine,
      },
      series: [],
    };
    const data = {
      name: title,
      type: 'line',
      data: [],
    };
    for (let i = 0; i < dataLen; i++) {
      const time = new Date(metric[title][i].time);
      const d = {
        name: time.toString(),
        value: [time, [metric[title][i].max / mod]],
      };
      data.data.push(d);
    }
    chartData.series.push(data);
    return (
      <div>
        <div className="chart-wrapper-header">{title}</div>
        <div className="chart-wrapper">
          <ReactEcharts option={chartData} height={300} />
        </div>
      </div>
    );
  }

  _renderData() {
    const { type } = this.props;
    switch (type) {
      case 'expvar':
        return (
          <div>
            {this._renderChart('alloc', 'KB', 1024)}
            {this._renderChart('heapalloc', 'KB', 1024)}
            {this._renderChart('heapinuse', 'KB', 1024)}
            {this._renderChart('numgc', '', 1)}
            {this._renderChart('pausetotalns', 'ms', 1000000)}
            {this._renderChart('sys', 'KB', 1024)}
          </div>
        );

      case 'runtime':
        return (
          <div>
            {this._renderChart('cgo', '', 1)}
            {this._renderChart('goroutine', '', 1)}
          </div>
        );

      default:
        return false;
    }
  }

  render() {
    const { instance, instanceList, instanceFetching } = this.props;
    return (
      <div>
        <Select name="instance" options={instanceList} onChange={::this._changeInstance} isLoading={instanceFetching} value={instance} placeholder="Instance" />
        {this._renderData()}
      </div>
    );
  }
}

Metrics.propTypes = {
  duration: React.PropTypes.string,
  dispatch: React.PropTypes.func.isRequired,
  instance: React.PropTypes.string,
  instanceList: React.PropTypes.array,
  instanceError: React.PropTypes.string,
  instanceFetching: React.PropTypes.bool,
  metric: React.PropTypes.object,
  metricError: React.PropTypes.string,
  metricFetching: React.PropTypes.bool,
  project: React.PropTypes.object,
  type: React.PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
  duration: state.metrics.filter.time,
  instance: state.metrics.filter.selected,
  instanceList: state.metrics.filter.data,
  instanceError: state.metrics.filter.error,
  instanceFetching: state.metrics.filter.fetching,
  metric: state.metrics.metric.data,
  metricError: state.metrics.metric.error,
  metricFetching: state.metrics.metric.fetching,
  project: state.project.project.data,
});

export default connect(mapStateToProps)(Metrics);

import _ from 'lodash';

// React
import React from 'react';
import { connect } from 'react-redux';

// Actions
import { Metrics as MetricAction } from 'frontend/actions';

// Components
import { Empty, Error, Loading, responseColorAccessor } from '../Common';
import SankeyChart from 'frontend/core/chart/SankeyChart';
import ReactEcharts from 'react-echarts-component';
import Modal from 'react-modal';
import Select from 'react-select';

// Constants
import { metricModalStyle } from 'constants/metric';

const type = 'response';

class Response extends React.Component {
  breadcrumbCalculated: null;

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

  _closeModal() {
    const { dispatch } = this.props;
    dispatch(MetricAction.closeModal());
  }

  _handleAPIDetailClick(e) {
    const { dispatch } = this.props;
    if (e.source && e.target) {
      const data = {
        min: 0,
        mean: 0,
        max: 0,
      };
      const t = this.breadcrumbCalculated[e.source.name][e.target.name].time;
      const tLen = t.length;
      for (let i = 0; i < tLen; i++) {
        data.min += t[i].min;
        data.mean += t[i].mean;
        data.max += t[i].max;
      }
      data.min = ~~(data.min / tLen);
      data.mean = ~~(data.mean / tLen);
      data.max = ~~(data.max / tLen);
      dispatch(MetricAction.openCrumbModal(`${e.source.name} > ${e.target.name}`, data));
    }
  }

  _renderModal() {
    const { isModalOpen, selectedCrumb } = this.props;
    if (!selectedCrumb) {
      return false;
    }
    return (
      <Modal isOpen={isModalOpen} onRequestClose={::this._closeModal} style={metricModalStyle} >
        <div className="chart-wrapper-header">{selectedCrumb.title}</div>
        <div className="row">
          <div className="col-xs-12 col-sm-12 col-md-4 col-lg-4">
            <div className="overview-card">
              <p className="overview-card-header">min</p>
              <p className="overview-card-data">{~~selectedCrumb.min}ms</p>
            </div>
          </div>
          <div className="col-xs-12 col-sm-12 col-md-4 col-lg-4">
            <div className="overview-card">
              <p className="overview-card-header">mean</p>
              <p className="overview-card-data">{~~selectedCrumb.mean}ms</p>
            </div>
          </div>
          <div className="col-xs-12 col-sm-12 col-md-4 col-lg-4">
            <div className="overview-card">
              <p className="overview-card-header">max</p>
              <p className="overview-card-data">{~~selectedCrumb.max}ms</p>
            </div>
          </div>
        </div>
      </Modal>
    );
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
    const { metric } = this.props;
    // Process Data
    const processedData = {};
    _.forEach(metric[dataId], (data, status) => {
      _.forEach(data, (v, crumb) => {
        let breadcrumb = [];
        try {
          breadcrumb = JSON.parse(crumb);
        } catch (err) { // eslint-disable-line no-empty-block
        }
        const breadcrumbLen = breadcrumb.length;
        if (breadcrumbLen === 0) {
          if (!processedData.Request) {
            processedData.Request = {};
          }
          if (!processedData.Request[status]) {
            processedData.Request[status] = {};
            processedData.Request[status].count = 0;
            processedData.Request[status].time = [];
          }
          processedData.Request[status].count += v.count;
          processedData.Request[status].time.push(v.time[0]);
          return;
        }
        for (let j = 0; j < breadcrumbLen; j++) {
          if (j === 0) {
            if (!processedData.Request) {
              processedData.Request = {};
            }
            if (!processedData.Request[breadcrumb[j]]) {
              processedData.Request[breadcrumb[j]] = {};
              processedData.Request[breadcrumb[j]].count = 0;
              processedData.Request[breadcrumb[j]].time = [];
            }
            processedData.Request[breadcrumb[j]].count += v.count;
            processedData.Request[breadcrumb[j]].time.push(v.time[j]);
            if (breadcrumbLen >= 2) {
              if (!processedData[breadcrumb[j]]) {
                processedData[breadcrumb[j]] = {};
              }
              if (!processedData[breadcrumb[j]][breadcrumb[j + 1]]) {
                processedData[breadcrumb[j]][breadcrumb[j + 1]] = {};
                processedData[breadcrumb[j]][breadcrumb[j + 1]].count = 0;
                processedData[breadcrumb[j]][breadcrumb[j + 1]].time = [];
              }
              processedData[breadcrumb[j]][breadcrumb[j + 1]].count += v.count;
              processedData[breadcrumb[j]][breadcrumb[j + 1]].time.push(v.time[j + 1]);
            }
          } else if (j !== breadcrumbLen - 1) {
            if (!processedData[breadcrumb[j]]) {
              processedData[breadcrumb[j]] = {};
            }
            if (!processedData[breadcrumb[j]][breadcrumb[j + 1]]) {
              processedData[breadcrumb[j]][breadcrumb[j + 1]] = {};
              processedData[breadcrumb[j]][breadcrumb[j + 1]].count = 0;
              processedData[breadcrumb[j]][breadcrumb[j + 1]].time = [];
            }
            processedData[breadcrumb[j]][breadcrumb[j + 1]].count += v.count;
            processedData[breadcrumb[j]][breadcrumb[j + 1]].time.push(v.time[j + 1]);
          }
          if (j === breadcrumb.length - 1) {
            if (!processedData[breadcrumb[j]]) {
              processedData[breadcrumb[j]] = {};
            }
            if (!processedData[breadcrumb[j]][status]) {
              processedData[breadcrumb[j]][status] = {};
              processedData[breadcrumb[j]][status].count = 0;
              processedData[breadcrumb[j]][status].time = [];
            }
            processedData[breadcrumb[j]][status].count += v.count;
            processedData[breadcrumb[j]][status].time.push(v.time[j + 1]);
            continue;
          }
        }
      });
    });
    this.breadcrumbCalculated = processedData;
    const chartData = {
      nodes: [],
      links: [],
    };
    const targetIndex = [];
    _.forEach(processedData, (targetData, source) => {
      _.forEach(targetData, (data, target) => {
        if (_.indexOf(targetIndex, source) === -1) {
          chartData.nodes.push({
            name: source,
          });
          targetIndex.push(source);
        }
        if (_.indexOf(targetIndex, target) === -1) {
          chartData.nodes.push({
            name: target,
          });
          targetIndex.push(target);
        }
        chartData.links.push({
          source: _.indexOf(targetIndex, source),
          target: _.indexOf(targetIndex, target),
          value: data.count,
        });
      });
    });
    return (
      <div>
        <div className="chart-wrapper-header">{title}</div>
        <SankeyChart clickFunc={(e) => this._handleAPIDetailClick(e)} data={chartData} />
      </div>
    );
  }

  _renderResponseScatter() {
    const dataId = 'responsemap';
    const title = 'Response Status / Time';
    const { metric } = this.props;
    const option = {
      tooltip: {
        formatter: (params) => {
          return `Status ${params.seriesName}<br/>${params.value[0]}<br/>${params.value[2]}<br/>${params.value[3]} transaction(s)`;
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
          minInterval: 250,
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
    _.forEach(metric[dataId], (data, status) => {
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
      _.forEach(data, (v, tg) => {
        _.forEach(v, (count, time) => {
          let tooltipText = '';
          if (tg === '0') {
            tooltipText = '< 0ms';
          } else if (tg === '60') {
            tooltipText = '>= 15s';
          } else {
            tooltipText = `${(tg - 1) * 250} ~ ${tg * 250}ms`;
          }
          tempData[status].data.push([
            new Date(Number(time)),
            tg * 250,
            tooltipText,
            count]);
        });
      });
    });
    _.forEach(tempData, (v) => {
      option.series.push(v);
    });
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
        {this._renderModal()}
        <div>
          <Select name="path" options={pathList} onChange={::this._changePath} isLoading={pathFetching} value={path} placeholder="API Path" />
          {this._renderData('overview', 'Overview')}
          {this._renderData('responsemap', 'Response Time')}
          {this._renderData('responsegraph', 'Response Trace')}
        </div>
      </div>
    );
  }
}

Response.propTypes = {
  duration: React.PropTypes.string,
  dispatch: React.PropTypes.func.isRequired,
  isModalOpen: React.PropTypes.bool,
  metric: React.PropTypes.object,
  metricError: React.PropTypes.string,
  metricFetching: React.PropTypes.bool,
  path: React.PropTypes.string,
  pathList: React.PropTypes.array,
  pathError: React.PropTypes.string,
  pathFetching: React.PropTypes.bool,
  project: React.PropTypes.object,
  selectedCrumb: React.PropTypes.object,
};

const mapStateToProps = (state) => ({
  duration: state.metrics.filter.time,
  isModalOpen: state.metrics.metric.modal.isOpened,
  metric: state.metrics.metric.data,
  metricError: state.metrics.metric.error,
  metricFetching: state.metrics.metric.fetching,
  path: state.metrics.filter.selected,
  pathList: state.metrics.filter.data,
  pathError: state.metrics.filter.error,
  pathFetching: state.metrics.filter.fetching,
  project: state.project.project.data,
  selectedCrumb: state.metrics.overview.crumb.selected,
});

export default connect(mapStateToProps)(Response);

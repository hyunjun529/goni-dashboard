import _ from 'lodash';

// React
import React from 'react';
import { connect } from 'react-redux';

// Actions
import { Metrics as MetricAction } from 'frontend/actions';

// Components
import CalHeatMap from 'cal-heatmap';
import { Empty, Error, Loading, responseColorAccessor } from './Common';
import SankeyChart from 'frontend/core/chart/SankeyChart';
import ReactEcharts from 'react-echarts-component';

class Transaction extends React.Component {
  cal: null;

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch(MetricAction.enterOverviewDashboard());
  }

  componentDidMount() {
    const { dispatch, project } = this.props;
    dispatch(MetricAction.getOverviewCPU(project.apikey));
  }

  componentDidUpdate() {
    this._updateHeatmap();
  }

  _handleAPIClick(e) {
    const { dispatch, project, selectedCPU } = this.props;
    dispatch(MetricAction.getOverviewAPIDetail(project.apikey, e.name, selectedCPU));
  }

  _handleAPIDetailClick(e) {
  }

  _renderBaseData(dataId, title) {
    const { apiData, apiFetching, selectedCPU } = this.props;
    if (!selectedCPU) {
      return (
        <Error title={title} msg="Status Box를 선택해주세요." />
      );
    }
    if (apiFetching) {
      return (
        <Loading title={title} fetching={apiFetching} />
      );
    }
    if (!apiData[dataId] || apiData[dataId].length === 0) {
      return (
        <Empty title={title} />
      );
    }
    switch (dataId) {
      case 'user':
        return this._renderLineChart(dataId, title, false);
      case 'transaction':
        return this._renderTransactions(title);
      default:
        return false;
    }
  }

  _renderAPIData(dataId, title) {
    const { apiDetailData, apiDetailFetching, selectedAPI } = this.props;
    if (!selectedAPI) {
      return (
        <Error title={title} msg="API를 선택해주세요." />
      );
    }
    if (apiDetailFetching) {
      return (
        <Loading title={title} fetching={apiDetailFetching} />
      );
    }
    if (!apiDetailData[dataId] || apiDetailData[dataId].length === 0) {
      return (
        <Empty title={title} />
      );
    }
    switch (dataId) {
      case 'transactionCount':
        return this._renderLineChart(dataId, title, true);
      case 'systemStatus':
        return this._renderSystemChart(dataId, title);
      case 'transactionTrace':
        return this._renderAPITrace(dataId);
      default:
        return false;
    }
  }

  _renderAPITrace(dataId) {
    const { apiDetailData, selectedAPI } = this.props;
    const title = selectedAPI;
    const dataLen = apiDetailData[dataId].length;
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
        breadcrumb = JSON.parse(apiDetailData[dataId][i].breadcrumb);
      } catch (err) { // eslint-disable-line no-empty-block
      }
      const breadcrumbLen = breadcrumb.length;
      const count = apiDetailData[dataId][i].count;
      const status = apiDetailData[dataId][i].status;
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
    return (
      <div>
        <div className="chart-wrapper-header">{title}</div>
        <SankeyChart clickFunc={(e) => this._handleAPIDetailClick(e)} data={chartData} />
      </div>
    );
  }

  _renderTransactions(title) {
    const { apiData } = this.props;
    const option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      grid: {
        containLabel: true,
      },
      legend: {
        data: [],
      },
      xAxis: {
        type: 'value',
        minInterval: 1,
      },
      yAxis: {
        type: 'category',
        data: [],
      },
      series: [],
    };
    const sorted = _.sortBy(apiData.transaction, (o) => {
      return o.mean * o.count;
    }).reverse();
    for (let i = 0; i < (sorted.length < 5 ? sorted.length : 5); i++) {
      option.yAxis.data.push(sorted[i].path);
    }
    let status = _.uniqBy(apiData.transactionStatus, (o) => { return o.status; });
    status = _.sortBy(status, (o) => { return o.status; });
    for (let i = 0; i < status.length; i++) {
      option.legend.data.push(status[i].status);
      option.series.push({
        name: status[i].status,
        type: 'bar',
        stack: 'resp',
        itemStyle: {
          normal: {
            color: responseColorAccessor(status[i].status),
          },
        },
        data: [],
      });
    }
    const tempData = {};
    _.forEach(apiData.transactionStatus, (o) => {
      if (!tempData[o.path]) {
        tempData[o.path] = {};
      }
      tempData[o.path][o.status] = o.count;
    });
    for (let i = 0; i < option.yAxis.data.length; i++) {
      for (let j = 0; j < option.legend.data.length; j++) {
        const di = option.yAxis.data[i];
        const li = option.legend.data[j];
        if (tempData[di][li]) {
          option.series[j].data.push(tempData[di][li]);
        } else {
          option.series[j].data.push(null);
        }
      }
    }
    return (
      <div>
        <div className="chart-wrapper-header">{title}</div>
        <div className="chart-wrapper">
          <ReactEcharts onClick={(e) => this._handleAPIClick(e)} option={option} height={300} />
        </div>
      </div>
    );
  }

  _renderLineChart(dataId, title, isDetail) {
    const { apiData, apiDetailData } = this.props;
    const axisLine = {
      lineStyle: {
        color: '#4d5256',
      },
    };
    const axisLabel = {
      textStyle: {
        color: '#4d5256',
      },
    };
    const option = {
      color: ['#4c80f1'],
      tooltip: {
        trigger: 'axis',
      },
      grid: {
        containLabel: true,
      },
      xAxis: {
        type: 'time',
        axisLabel,
        axisLine,
      },
      yAxis: {
        type: 'value',
        axisLabel,
        axisLine,
        minInterval: 1,
      },
      series: [],
    };
    const data = {
      name: title,
      type: 'line',
      data: [],
    };
    const renderData = isDetail ? apiDetailData : apiData;
    const dataLen = renderData[dataId].length;
    for (let i = 0; i < dataLen; i++) {
      const time = new Date(renderData[dataId][i].time);
      const d = {
        name: time.toString(),
        value: [time, [renderData[dataId][i].value]],
      };
      data.data.push(d);
    }
    option.series.push(data);
    return (
      <div>
        <div className="chart-wrapper-header">{title}</div>
        <div className="chart-wrapper">
          <ReactEcharts option={option} height={300} />
        </div>
      </div>
    );
  }

  _renderLineChart(dataId, title, isDetail) {
    const { apiData, apiDetailData } = this.props;
    const axisLine = {
      lineStyle: {
        color: '#4d5256',
      },
    };
    const axisLabel = {
      textStyle: {
        color: '#4d5256',
      },
    };
    const option = {
      color: ['#4c80f1'],
      tooltip: {
        trigger: 'axis',
      },
      grid: {
        containLabel: true,
      },
      xAxis: {
        type: 'time',
        axisLabel,
        axisLine,
      },
      yAxis: {
        type: 'value',
        axisLabel,
        axisLine,
        minInterval: 1,
      },
      series: [],
    };
    const data = {
      name: title,
      type: 'line',
      data: [],
    };
    const renderData = isDetail ? apiDetailData : apiData;
    const dataLen = renderData[dataId].length;
    for (let i = 0; i < dataLen; i++) {
      const time = new Date(renderData[dataId][i].time);
      const d = {
        name: time.toString(),
        value: [time, [renderData[dataId][i].value]],
      };
      data.data.push(d);
    }
    option.series.push(data);
    return (
      <div>
        <div className="chart-wrapper-header">{title}</div>
        <div className="chart-wrapper">
          <ReactEcharts option={option} height={300} />
        </div>
      </div>
    );
  }

  _renderSystemChart(dataId, title) {
    const { apiDetailData } = this.props;
    const axisLine = {
      lineStyle: {
        color: '#4d5256',
      },
    };
    const axisLabel = {
      textStyle: {
        color: '#4d5256',
      },
    };
    const option = {
      tooltip: {
        trigger: 'axis',
      },
      legend: {
        data: [],
      },
      grid: {
        containLabel: true,
      },
      xAxis: {
        type: 'time',
        axisLabel,
        axisLine,
      },
      yAxis: {
        type: 'value',
        axisLabel,
        axisLine,
      },
      series: [],
    };
    _.forEach(apiDetailData[dataId], (v) => {
      const d = [];
      _.forEach(v, (o) => {
        const time = new Date(o.time);
        d.push({
          name: time.toString(),
          value: [time, [o.max]],
        });
      });
      option.legend.data.push(v[0].instance);
      option.series.push({
        name: v[0].instance,
        type: 'line',
        data: d,
      });
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

  _updateHeatmap() {
    const { cpuData, dispatch, project } = this.props;
    if (!cpuData) {
      return;
    }
    const date = new Date((new Date) * 1 - 1000 * 3600 * 23);
    if (!this.cal) {
      this.cal = new CalHeatMap();
      this.cal.init({
        cellSize: 15,
        colLimit: 2,
        data: cpuData,
        displayLegend: true,
        domain: 'hour',
        domainGutter: 10,
        legend: [20, 40, 60, 80],
        legendColors: {
          base: '#e1e4e6',
          min: '#87b1f3',
          max: '#2c5ae9',
        },
        legendTitleFormat: {
          lower: '< {min}%',
          inner: '{down}% ~ {up}%',
          upper: '{max}% <',
        },
        onClick: (d) => {
          dispatch(MetricAction.getOverviewAPIByTime(project.apikey, d / 1000));
        },
        range: 24,
        start: date,
        subDomain: 'min',
        subDomainStep: 5,
        subDomainTitleFormat: {
          empty: 'No cpu data on {date}',
          filled: 'Max {count}% @ {date}',
        },
        tooltip: true,
      });
      return;
    }
    this.cal.update(cpuData);
  }

  render() {
    return (
      <div>
        <div className="chart-wrapper-header">System Status</div>
        <div id="cal-heatmap" />
        <div className="row">
          <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
            {this._renderBaseData('user', 'Active User')}
          </div>
          <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
            {this._renderBaseData('transaction', 'Top 5 Transactions')}
          </div>
          <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
            {this._renderAPIData('transactionCount', 'Transaction Count')}
          </div>
          <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
            {this._renderAPIData('systemStatus', 'Top 5 Instances')}
          </div>
          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
            {this._renderAPIData('transactionTrace', 'Transaction Trace')}
          </div>
        </div>
      </div>
    );
  }
}

Transaction.propTypes = {
  apiData: React.PropTypes.object,
  apiFetching: React.PropTypes.bool,
  apiDetailData: React.PropTypes.object,
  apiDetailFetching: React.PropTypes.bool,
  cpuData: React.PropTypes.object,
  dispatch: React.PropTypes.func.isRequired,
  project: React.PropTypes.object,
  selectedAPI: React.PropTypes.string,
  selectedCPU: React.PropTypes.number,
};

const mapStateToProps = (state) => ({
  apiData: state.metrics.overview.api.data,
  apiFetching: state.metrics.overview.api.fetching,
  apiDetailData: state.metrics.overview.apiDetail.data,
  apiDetailFetching: state.metrics.overview.apiDetail.fetching,
  cpuData: state.metrics.overview.cpu.data,
  project: state.project.project.data,
  selectedAPI: state.metrics.overview.api.selected,
  selectedCPU: state.metrics.overview.cpu.selected,
});

export default connect(mapStateToProps)(Transaction);

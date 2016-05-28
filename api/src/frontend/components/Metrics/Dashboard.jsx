import _ from 'lodash';

// React
import React from 'react';
import { connect } from 'react-redux';

// Actions
import { Metrics as MetricAction } from 'frontend/actions';

// Components
import CalHeatMap from 'cal-heatmap';
import { Empty, Error, Loading } from './Common';
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

  _renderTransactions() {
    const title = 'Top 5 Transaction';
    const { apiData, apiFetching, selectedCPU } = this.props;
    if (!selectedCPU) {
      return (
        <Error title={title} msg="Status를 선택해주세요" />
      );
    }
    if (apiFetching) {
      return (
        <Loading title={title} fetching={apiFetching} />
      );
    }
    if (apiData.length === 0 || apiData[0].length === 0) {
      return (
        <Empty title={title} />
      );
    }
    const option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      legend: {
        data: [],
      },
      xAxis: {
        type: 'value',
        splitNumber: 2,
      },
      yAxis: {
        type: 'category',
        data: [],
      },
      series: [],
    };
    const sorted = _.sortBy(apiData[0], (o) => {
      return o.mean * o.count;
    }).reverse();
    for (let i = 0; i < (sorted.length < 5 ? sorted.length : 5); i++) {
      option.yAxis.data.push(sorted[i].path);
    }
    const status = _.sortBy(_.uniqBy(apiData[1], (o) => { return o.status; },
      (o) => { return o.status; }));
    for (let i = 0; i < status.length; i++) {
      option.legend.data.push(status[i].status);
      option.series.push({
        name: status[i].status,
        type: 'bar',
        stack: 'resp',
        data: [],
      });
    }
    const tempData = {};
    _.forEach(apiData[1], (o) => {
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
        <ReactEcharts option={option} height={300} />
      </div>
    );
  }

  _updateHeatmap() {
    const { cpuData, dispatch, project } = this.props;
    if (!cpuData) {
      return;
    }
    const date = new Date((new Date) * 1 - 1000 * 3600 * 6);
    if (!this.cal) {
      this.cal = new CalHeatMap();
      this.cal.init({
        cellSize: 15,
        colLimit: 2,
        data: cpuData,
        displayLegend: true,
        domain: 'hour',
        domainGutter: 10,
        legend: [25, 50, 75],
        legendColors: {
          base: '#ffffff',
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
        range: 7,
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
        {this._renderTransactions()}
      </div>
    );
  }
}

Transaction.propTypes = {
  apiData: React.PropTypes.array,
  apiFetching: React.PropTypes.bool,
  cpuData: React.PropTypes.object,
  dispatch: React.PropTypes.func.isRequired,
  project: React.PropTypes.object,
  selectedCPU: React.PropTypes.number,
};

const mapStateToProps = (state) => ({
  apiData: state.metrics.overview.api.data,
  apiFetching: state.metrics.overview.api.fetching,
  cpuData: state.metrics.overview.cpu.data,
  project: state.project.project.data,
  selectedCPU: state.metrics.overview.cpu.selected,
});

export default connect(mapStateToProps)(Transaction);

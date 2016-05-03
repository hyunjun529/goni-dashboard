// React
import React from 'react';
import { connect } from 'react-redux';

// Actions
import Actions from 'actions/Metric';

// Components
import { Empty, Loading, tooltipFormat } from './Common';
import { ResponsiveLineChart } from 'core/chart';

class Expvar extends React.Component {
  componentDidMount() {
    const { currentDuration, currentProject, dispatch } = this.props;
    dispatch(Actions.getGoniPlus(currentProject.apikey, 'expvar', currentDuration));
  }

  _renderChart(title, unit, mod) {
    const { currentDuration, currentProject } = this.props;
    const { dispatch, errored, fetchedData, fetching } = this.props;
    if (!fetchedData) {
      if (!fetching && !errored) {
        dispatch(Actions.getGoniPlus(currentProject.apikey, 'expvar', currentDuration));
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
        y: fetchedData[title][i][title] / mod,
      });
    }
    chartData.push(parsed);
    return (
      <div>
        <div className="chart-wrapper-header">{title}</div>
        <ResponsiveLineChart data={chartData} tooltipFormat={(v) => tooltipFormat(v, unit)} />
      </div>
    );
  }

  render() {
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
  }
}

Expvar.propTypes = {
  currentDuration: React.PropTypes.string,
  currentProject: React.PropTypes.object,
  dispatch: React.PropTypes.func.isRequired,
  errored: React.PropTypes.bool,
  fetchedData: React.PropTypes.object,
  fetching: React.PropTypes.bool,
};

const mapStateToProps = (state) => ({
  currentDuration: state.project.currentDuration,
  currentProject: state.project.currentProject,
  errored: state.metric.errored,
  fetchedData: state.metric.fetchedData,
  fetching: state.metric.fetching,
});

export default connect(mapStateToProps)(Expvar);

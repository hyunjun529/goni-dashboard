// React
import React from 'react';
import { connect } from 'react-redux';

// Actions
import Actions from 'actions/Metric';

// Components
import { Empty, Loading, tooltipFormat } from './Common';
import { ResponsiveLineChart } from 'core/chart';

class Runtime extends React.Component {
  componentDidMount() {
    const { currentDuration, currentProject, dispatch } = this.props;
    dispatch(Actions.getGoniPlus(currentProject.apikey, 'runtime', currentDuration));
  }

  _renderChart(title) {
    const { fetchedData, fetching } = this.props;
    if (!fetchedData) {
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
        y: fetchedData[title][i][title],
      });
    }
    chartData.push(parsed);
    return (
      <div>
        <div className="chart-wrapper-header">{title}</div>
        <ResponsiveLineChart data={chartData} tooltipFormat={(v) => tooltipFormat(v)} />
      </div>
    );
  }

  render() {
    return (
      <div>
        {this._renderChart('cgo')}
        {this._renderChart('goroutine')}
      </div>
    );
  }
}

Runtime.propTypes = {
  currentDuration: React.PropTypes.string,
  currentProject: React.PropTypes.object,
  dispatch: React.PropTypes.func.isRequired,
  fetchedData: React.PropTypes.object,
  fetching: React.PropTypes.bool,
};

const mapStateToProps = (state) => ({
  currentDuration: state.project.currentDuration,
  currentProject: state.project.currentProject,
  fetchedData: state.metric.fetchedData,
  fetching: state.metric.fetching,
});

export default connect(mapStateToProps)(Runtime);

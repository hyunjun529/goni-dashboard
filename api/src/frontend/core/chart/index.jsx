/* eslint no-use-before-define:0 */
// https://github.com/codesuki/react-d3-components/issues/9

import React from 'react';
import d3 from 'd3';
import rd3 from 'rd3';

const {
  AreaChart,
  BarChart,
  CandleStickChart,
  LineChart,
  PieChart,
  ScatterChart,
  Treemap,
} = rd3;

const createClass = (chartType) => {
  class Chart extends React.Component {
    constructor(props) {
      super(props);
      this.state = { size: { w: 0, h: 0 } };
    }

    fitToParentSize() {
      const w = this.refs.wrapper.offsetWidth - 20;
      const h = this.refs.wrapper.offsetHeight - 20;
      const currentSize = this.state.size;
      if (w !== currentSize.w || h !== currentSize.h) {
        this.setState({
          size: { w, h },
        });
      }
    }

    getChartClass() {
      let Component;
      switch (chartType) {
        case 'AreaChart':
          Component = AreaChart;
          break;
        case 'BarChart':
          Component = BarChart;
          break;
        case 'CandleStickChart':
          Component = CandleStickChart;
          break;
        case 'LineChart':
          Component = LineChart;
          break;
        case 'PieChart':
          Component = PieChart;
          break;
        case 'ScatterChart':
          Component = ScatterChart;
          break;
        case 'Treemap':
          Component = Treemap;
          break;
        default:
          console.error('Invalid Chart Type name.'); // eslint-disable-line no-console
          break;
      }
      return Component;
    }

    componentDidMount() {
      window.addEventListener('resize', ::this.fitToParentSize);
      this.fitToParentSize();
    }

    componentWillUnmount() {
      window.removeEventListener('resize', ::this.fitToParentSize);
    }

    render() {
      const { duration, margin, ...others } = this.props;
      const Component = this.getChartClass();
      let width = this.props.width;
      let height = this.props.height;
      width = this.state.size.w || 100;
      height = this.state.size.h || 100;
      return (
        <div className="chart-wrapper" ref="wrapper">
          { duration ?
            <Component
              width = {width}
              height = {height}
              margin = {margin}
              xScale = {d3.time.scale().domain(duration).range([0, width - 65])}
              {...others}
            /> :
            <Component
              width = {width}
              height = {height}
              margin = {margin}
              {...others}
            />
          }
        </div>
      );
    }
  }
  Chart.defaultProps = {
    margin: {
    },
  };
  Chart.propTypes = {
    duration: React.PropTypes.array,
    width: React.PropTypes.number,
    height: React.PropTypes.number,
    margin: React.PropTypes.object,
  };
  return Chart;
};

const ResponsiveAreaChart = createClass('AreaChart');
const ResponsiveBarChart = createClass('BarChart');
const ResponsiveCandleStickChart = createClass('CandleStickChart');
const ResponsiveLineChart = createClass('LineChart');
const ResponsivePieChart = createClass('PieChart');
const ResponsiveScatterChart = createClass('ScatterChart');
const ResponsiveTreemap = createClass('Treemap');

export {
  ResponsiveAreaChart,
  ResponsiveBarChart,
  ResponsiveCandleStickChart,
  ResponsiveLineChart,
  ResponsivePieChart,
  ResponsiveScatterChart,
  ResponsiveTreemap,
};

export default {
  ResponsiveAreaChart,
  ResponsiveBarChart,
  ResponsiveCandleStickChart,
  ResponsiveLineChart,
  ResponsivePieChart,
  ResponsiveScatterChart,
  ResponsiveTreemap,
};

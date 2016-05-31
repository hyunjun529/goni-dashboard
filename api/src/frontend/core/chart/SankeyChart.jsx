// https://github.com/nickbalestra/sankey/blob/master/app/SankeyChart.js
import React from 'react';
import ReactFauxDOM from 'react-faux-dom';
import d3 from './sankey';

class SankeyChart extends React.Component {
  constructor() {
    super();
    this.handler = this.fitToParentSize.bind(this);
    this.state = {
      size: { w: 0, h: 0 },
    };
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

  componentDidMount() {
    window.addEventListener('resize', this.handler);
    this.fitToParentSize();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handler);
  }

  render() {
    const { data, margin } = this.props;
    let { width, height } = this.props;
    width = this.state.size.w || 100;
    height = this.state.size.h || 100;
    const san = d3.sankey()
      .nodeWidth(15)
      .nodePadding(10)
      .size([width, height]);

    const path = san.link();
    san.nodes(data.nodes)
      .links(data.links)
      .layout(32);
    const svgNode = ReactFauxDOM.createElement('div');
    const svg = d3.select(svgNode).append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const link = svg.append('g').selectAll('.link')
      .data(data.links)
      .enter().append('path')
      .attr('class', 'link')
      .on('click', this.props.clickFunc)
      .attr('d', path)
      .style('stroke-width', (d) => Math.max(1, d.dy));
    link.append('title')
      .text((d) => `${d.source.name} → ${d.target.name}`);

    const node = svg.append('g').selectAll('.node')
      .data(data.nodes)
      .enter().append('g')
      .attr('class', 'node')
      .on('click', this.props.clickFunc)
      .attr('transform', (d) => `translate(${d.x}, ${d.y})`);
    node.append('rect')
      .attr('height', (d) => d.dy)
      .attr('width', san.nodeWidth())
      .append('title')
      .text((d) => `${d.name}`);
    node.append('text')
      .attr('x', -6)
      .attr('y', (d) => d.dy / 2)
      .attr('dy', '.35em')
      .attr('text-anchor', 'end')
      .text((d) => d.name)
      .filter((d) => d.x < width / 2)
      .attr('x', 6 + san.nodeWidth())
      .attr('text-anchor', 'start');
    return (
      <div className="chart-wrapper" ref="wrapper">
        {svgNode.toReact()}
      </div>
    );
  }
}

SankeyChart.defaultProps = {
  margin: {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
};

SankeyChart.propTypes = {
  clickFunc: React.PropTypes.func.isRequired,
  data: React.PropTypes.object.isRequired,
  height: React.PropTypes.number,
  margin: React.PropTypes.object,
  width: React.PropTypes.number,
};

export default SankeyChart;

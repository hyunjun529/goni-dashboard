/* eslint no-param-reassign:0, no-loop-func:0 */
// https://github.com/d3/d3-plugins/blob/master/sankey/sankey.js
// import d3 / es5 => es6
import d3 from 'd3';

d3.sankey = () => {
  const sankey = {};
  let nodeWidth = 24;
  let nodePadding = 8;
  let size = [1, 1];
  let nodes = [];
  let links = [];

  function center(node) {
    return node.y + node.dy / 2;
  }

  function value(link) {
    return link.value;
  }

  function computeNodeLinks() {
    nodes.forEach((node) => {
      node.sourceLinks = [];
      node.targetLinks = [];
    });
    links.forEach((link) => {
      let source = link.source;
      let target = link.target;
      if (typeof source === 'number') source = link.source = nodes[link.source];
      if (typeof target === 'number') target = link.target = nodes[link.target];
      source.sourceLinks.push(link);
      target.targetLinks.push(link);
    });
  }

  function computeNodeValues() {
    nodes.forEach((node) => {
      node.value = Math.max(
        d3.sum(node.sourceLinks, value),
        d3.sum(node.targetLinks, value)
      );
    });
  }

  function moveSinksRight(x) {
    nodes.forEach((node) => {
      if (!node.sourceLinks.length) {
        node.x = x - 1;
      }
    });
  }

  function scaleNodeBreadths(kx) {
    nodes.forEach((node) => {
      node.x *= kx;
    });
  }

  function computeNodeBreadths() {
    let x = 0;
    let nextNodes;
    let remainingNodes = nodes;

    while (remainingNodes.length) {
      nextNodes = [];
      remainingNodes.forEach((node) => {
        node.x = x;
        node.dx = nodeWidth;
        node.sourceLinks.forEach((link) => {
          if (nextNodes.indexOf(link.target) < 0) {
            nextNodes.push(link.target);
          }
        });
      });
      remainingNodes = nextNodes;
      ++x;
    }
    moveSinksRight(x);
    scaleNodeBreadths((size[0] - nodeWidth) / (x - 1));
  }

  function moveSourcesRight() { // eslint-disable-line no-unused-vars
    nodes.forEach((node) => {
      if (!node.targetLinks.length) {
        node.x = d3.min(node.sourceLinks, (d) => {
          return d.target.x;
        }) - 1;
      }
    });
  }

  function computeNodeDepths(iterations) {
    const nodesByBreadth = d3.nest()
      .key((d) => {
        return d.x;
      })
      .sortKeys(d3.ascending)
      .entries(nodes)
      .map((d) => {
        return d.values;
      });

    function initializeNodeDepth() {
      const ky = d3.min(nodesByBreadth, (nodesShadow) => {
        return (size[1] - (nodes.length - 1) * nodePadding) / d3.sum(nodesShadow, value);
      });

      nodesByBreadth.forEach((nodesShadow) => {
        nodesShadow.forEach((node, i) => {
          node.y = i;
          node.dy = node.value * ky;
        });
      });

      links.forEach((link) => {
        link.dy = link.value * ky;
      });
    }

    function relaxLeftToRight(alphaShadow) {
      function weightedSource(link) {
        return center(link.source) * link.value;
      }
      nodesByBreadth.forEach((nodesShadow, breadth) => { // eslint-disable-line no-unused-vars
        nodesShadow.forEach((node) => {
          if (node.targetLinks.length) {
            const y = d3.sum(node.targetLinks, weightedSource) / d3.sum(node.targetLinks, value);
            node.y += (y - center(node)) * alphaShadow;
          }
        });
      });
    }

    function relaxRightToLeft(alphaShadow) {
      function weightedTarget(link) {
        return center(link.target) * link.value;
      }
      nodesByBreadth.slice().reverse().forEach((nodesShadow) => {
        nodesShadow.forEach((node) => {
          if (node.sourceLinks.length) {
            const y = d3.sum(node.sourceLinks, weightedTarget) / d3.sum(node.sourceLinks, value);
            node.y += (y - center(node)) * alphaShadow;
          }
        });
      });
    }

    function ascendingDepth(a, b) {
      return a.y - b.y;
    }

    function resolveCollisions() {
      nodesByBreadth.forEach((nodesShadow) => {
        let node;
        let dy;
        let y0 = 0;
        const n = nodesShadow.length;
        let i;
        nodesShadow.sort(ascendingDepth);
        for (i = 0; i < n; ++i) {
          node = nodesShadow[i];
          dy = y0 - node.y;
          if (dy > 0) node.y += dy;
          y0 = node.y + node.dy + nodePadding;
        }
        dy = y0 - nodePadding - size[1];
        if (dy > 0) {
          y0 = node.y -= dy;
          for (i = n - 2; i >= 0; --i) {
            node = nodes[i];
            dy = node.y + node.dy + nodePadding - y0;
            if (dy > 0) node.y -= dy;
            y0 = node.y;
          }
        }
      });
    }
    initializeNodeDepth();
    resolveCollisions();
    for (let alpha = 1; iterations > 0; --iterations) {
      relaxRightToLeft(alpha *= 0.99);
      resolveCollisions();
      relaxLeftToRight(alpha);
      resolveCollisions();
    }
  }

  function ascendingSourceDepth(a, b) {
    return a.source.y - b.source.y;
  }

  function ascendingTargetDepth(a, b) {
    return a.target.y - b.target.y;
  }

  function computeLinkDepths() {
    nodes.forEach((node) => {
      node.sourceLinks.sort(ascendingTargetDepth);
      node.targetLinks.sort(ascendingSourceDepth);
    });
    nodes.forEach((node) => {
      let sy = 0;
      let ty = 0;
      node.sourceLinks.forEach((link) => {
        link.sy = sy;
        sy += link.dy;
      });
      node.targetLinks.forEach((link) => {
        link.ty = ty;
        ty += link.dy;
      });
    });
  }

  sankey.nodeWidth = (_) => {
    if (!_) return nodeWidth;
    nodeWidth = +_;
    return sankey;
  };

  sankey.nodePadding = (_) => {
    if (!_) return nodePadding;
    nodePadding = +_;
    return sankey;
  };

  sankey.nodes = (_) => {
    if (!_) return nodes;
    nodes = _;
    return sankey;
  };

  sankey.links = (_) => {
    if (!_) return links;
    links = _;
    return sankey;
  };

  sankey.size = (_) => {
    if (!_) return size;
    size = _;
    return sankey;
  };

  sankey.layout = (iterations) => {
    computeNodeLinks();
    computeNodeValues();
    computeNodeBreadths();
    computeNodeDepths(iterations);
    computeLinkDepths();
    return sankey;
  };

  sankey.relayout = () => {
    computeLinkDepths();
    return sankey;
  };

  sankey.link = () => {
    let curvature = 0.5;

    function link(d) {
      const x0 = d.source.x + d.source.dx;
      const x1 = d.target.x;
      const xi = d3.interpolateNumber(x0, x1);
      const x2 = xi(curvature);
      const x3 = xi(1 - curvature);
      const y0 = d.source.y + d.sy + d.dy / 2;
      const y1 = d.target.y + d.ty + d.dy / 2;
      return `M${x0},${y0}C${x2},${y0} ${x3},${y1} ${x1},${y1}`;
    }

    link.curvature = (_) => {
      if (!_) return curvature;
      curvature = +_;
      return link;
    };

    return link;
  };

  return sankey;
};

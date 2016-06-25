/* eslint no-param-reassign:0, no-loop-func:0, no-use-before-define:0
    no-shadow:0, no-floating-decimal:0, no-unused-vars:0 */
// https://github.com/d3/d3-plugins/blob/master/sankey/sankey.js
// http://bl.ocks.org/soxofaan/bb6f91d57dc4b6afe91d
// import d3 / es5 => es6
import d3 from 'd3';

d3.sankey = () => {
  const sankey = {};
  let nodeWidth = 24;
  let nodePadding = 8;
  let size = [1, 1];
  let nodes = [];
  let links = [];

  sankey.nodeWidth = (...args) => {
    if (!args.length) return nodeWidth;
    nodeWidth = +args;
    return sankey;
  };

  sankey.nodePadding = (...args) => {
    if (!args.length) return nodePadding;
    nodePadding = +args;
    return sankey;
  };

  sankey.nodes = (_) => {
    if (!arguments.length) return nodes;
    nodes = _;
    return sankey;
  };

  sankey.links = (_) => {
    if (!arguments.length) return links;
    links = _;
    return sankey;
  };

  sankey.size = (_) => {
    if (!arguments.length) return size;
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

  sankey.relayout = (_) => {
    computeLinkDepths();
    return sankey;
  };

  sankey.link = (_) => {
    let curvature = .5;

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
      if (!arguments.length) return curvature;
      curvature = +_;
      return link;
    };

    return link;
  };

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

  // Compute the value (size) of each node by summing the associated links.
  function computeNodeValues() {
    nodes.forEach((node) => {
      node.value = Math.max(
        d3.sum(node.sourceLinks, value),
        d3.sum(node.targetLinks, value)
      );
    });
  }

  // Iteratively assign the breadth (x-position) for each node.
  // Nodes are assigned the maximum breadth of incoming neighbors plus one;
  // nodes with no incoming links are assigned breadth zero, while
  // nodes with no outgoing links are assigned the maximum breadth.
  function computeNodeBreadths() {
    let remainingNodes = nodes;
    let nextNodes;
    let x = 0;

    while (remainingNodes.length) {
      nextNodes = [];
      remainingNodes.forEach((node) => {
        node.x = x;
        node.dx = nodeWidth;
        node.sourceLinks.forEach((link) => {
          if (nextNodes.indexOf(link.target) < 0 && !link.cycleBreaker) {
            nextNodes.push(link.target);
          }
        });
      });
      if (nextNodes.length === remainingNodes.length) {
        findAndMarkCycleBreaker(nextNodes);
      }
      remainingNodes = nextNodes;
      ++x;
    }
    moveSinksRight(x);
    scaleNodeBreadths((size[0] - nodeWidth) / (x - 1));
  }

  // Find a link that breaks a cycle in the graph (if any).
  function findAndMarkCycleBreaker(nodes) {
  // Go through all nodes from the given subset and traverse links searching for cycles.
    let link;
    for (let n = nodes.length - 1; n >= 0; n--) {
      link = depthFirstCycleSearch(nodes[n], []);
      if (link) {
        return link;
      }
    }
    return null;

    // Depth-first search to find a link that is part of a cycle.
    function depthFirstCycleSearch(cursorNode, path) {
      let target;
      let link;
      for (let n = cursorNode.sourceLinks.length - 1; n >= 0; n--) {
        link = cursorNode.sourceLinks[n];
        if (link.cycleBreaker) {
          // Skip already known cycle breakers.
          continue;
        }
        // Check if target makes a cycle with current path.
        target = link.target;
        if (path.indexOf(target) > -1) {
          // Mark this link as a known cycle breaker.
          link.cycleBreaker = true;
          // Stop further search if we found a cycle breaker.
          return link;
        }
        // Recurse deeper.
        path.push(cursorNode);
        link = depthFirstCycleSearch(target, path);
        path.pop();
        // Stop further search if we found a cycle breaker.
        if (link) {
          return link;
        }
      }
      return null;
    }
  }

  function moveSourcesRight() {
    nodes.forEach((node) => {
      if (!node.targetLinks.length) {
        node.x = d3.min(node.sourceLinks, (d) => {
          return d.target.x;
        }) - 1;
      }
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

    initializeNodeDepth();
    resolveCollisions();
    for (let alpha = 1; iterations > 0; --iterations) {
      relaxRightToLeft(alpha *= .99);
      resolveCollisions();
      relaxLeftToRight(alpha);
      resolveCollisions();
    }

    function initializeNodeDepth() {
      const ky = d3.min(nodesByBreadth, (nodes) => {
        return (size[1] - (nodes.length - 1) * nodePadding) / d3.sum(nodes, value);
      });

      nodesByBreadth.forEach((nodes) => {
        nodes.forEach((node, i) => {
          node.y = i;
          node.dy = node.value * ky;
        });
      });

      links.forEach((link) => {
        link.dy = link.value * ky;
      });
    }

    function relaxLeftToRight(alpha) {
      nodesByBreadth.forEach((nodes, breadth) => {
        nodes.forEach((node) => {
          if (node.targetLinks.length) {
            const y = d3.sum(node.targetLinks, weightedSource) / d3.sum(node.targetLinks, value);
            node.y += (y - center(node)) * alpha;
          }
        });
      });

      function weightedSource(link) {
        return center(link.source) * link.value;
      }
    }

    function relaxRightToLeft(alpha) {
      nodesByBreadth.slice().reverse().forEach((nodes) => {
        nodes.forEach((node) => {
          if (node.sourceLinks.length) {
            const y = d3.sum(node.sourceLinks, weightedTarget) / d3.sum(node.sourceLinks, value);
            node.y += (y - center(node)) * alpha;
          }
        });
      });

      function weightedTarget(link) {
        return center(link.target) * link.value;
      }
    }

    function resolveCollisions() {
      nodesByBreadth.forEach((nodes) => {
        const n = nodes.length;
        let node;
        let dy;
        let y0 = 0;
        let i;

        // Push any overlapping nodes down.
        nodes.sort(ascendingDepth);
        for (i = 0; i < n; ++i) {
          node = nodes[i];
          dy = y0 - node.y;
          if (dy > 0) node.y += dy;
          y0 = node.y + node.dy + nodePadding;
        }

        // If the bottommost node goes outside the bounds, push it back up.
        dy = y0 - nodePadding - size[1];
        if (dy > 0) {
          y0 = node.y -= dy;

          // Push any overlapping nodes back up.
          for (i = n - 2; i >= 0; --i) {
            node = nodes[i];
            dy = node.y + node.dy + nodePadding - y0;
            if (dy > 0) node.y -= dy;
            y0 = node.y;
          }
        }
      });
    }

    function ascendingDepth(a, b) {
      return a.y - b.y;
    }
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

    function ascendingSourceDepth(a, b) {
      return a.source.y - b.source.y;
    }

    function ascendingTargetDepth(a, b) {
      return a.target.y - b.target.y;
    }
  }

  function center(node) {
    return node.y + node.dy / 2;
  }

  function value(link) {
    return link.value;
  }

  return sankey;
};

export default d3;

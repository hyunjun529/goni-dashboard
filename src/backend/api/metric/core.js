import _ from 'lodash';
import {
  influxGoniPlusClient as goniPlus,
} from 'backend/core/influx';

/**
 * getAPIDetailByTime(apikey, path, time) returns api detail
 */
export function getAPIDetailByTime(apikey, path, time) {
  return new Promise((resolve, reject) => {
    const start = parseInt(time, 10);
    goniPlus.query(
      `SELECT breadcrumbT, res FROM http WHERE apikey = '${apikey}' and path = '${path}' and time >= ${start}s and time < ${start + 300}s GROUP BY breadcrumb, status;
      SELECT count(res) FROM http WHERE apikey = '${apikey}' and path = '${path}' and time >= ${start}s and time < ${start + 300}s GROUP BY time(20s) fill(0);
      SELECT max(cpu) FROM resource where apikey = '${apikey}' and time >= ${start}s and time < ${start + 300}s GROUP BY instance, time(20s) fill(0)`,
      (err, results) => {
        if (err) {
          return reject(err);
        }
        if (results && results[0].length !== 0) {
          const data = {};
          const transactionCount = [];
          let systemStatus = [];
          // Transaction Trace
          data.transactionTrace = results[0];
          // Transaction Count
          _.forEach(results[1], (v) => {
            transactionCount.push({
              time: v.time,
              value: v.count,
            });
          });
          data.transactionCount = transactionCount;
          // systemStatus
          const statusTemp = {};
          const statusTempByInstance = [];
          const statusByInstance = [];
          _.forEach(results[2], (v) => {
            if (!statusTemp[v.instance]) {
              statusTemp[v.instance] = [];
            }
            statusTemp[v.instance].push(v);
          });
          _.forEach(statusTemp, (v) => {
            let max = 0;
            _.forEach(v, (instance) => {
              max += instance.max;
            });
            if (max !== 0) {
              statusTempByInstance.push(v);
            }
          });
          _.forEach(statusTempByInstance, (v) => {
            const sorted = _.sortBy(v, (o) => {
              return new Date(o.time);
            });
            statusByInstance.push(sorted);
          });
          systemStatus = _.sortBy(statusByInstance, (v) => {
            const length = v.length;
            return v[length - 1].max;
          });
          if (systemStatus.length > 5) {
            systemStatus = _.slice(systemStatus, systemStatus.length - 5);
          }
          data.systemStatus = systemStatus;
          return resolve(data);
        }
        return resolve([]);
      });
  });
}

/**
 * getAPIMetrics(apikey, path, duration) returns api metrics
 */
export function getAPIMetrics(apikey, path, duration) {
  return new Promise((resolve, reject) => {
    goniPlus.query(
      `SELECT min(res),mean(res),max(res),count(panic) FROM http WHERE apikey = '${apikey}' and path = '${path}' and time > now() - ${duration};
       SELECT time, res, status FROM http WHERE apikey = '${apikey}' and path = '${path}' and time > now() - ${duration};
       SELECT breadcrumbT FROM http WHERE apikey = '${apikey}' and path = '${path}' and time > now() - ${duration} GROUP BY breadcrumb, status;`,
      (err, results) => {
        if (err) {
          return reject(err);
        }
        let exists = false;
        if (results && results[0].length !== 0 && results[0][0].min !== null) {
          exists = true;
        }
        const grouped = {};
        const groupedGraph = {};
        if (exists) {
          // map
          for (let i = 0; i < results[1].length; i++) {
            const status = results[1][i].status;
            let tg = parseInt(results[1][i].res / 250, 10);
            if (tg > 60) {
              tg = 60;
            }
            if (!grouped[status]) {
              grouped[status] = {};
            }
            if (!grouped[status][tg]) {
              grouped[status][tg] = {};
            }
            const t = new Date(results[1][i].time);
            t.setSeconds(0);
            if (duration === '6h' || duration === '3h') {
              t.setMinutes(t.getMinutes() - t.getMinutes() % 5);
            }
            const ts = t.getTime();
            if (!grouped[status][tg][ts]) {
              grouped[status][tg][ts] = 0;
            }
            grouped[status][tg][ts]++;
          }
          // graph
          for (let i = 0; i < results[2].length; i++) {
            const status = results[2][i].status;
            if (!groupedGraph[status]) {
              groupedGraph[status] = {};
            }
            const raw = results[2][i].breadcrumb;
            const crumb = JSON.parse(raw);
            const crumbT = JSON.parse(results[2][i].breadcrumbT);
            if (!groupedGraph[status][raw]) {
              groupedGraph[status][raw] = {
                count: 0,
                time: [],
              };
              for (let j = 0; j <= crumb.length; j++) {
                groupedGraph[status][raw].time.push([]);
              }
            }
            groupedGraph[status][raw].count++;
            for (let j = 0; j < crumbT.length; j++) {
              groupedGraph[status][raw].time[j].push(crumbT[j]);
            }
          }
        }
        const graphData = {};
        _.forEach(groupedGraph, (v, status) => {
          graphData[status] = {};
          _.forEach(v, (data, crumb) => {
            graphData[status][crumb] = {
              count: data.count,
              time: [],
            };
            _.forEach(data.time, (t) => {
              const r = {
                min: ~~_.min(t),
                mean: ~~_.mean(t),
                max: ~~_.max(t),
              };
              graphData[status][crumb].time.push(r);
            });
          });
        });
        const processed = {
          overview: {
            min: exists ? `${parseInt(results[0][0].min, 10)}ms` : 'no data',
            mean: exists ? `${parseInt(results[0][0].mean, 10)}ms` : 'no data',
            max: exists ? `${parseInt(results[0][0].max, 10)}ms` : 'no data',
            panic: exists ? results[0][0].count : 'no data',
          },
          responsemap: grouped,
          responsegraph: graphData,
        };
        return resolve(processed);
      });
  });
}

/**
 * getAPIRealtime(apikey) returns realtime metrics
 */
export function getAPIRealtime(apikey) {
  return new Promise((resolve, reject) => {
    goniPlus.query(
      `SELECT sum(count) from realtime where apikey = '${apikey}' and time >= now() - 5s group by timegroup;
      SELECT res from http where apikey = '${apikey}' and time >= now() - 3m;`,
      (err, results) => {
        if (err) {
          return reject(err);
        }
        return resolve(results);
      });
  });
}

/**
 * getAPIStatistics(apikey, path, duration) returns api statistics
 */
export function getAPIStatistics(apikey, path, duration) {
  return new Promise((resolve, reject) => {
    goniPlus.query(
      `SELECT count(res) FROM http WHERE apikey = '${apikey}' and path = '${path}' and time > now() - ${duration};
      SELECT count(res) FROM http WHERE apikey = '${apikey}' and path = '${path}' and time > now() - ${duration} GROUP BY status;
      SELECT count(res) FROM http WHERE apikey = '${apikey}' and path = '${path}' and time > now() - ${duration} GROUP BY browser;`,
      (err, results) => {
        if (err) {
          return reject(err);
        }
        let exists = false;
        if (results && results[0].length !== 0 && results[0][0].count !== 0) {
          exists = true;
        }
        const respStatus = [];
        const respBrowser = [];
        if (exists) {
          _.forEach(results[1], (v) => {
            if (v.count !== 0) {
              respStatus.push(v);
            }
          });
          _.forEach(results[2], (v) => {
            if (v.count !== 0) {
              respBrowser.push(v);
            }
          });
        }
        const processed = {
          responsestatus: exists ? respStatus : [],
          responsebrowser: exists ? respBrowser : [],
        };
        return resolve(processed);
      });
  });
}

/**
 * getAPIStatisticsByTime(apikey, time) returns api statistics for dashboard
 */
export function getAPIStatisticsByTime(apikey, time) {
  return new Promise((resolve, reject) => {
    const start = parseInt(time, 10);
    goniPlus.query(
      `SELECT count(res), mean(res) FROM http WHERE apikey = '${apikey}' and time >= ${start}s and time < ${start + 300}s GROUP BY path;
      SELECT count(res) FROM http WHERE apikey = '${apikey}' and time >= ${start}s and time < ${start + 300}s GROUP BY path, status;
      SELECT sum(count) from httpUser where apikey='${apikey}' and time >= ${start}s and time < ${start + 300}s group by time(20s) fill(0)`,
      (err, results) => {
        if (err) {
          return reject(err);
        }
        if (results && results[0].length !== 0) {
          const data = {};
          const tProcessed = [];
          const dProcessed = [];
          const uProcessed = [];
          _.forEach(results[0], (v) => {
            if (v.count !== 0) {
              tProcessed.push({
                path: v.path,
                mean: v.mean,
                count: v.count,
              });
            }
          });
          _.forEach(results[1], (v) => {
            if (v.count !== 0) {
              dProcessed.push({
                path: v.path,
                status: v.status,
                count: v.count,
              });
            }
          });
          _.forEach(results[2], (v) => {
            uProcessed.push({
              time: v.time,
              value: v.sum,
            });
          });
          data.transaction = tProcessed;
          data.transactionStatus = dProcessed;
          data.user = uProcessed;
          return resolve(data);
        }
        return resolve([]);
      });
  });
}

/**
 * getExpvar(apikey, duration) returns expvar metrics
 */
export function getExpvar(apikey, instance, duration) {
  return new Promise((resolve, reject) => {
    let groupby = '5m';
    if (duration === '6h' || duration === '3h') {
      groupby = '5m';
    } else {
      groupby = '1m';
    }
    goniPlus.query(
      `SELECT max(alloc) FROM expvar WHERE apikey = '${apikey}' and instance = '${instance}' and time > now() - ${duration} group by time(${groupby}) fill(0);
       SELECT max(heapalloc) FROM expvar WHERE apikey = '${apikey}' and instance = '${instance}' and time > now() - ${duration} group by time(${groupby}) fill(0);
       SELECT max(heapinuse) FROM expvar WHERE apikey = '${apikey}' and instance = '${instance}' and time > now() - ${duration} group by time(${groupby}) fill(0);
       SELECT max(numgc) FROM expvar WHERE apikey = '${apikey}' and instance = '${instance}' and time > now() - ${duration} group by time(${groupby}) fill(0);
       SELECT max(pausetotalns) FROM expvar WHERE apikey = '${apikey}' and instance = '${instance}' and time > now() - ${duration} group by time(${groupby}) fill(0);
       SELECT max(sys) FROM expvar WHERE apikey = '${apikey}' and instance = '${instance}' and time > now() - ${duration} group by time(${groupby}) fill(0);`,
      (err, results) => {
        if (err) {
          return reject(err);
        }
        const processed = {
          alloc: results[0],
          heapalloc: results[1],
          heapinuse: results[2],
          numgc: results[3],
          pausetotalns: results[4],
          sys: results[5],
        };
        return resolve(processed);
      });
  });
}

/**
 * getInstances(apikey, metric) returns instances
 */
export function getInstances(apikey, metric) {
  return new Promise((resolve, reject) => {
    goniPlus.query(
      `SELECT count(${metric === 'expvar' ? 'numgc' : 'cgo'}) from ${metric} WHERE apikey='${apikey}' and time > now() - 6h group by instance;`,
      (err, results) => {
        if (err) {
          return reject(err);
        }
        const instances = [];
        _.forEach(results[0], (v) => {
          if (v.count > 0) {
            instances.push(v.instance);
          }
        });
        return resolve(instances);
      });
  });
}

/**
 * getDashboardCPU(apikey) returns cpu data for render calendar
 */
export function getDashboardCPU(apikey) {
  return new Promise((resolve, reject) => {
    goniPlus.query(
      `SELECT MAX(cpu) FROM resource WHERE apikey='${apikey}' and time > now() - 24h GROUP BY time(5m);`,
      (err, results) => {
        if (err) {
          return reject(err);
        }
        if (results && results[0].length !== 0) {
          return resolve(results[0]);
        }
        return resolve([]);
      });
  });
}


/**
 * getPaths(apikey) returns api paths
 */
export function getPaths(apikey) {
  return new Promise((resolve, reject) => {
    goniPlus.query(
      `SELECT COUNT(res) FROM http WHERE apikey='${apikey}' and time > now() - 6h GROUP BY path;`,
      (err, results) => {
        if (err) {
          return reject(err);
        }
        if (results && results[0].length !== 0) {
          const processed = [];
          _.forEach(results[0], (v) => {
            if (v.count !== 0) {
              processed.push({
                value: v.path,
                label: v.path,
              });
            }
          });
          return resolve(processed);
        }
        return resolve([]);
      });
  });
}

/**
 * getRuntime(apikey, duration) returns runtime metrics
 */
export function getRuntime(apikey, instance, duration) {
  return new Promise((resolve, reject) => {
    let groupby = '5m';
    if (duration === '6h' || duration === '3h') {
      groupby = '5m';
    } else {
      groupby = '1m';
    }
    goniPlus.query(
      `SELECT max(cgo) FROM runtime WHERE apikey = '${apikey}' and instance = '${instance}' and time > now() - ${duration} group by time(${groupby}) fill(0);
       SELECT max(goroutine) FROM runtime WHERE apikey = '${apikey}' and instance = '${instance}' and time > now() - ${duration} group by time(${groupby}) fill(0);`,
      (err, results) => {
        if (err) {
          return reject(err);
        }
        const processed = {
          cgo: results[0],
          goroutine: results[1],
        };
        return resolve(processed);
      });
  });
}

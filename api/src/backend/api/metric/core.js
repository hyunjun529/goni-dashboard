import _ from 'lodash';
import {
  influxGoniPlusClient as goniPlus,
} from 'backend/core/influx';

/**
 * getAPIMetrics(apikey, path, duration) returns api metrics
 */
export function getAPIMetrics(apikey, path, duration) {
  return new Promise((resolve, reject) => {
    goniPlus.query(
      `SELECT min(res),mean(res),max(res),count(panic) FROM http WHERE apikey = '${apikey}' and path = '${path}' and time > now() - ${duration};
       SELECT time, res, status FROM http WHERE apikey = '${apikey}' and path = '${path}' and time > now() - ${duration};
       SELECT count(res) FROM http WHERE apikey = '${apikey}' and path = '${path}' and time > now() - ${duration} GROUP BY breadcrumb, status;`,
      (err, results) => {
        if (err) {
          return reject(err);
        }
        let exists = false;
        if (results && results[0].length !== 0 && results[0][0].min !== null) {
          exists = true;
        }
        const respGraph = [];
        if (exists) {
          _.map(results[2], (v) => {
            if (v.count !== 0) {
              respGraph.push(v);
            }
          });
        }
        const processed = {
          overview: {
            min: exists ? `${parseInt(results[0][0].min, 10)}ms` : 'no data',
            mean: exists ? `${parseInt(results[0][0].mean, 10)}ms` : 'no data',
            max: exists ? `${parseInt(results[0][0].max, 10)}ms` : 'no data',
            panic: exists ? results[0][0].count : 'no data',
          },
          responsemap: results[1],
          responsegraph: exists ? respGraph : [],
        };
        return resolve(processed);
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
      SELECT count(res) FROM http WHERE apikey = '${apikey}' and path = '${path}' and time > now() - ${duration} GROUP BY status;`,
      (err, results) => {
        if (err) {
          return reject(err);
        }
        let exists = false;
        if (results && results[0].length !== 0 && results[0][0].count !== 0) {
          exists = true;
        }
        const respStatus = [];
        if (exists) {
          _.map(results[1], (v) => {
            if (v.count !== 0) {
              respStatus.push(v);
            }
          });
        }
        const processed = {
          responsestatus: exists ? respStatus : [],
        };
        return resolve(processed);
      });
  });
}

/**
 * getAPIStatisticsByTime(apikey, time) returns api statistics
 */
export function getAPIStatisticsByTime(apikey, time) {
  return new Promise((resolve, reject) => {
    const start = parseInt(time, 10);
    goniPlus.query(
      `SELECT count(res), mean(res) FROM http WHERE apikey = '${apikey}' and time >= ${start}s and time < ${start + 300}s GROUP BY path;
      SELECT count(res) FROM http WHERE apikey = '${apikey}' and time >= ${start}s and time < ${start + 300}s GROUP BY path, status;`,
      (err, results) => {
        if (err) {
          return reject(err);
        }
        if (results && results[0].length !== 0) {
          const data = [];
          const tProcessed = [];
          const dProcessed = [];
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
          data.push(tProcessed);
          data.push(dProcessed);
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
    goniPlus.query(
      `SELECT time, alloc FROM expvar WHERE apikey = '${apikey}' and instance = '${instance}' and time > now() - ${duration};
       SELECT time, heapalloc FROM expvar WHERE apikey = '${apikey}' and instance = '${instance}' and time > now() - ${duration};
       SELECT time, heapinuse FROM expvar WHERE apikey = '${apikey}' and instance = '${instance}' and time > now() - ${duration};
       SELECT time, numgc FROM expvar WHERE apikey = '${apikey}' and instance = '${instance}' and time > now() - ${duration};
       SELECT time, pausetotalns FROM expvar WHERE apikey = '${apikey}' and instance = '${instance}' and time > now() - ${duration};
       SELECT time, sys FROM expvar WHERE apikey = '${apikey}' and instance = '${instance}' and time > now() - ${duration};`,
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
      `SELECT DISTINCT(instance) FROM ${metric} WHERE apikey='${apikey}' and time > now() - 6h;`,
      (err, results) => {
        if (err) {
          return reject(err);
        }
        if (results && results[0].length !== 0) {
          return resolve(results[0][0].distinct);
        }
        return resolve([]);
      });
  });
}

/**
 * getDashboardCPU(apikey) returns cpu data for render calendar
 */
export function getDashboardCPU(apikey) {
  return new Promise((resolve, reject) => {
    goniPlus.query(
      `SELECT MAX(cpu) FROM resource WHERE apikey='${apikey}' and time > now() - 6h GROUP BY time(5m);`,
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
    goniPlus.query(
      `SELECT time, cgo FROM runtime WHERE apikey = '${apikey}' and instance = '${instance}' and time > now() - ${duration};
       SELECT time, goroutine FROM runtime WHERE apikey = '${apikey}' and instance = '${instance}' and time > now() - ${duration};`,
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

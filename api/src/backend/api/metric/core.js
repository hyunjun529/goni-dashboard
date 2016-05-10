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
       SELECT count(res) FROM http WHERE apikey = '${apikey}' and path = '${path}' and time > now() - ${duration} GROUP BY status;`,
      (err, results) => {
        if (err) {
          reject(err);
        }
        const exists = results[0][0].min !== null;
        const processed = {
          overview: {
            min: exists ? `${results[0][0].min}ms` : 'no data',
            mean: exists ? `${results[0][0].mean}ms` : 'no data',
            max: exists ? `${results[0][0].max}ms` : 'no data',
            panic: exists ? results[0][0].count : 'no data',
          },
          responsemap: results[1],
          responsegraph: exists ? results[2] : [],
        };
        resolve(processed);
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
          reject(err);
        }
        const processed = {
          alloc: results[0],
          heapalloc: results[1],
          heapinuse: results[2],
          numgc: results[3],
          pausetotalns: results[4],
          sys: results[5],
        };
        resolve(processed);
      });
  });
}

/**
 * getInstances(apikey, metric) returns instances
 */
export function getInstances(apikey, metric) {
  return new Promise((resolve, reject) => {
    goniPlus.query(
      `SHOW TAG VALUES FROM ${metric} WITH KEY = instance WHERE apikey='${apikey}';`,
      (err, results) => {
        if (err) {
          reject(err);
        }
        resolve(results[0]);
      });
  });
}

/**
 * getPaths(apikey) returns api paths
 */
export function getPaths(apikey) {
  return new Promise((resolve, reject) => {
    goniPlus.query(
      `SHOW TAG VALUES FROM http WITH KEY = path WHERE apikey='${apikey}';`,
      (err, results) => {
        if (err) {
          reject(err);
        }
        resolve(results[0]);
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
          reject(err);
        }
        const processed = {
          cgo: results[0],
          goroutine: results[1],
        };
        resolve(processed);
      });
  });
}

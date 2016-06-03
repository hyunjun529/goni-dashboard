/* eslint no-console: 0 */
import _ from 'lodash';
import amqp from 'amqplib/callback_api';
import influx from 'influx';
import {
  queueHost,
  queuePort,
  queueUser,
  queuePass,
  dbQueueName,
  influxHost,
  influxPort,
  influxProtocol,
  influxUser,
  influxPass,
  influxDB,
} from './auth';

const influxClient = influx({
  host: influxHost,
  port: influxPort,
  protocol: influxProtocol,
  username: influxUser,
  password: influxPass,
  database: influxDB,
});

function getTimestamp(date) {
  return Date.parse(date);
}

function writeSeries(series) {
  return new Promise((resolve, reject) => {
    influxClient.writeSeries(series, (dbErr, response) => {
      if (dbErr) {
        reject(dbErr);
      } else {
        resolve(response);
      }
    });
  });
}

amqp.connect(`amqp://${queueUser}:${queuePass}@${queueHost}:${queuePort}`, (connErr, conn) => {
  if (connErr != null) {
    console.error(connErr);
    process.exit(1);
  }
  conn.createChannel((err, ch) => {
    if (err != null) {
      console.error(err);
      process.exit(1);
    }
    ch.assertQueue(dbQueueName, {
      durable: true,
    });
    ch.consume(dbQueueName, async(msg) => {
      try {
        const data = JSON.parse(msg.content);
        if (data.sys.resource.cpu) {
          const r = {
            time: getTimestamp(data.time),
          };
          r.cpu = data.sys.resource.cpu;
          const resource = [
            [r, {
              apikey: data.apikey,
              instance: data.instance,
            }],
          ];
          await writeSeries({
            resource,
          });
        }
        const runtime = [
          [{
            time: getTimestamp(data.time),
            cgo: data.sys.runtime.cgo,
            goroutine: data.sys.runtime.goroutine,
            instance: data.instance,
          }, {
            apikey: data.apikey,
          }],
        ];
        await writeSeries({
          runtime,
        });
        const memstats = JSON.parse(data.sys.expvar.memstats);
        const expvar = [
          [{
            time: getTimestamp(data.time),
            alloc: memstats.Alloc,
            sys: memstats.Sys,
            heapalloc: memstats.HeapAlloc,
            heapinuse: memstats.HeapInuse,
            pausetotalns: memstats.PauseTotalNs,
            numgc: memstats.NumGC,
            instance: data.instance,
          }, {
            apikey: data.apikey,
          }],
        ];
        await writeSeries({
          expvar,
        });
        const http = [];
        _.forEach(data.app.http, (metric, path) => {
          _.forEach(metric, (resp, method) => {
            _.forEach(resp, (result, code) => {
              const codeParsed = parseInt(code, 10);
              _.forEach(result, (res, browser) => {
                _.forEach(res, (v) => {
                  const d = {
                    time: new Date(+v.time * 1000),
                    method,
                    instance: data.instance,
                    res: v.res,
                  };
                  const t = {
                    apikey: data.apikey,
                    browser,
                    path,
                    status: codeParsed,
                  };
                  if (v.crumb) {
                    t.breadcrumb = JSON.stringify(v.crumb);
                    d.breadcrumbT = JSON.stringify(v.crumbT);
                  }
                  if (v.panic) {
                    d.panic = true;
                  }
                  http.push([d, t]);
                });
              });
            });
          });
        });
        await writeSeries({
          http,
        });
        if (data.app.user) {
          const httpUser = [];
          const d = {
            time: getTimestamp(data.time),
            count: data.app.user.length,
            instance: data.instance,
          };
          const t = {
            apikey: data.apikey,
          };
          httpUser.push([d, t]);
          await writeSeries({
            httpUser,
          });
        }
        ch.ack(msg);
      } catch (error) {
        console.log(error);
        ch.ack(msg);
      }
    });
  });
});

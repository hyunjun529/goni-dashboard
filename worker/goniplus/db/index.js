/* eslint no-console: 0, func-names:0, space-before-function-paren:0 */
var _ = require('lodash');
var amqp = require('amqplib/callback_api');
var influx = require('influx');

var queueHost = 'queueHost';
var queuePort = 5672;
var queueUser = 'queueUser';
var queuePass = 'queuePass';
var queueName = 'queueName';

var influxHost = 'influxHost';
var influxPort = 8086;
var influxProtocol = 'http';
var influxUser = 'influxUser';
var influxPass = 'influxPass';
var influxDB = 'goniplus';

var influxClient = influx({
  host: influxHost,
  port: influxPort,
  protocol: influxProtocol,
  username: influxUser,
  password: influxPass,
  database: influxDB
});

function getTimestamp(date) {
  return Date.parse(date);
}

amqp.connect('amqp://' + queueUser + ':' + queuePass + '@' + queueHost + ':' + queuePort, function(connErr, conn) {
  if (connErr != null) {
    console.error(connErr);
    process.exit(1);
  }
  conn.createChannel(function(err, ch) {
    if (err != null) {
      console.error(err);
      process.exit(1);
    }
    ch.assertQueue(queueName, {
      durable: true
    });
    ch.consume(queueName, function(msg) {
      var data = JSON.parse(msg.content);
      var runtime = [
        [{
          time: getTimestamp(data.time),
          cgo: data.sys.runtime.cgo,
          goroutine: data.sys.runtime.goroutine
        }, {
          apikey: data.apikey,
          instance: data.instance
        }]
      ];
      var memstats = JSON.parse(data.sys.expvar.memstats);
      var expvar = [
        [{
          time: getTimestamp(data.time),
          alloc: memstats.Alloc,
          sys: memstats.Sys,
          heapalloc: memstats.HeapAlloc,
          heapinuse: memstats.HeapInuse,
          pausetotalns: memstats.PauseTotalNs,
          numgc: memstats.NumGC
        }, {
          apikey: data.apikey,
          instance: data.instance
        }]
      ];
      var http = [];
      _.forEach(data.app.http, function(metric, path) {
        _.forEach(metric, function(resp, method) {
          _.forEach(resp, function(result, code) {
            var codeParsed = parseInt(code, 10);
            _.forEach(result, function(v) {
              var d = {
                time: new Date(+v.time * 1000),
                method: method,
                res: v.res
              };
              var t = {
                apikey: data.apikey,
                instance: data.instance,
                path: path,
                status: codeParsed
              };
              if (v.crumb) {
                t.breadcrumb = JSON.stringify(v.crumb);
              }
              if (v.panic) {
                d.panic = true;
              }
              http.push([d, t]);
            });
          });
        });
      });
      var series = { // eslint-disable-line vars-on-top
        expvar: expvar,
        http: http,
        runtime: runtime
      };
      influxClient.writeSeries(series, function(dbErr, response) { // eslint-disable-line
        if (dbErr) {
          console.log(dbErr);
        } else {
          ch.ack(msg);
        }
      });
    });
  });
});

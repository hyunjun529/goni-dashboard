/* eslint no-console: 0, func-names:0, space-before-function-paren:0 */
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
      var series = {
        runtime: runtime,
        expvar: expvar
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

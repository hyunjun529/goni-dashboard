/* eslint no-console: 0 */
import _ from 'lodash';
import amqp from 'amqplib/callback_api';
import mysql from 'mysql';
import request from 'request';
import {
  queueHost,
  queuePort,
  queueUser,
  queuePass,
  pushQueueName,
  mysqlHost,
  mysqlPort,
  mysqlUser,
  mysqlPass,
} from './auth';

const pool = mysql.createPool({
  host: mysqlHost,
  port: mysqlPort,
  user: mysqlUser,
  password: mysqlPass,
  database: 'goni_saas',
});

const COLOR_ALERT = '#ff7595';
const COLOR_WARNING = '#ffda00';
const COLOR_NORMAL = '#4c80f1'; // eslint-disable-line no-unused-vars

function createMessage(data) {
  let isNormal = true;
  const body = {
    attachments: [],
  };
  _.forEach(data.httpPanic, (v, k) => {
    isNormal = false;
    body.attachments.push({
      fallback: `[Panic Alert] ${k}`,
      color: COLOR_ALERT,
      author_name: k,
      fields: [{
        title: 'Panic Alert',
        value: `${v} transaction(s)`,
        short: false,
      }],
      footer: data.instance,
      ts: data.date,
    });
  });
  _.forEach(data.httpSlow, (v, k) => {
    isNormal = false;
    body.attachments.push({
      fallback: `[Slow Transaction Alert] ${k}`,
      color: COLOR_WARNING,
      author_name: k,
      fields: [{
        title: 'Slow Transaction Alert',
        value: `${v} transaction(s)`,
        short: false,
      }],
      footer: data.instance,
      ts: data.date,
    });
  });
  if (isNormal) {
    return null;
  }
  return body;
}

function sendSlackNotification(url, data) {
  return new Promise((resolve, reject) => {
    const json = createMessage(data);
    if (!json) {
      return resolve(null);
    }
    return request({
      url,
      method: 'POST',
      json: createMessage(data),
    }, (err, resp) => {
      if (!err && resp.statusCode === 200) {
        return resolve(null);
      }
      return reject(err);
    });
  });
}

function getSlackHookUrl(apikey) {
  return new Promise((resolve, reject) => {
    pool.getConnection((connErr, connection) => {
      if (connErr) {
        reject(connErr);
      } else {
        connection.query({
          sql: 'SELECT DISTINCT url FROM notification_slack JOIN project ON project.id = notification_slack.project_id WHERE project.apikey = ?',
          values: [apikey],
        }, (err, results) => {
          connection.release();
          if (err) {
            return reject(err);
          }
          if (results.length === 0) {
            return reject(null);
          }
          return resolve(results[0].url);
        });
      }
    });
  });
}

function getTimestamp(date) {
  return Date.parse(date) / 1000;
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
    ch.assertQueue(pushQueueName, {
      durable: true,
    });
    ch.consume(pushQueueName, async(msg) => {
      try {
        const data = JSON.parse(msg.content);
        const slackUrl = await getSlackHookUrl(data.apikey);
        const httpPanic = {};
        const httpSlow = {};
        _.forEach(data.app.http, (metric, path) => {
          _.forEach(metric, (resp, method) => { // eslint-disable-line no-unused-vars
            _.forEach(resp, (result, code) => { // eslint-disable-line no-unused-vars
              _.forEach(result, (res, browser) => { // eslint-disable-line no-unused-vars
                _.forEach(res, (v) => {
                  if (v.panic) {
                    if (!httpPanic[path]) {
                      httpPanic[path] = 0;
                    }
                    httpPanic[path]++;
                  }
                  if (v.res >= 3000) {
                    if (!httpSlow[path]) {
                      httpSlow[path] = 0;
                    }
                    httpSlow[path]++;
                  }
                });
              });
            });
          });
        });
        await sendSlackNotification(slackUrl, {
          date: getTimestamp(data.time),
          instance: data.instance,
          httpPanic,
          httpSlow,
        });
        ch.ack(msg);
      } catch (error) {
        console.log(error);
        ch.ack(msg);
      }
    });
  });
});

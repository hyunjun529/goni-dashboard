import {
  createSalt,
  createToken,
  hashPassword,
  hashToken,
} from 'backend/util/auth';
import pool from 'backend/core/mysql';
import {
  getTimestamp,
  getTokenTimestamp,
} from 'backend/util/time';
import {
  SLACK_CLIENT_ID,
} from 'constants/auth';
import {
  SLACK_CLIENT_SECRET,
} from './credential';
import request from 'request';

const slackTokenField = '(project_id,user_id,slack_user_id,access_token,team_name,team_id,channel,channel_id,configuration_url,url,created_at)';
const slackTokenValues = '(?,?,?,?,?,?,?,?,?,?,FROM_UNIXTIME(?))';
const userRegisterField = '(email,username,password,salt,created_at,updated_at)';
const userTokenField = '(token,user_id,expired_at)';

/**
 * getSlackToken(code) returns credential
 *
 * @param {String} code
 * @return {Object} access_token(String), team_name(String), team_id(String), incoming_webhook(Object)
 */
export function getSlackToken(code) {
  return new Promise((resolve, reject) => {
    request(`https://slack.com/api/oauth.access?client_id=${SLACK_CLIENT_ID}&client_secret=${SLACK_CLIENT_SECRET}&code=${code}`, (err, resp, body) => {
      if (!err && resp.statusCode === 200) {
        resolve(JSON.parse(body));
      } else {
        reject(err);
      }
    });
  });
}

/**
 * getUser(email) returns user Object
 * which contains requested user's
 * password and salt
 *
 * @param {String} email
 * @return {Object} id(String), password(String), salt(String)
 */
export function getUser(email) {
  return new Promise((resolve, reject) => {
    pool.getConnection((connErr, connection) => {
      if (connErr) {
        reject(connErr);
      } else {
        connection.query({
          sql: 'SELECT id,password,salt FROM `user` WHERE `email` = ?',
          values: [email],
        }, (err, results) => {
          connection.release();
          if (err) {
            return reject(err);
          }
          if (results.length === 0) {
            return resolve(null);
          }
          return resolve(results[0]);
        });
      }
    });
  });
}

/**
 * getUserByToken(token) returns user Object
 * which contains requested user's
 * password and salt
 *
 * @param {String} token
 * @return {Object} id(String), isExpired(Boolean)
 */
export function getUserByToken(token) {
  return new Promise((resolve, reject) => {
    pool.getConnection((connErr, connection) => {
      if (connErr) {
        reject(connErr);
      } else {
        connection.query({
          sql: 'SELECT user_id,expired_at FROM `user_token` WHERE `token` = ?',
          values: [hashToken(token)],
        }, (err, results) => {
          connection.release();
          if (err) {
            return reject(err);
          }
          if (results.length === 0) {
            return resolve(null);
          }
          return resolve(results[0]);
        });
      }
    });
  });
}

/**
 * registerSlackToken(pid, uid, data) returns true
 * if token successfully registered
 *
 * @param {String} projectid
 * @param {String} userid
 * @param {Object} data
 * @return {Boolean} registered
 */
export function registerSlackToken(pid, uid, data) {
  return new Promise((resolve, reject) => {
    pool.getConnection((connErr, connection) => {
      if (connErr) {
        reject(connErr);
      } else {
        const hook = data.incoming_webhook;
        connection.query({
          sql: `INSERT INTO notification_slack ${slackTokenField} VALUES ${slackTokenValues}`,
          values: [pid, uid, data.user_id, data.access_token, data.team_name, data.team_id, hook.channel, hook.channel_id, hook.configuration_url, hook.url, getTimestamp()],
        }, (err, result) => {
          connection.release();
          if (err) {
            return reject(err);
          }
          if (!result) {
            return reject(null);
          }
          if (result.affectedRows === 1) {
            return resolve(true);
          }
          return resolve(false);
        });
      }
    });
  });
}

/**
 * registerUser(email, username, password) returns userId
 * if user successfully registered
 *
 * @param {String} email (length < 50)
 * @param {String} username (length < 16)
 * @param {String} password
 * @return {Integer} userId
 */
export function registerUser(email, username, password) {
  return new Promise((resolve, reject) => {
    pool.getConnection((connErr, connection) => {
      if (connErr) {
        reject(connErr);
      } else {
        const t = getTimestamp();
        const salt = createSalt();
        connection.query({
          sql: `INSERT INTO user ${userRegisterField} VALUES (?,?,?,?,FROM_UNIXTIME(?),FROM_UNIXTIME(?))`,
          values: [email, username, hashPassword(password, salt), salt, t, t],
        }, (err, result) => {
          connection.release();
          if (err) {
            return reject(err);
          }
          return resolve(result.insertId);
        });
      }
    });
  });
}

/**
 * registerUserToken(id) returns token
 * if user successfully authenticated
 *
 * @param {String} userid
 * @return {String} token
 */
export function registerUserToken(id) {
  return new Promise((resolve, reject) => {
    pool.getConnection((connErr, connection) => {
      if (connErr) {
        reject(connErr);
      } else {
        const token = createToken({
          id,
        });
        const expiredAt = getTokenTimestamp();
        connection.query({
          sql: `INSERT INTO user_token ${userTokenField} VALUES (?,?,FROM_UNIXTIME(?))`,
          values: [hashToken(token), id, expiredAt],
        }, (err) => {
          connection.release();
          if (err) {
            return reject(err);
          }
          return resolve(token);
        });
      }
    });
  });
}

export const checkValidRegisterRequest = async(req, res, next) => {
  if (req.body.email && req.body.password && req.body.username) {
    return next();
  }
  return res.sendStatus(400);
};

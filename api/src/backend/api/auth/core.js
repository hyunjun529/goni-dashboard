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

const userRegisterField = '(email,username,password,salt,created_at,updated_at)';
const userTokenField = '(token,user_id,expired_at)';

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
      }
      connection.query({
        sql: 'SELECT id,password,salt FROM `user` WHERE `email` = ?',
        values: [email],
      }, (err, results) => {
        connection.release();
        if (err) {
          reject(err);
        }
        if (results.length === 0) {
          resolve(null);
        }
        resolve(results[0]);
      });
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
      }
      connection.query({
        sql: 'SELECT user_id,expired_at FROM `user_token` WHERE `token` = ?',
        values: [hashToken(token)],
      }, (err, results) => {
        connection.release();
        if (err) {
          reject(err);
        }
        if (results.length === 0) {
          resolve(null);
        }
        resolve(results[0]);
      });
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
      }
      const t = getTimestamp();
      const salt = createSalt();
      connection.query({
        sql: `INSERT INTO user ${userRegisterField} VALUES (?,?,?,?,FROM_UNIXTIME(?),FROM_UNIXTIME(?))`,
        values: [email, username, hashPassword(password, salt), salt, t, t],
      }, (err, result) => {
        connection.release();
        if (err) {
          reject(err);
        }
        resolve(result.insertId);
      });
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
      }
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
          reject(err);
        }
        resolve(token);
      });
    });
  });
}

export const checkValidRegisterRequest = async(req, res, next) => {
  if (req.body.email && req.body.password && req.body.username) {
    return next();
  }
  return res.sendStatus(400);
};

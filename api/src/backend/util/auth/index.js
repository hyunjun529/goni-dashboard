import _ from 'lodash';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';

const salt = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

// Application Secret
export const secret = 'secret';

/**
 * hash(p, s) returns sha256 hashed password
 *
 * @param {String} password
 * @param {String} salt
 * @return {String} hashedPassword
 */
export function hashPassword(p, s) {
  return crypto.createHmac('sha256', secret)
    .update(p + s)
    .digest('hex');
}

/**
 * checkPassword(dbp, p, s) checks password
 *
 * @param {String} dbp - Password in database
 * @param {String} p - Requested password
 * @param {String} s - Salt in database
 * @return {Boolean} isValid
 */
export function checkPassword(dbp, p, s) {
  return dbp === hashPassword(p, s);
}

/**
 * createSalt() returns 32 length random string
 *
 * @return {String} salt
 */
export function createSalt() {
  let s = '';
  _.forEach(_.range(32), () => {
    s += salt.substr(_.random(0, 61), 1);
  });
  return s;
}

/**
 * createToken() returns JSON Web Token
 *
 * @return {String} token
 */
export function createToken(data) {
  return jwt.sign(data, secret, {
    expiresIn: '6h',
  });
}

/**
 * hashToken(token) returns sha256 hashed token
 *
 * @param {String} token
 * @return {String} hashedToken
 */
export function hashToken(token) {
  return crypto.createHmac('sha256', secret)
    .update(token)
    .digest('hex');
}

import _ from 'lodash';
import crypto from 'crypto';
import {
  canAccessProject,
  canAccessProjectByKey,
} from 'backend/api/project/core';
import {
  getTimestamp,
} from 'backend/util/time';

const salt = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

// Application Secret
export const secret = 'secret';

/**
 * createSalt() returns 32 length random string
 *
 * @return {String} salt
 */
function createSalt() {
  let s = '';
  _.forEach(_.range(32), () => {
    s += salt.substr(_.random(0, 61), 1);
  });
  return s;
}

/**
 * createAPIKey(username) returns APIKey
 *
 * @param {String} userid
 * @return {String} APIKey
 */
export function createAPIKey(userid) {
  return crypto.createHmac('sha256', secret)
    .update(userid + getTimestamp().toString() + createSalt())
    .digest('hex');
}

export const projectAccessCheck = async(req, res, next) => {
  try {
    const canAccess = await canAccessProject(req.params.id, req.user.id);
    if (!canAccess) {
      return res.sendStatus(401);
    }
    return next();
  } catch (err) {
    return res.sendStatus(500);
  }
};

export const projectAccessCheckByKey = async(req, res, next) => {
  try {
    const canAccess = await canAccessProjectByKey(req.params.key, req.user.id);
    if (!canAccess) {
      return res.sendStatus(401);
    }
    return next();
  } catch (err) {
    return res.sendStatus(500);
  }
};

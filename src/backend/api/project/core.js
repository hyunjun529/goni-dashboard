import {
  getUser,
} from 'backend/api/auth/core';
import pool from 'backend/core/mysql';
import {
  createAPIKey,
} from 'backend/util/project';
import {
  getTimestamp,
} from 'backend/util/time';

const ROLE_ADMIN = 0;
const ROLE_MEMBER = 1;

const createProjectColumn = '(name,is_plus,apikey,admin_id,created_at,updated_at)';
const createProjectField = '(?,?,?,?,FROM_UNIXTIME(?),FROM_UNIXTIME(?))';
const projectRoleColumn = '(project_id,user_id,user_role)';
const projectRoleField = '(?,?,?)';

/**
 * addUserToProject(id, user) returns true
 * if user successfully added to project
 *
 * @param {Integer} project id
 * @param {Integer} user id
 * @return {Boolean}
 */
export function addUserToProject(id, user) {
  return new Promise((resolve, reject) => {
    pool.getConnection((connErr, connection) => {
      if (connErr) {
        reject(connErr);
      } else {
        connection.query({
          sql: `INSERT INTO project_role ${projectRoleColumn} VALUES ${projectRoleField}`,
          values: [id, user, ROLE_MEMBER],
        }, (err, result) => {
          connection.release();
          if (err) {
            return reject(err);
          }
          if (result.affectedRows === 0) {
            return reject(false);
          }
          return resolve(true);
        });
      }
    });
  });
}

/**
 * canAccessProject(id, user) returns true
 * if user can access project
 *
 * @param {Integer} project id
 * @param {Integer} user id
 * @return {Boolean} canAccess
 */
export function canAccessProject(id, user) {
  return new Promise((resolve, reject) => {
    pool.getConnection((connErr, connection) => {
      if (connErr) {
        reject(connErr);
      } else {
        connection.query({
          sql: 'SELECT COUNT(DISTINCT project_id) FROM project_role WHERE project_id=? AND user_id=?',
          values: [id, user],
        }, (err, results) => {
          connection.release();
          if (err) {
            return reject(err);
          }
          if (results.length === 0) {
            return resolve(false);
          }
          return resolve(true);
        });
      }
    });
  });
}

/**
 * canAccessProjectByKey(key, user) returns true
 * if user can access project
 *
 * @param {String} project apikey
 * @param {Integer} user id
 * @return {Boolean} canAccess
 */
export function canAccessProjectByKey(key, user) {
  return new Promise((resolve, reject) => {
    pool.getConnection((connErr, connection) => {
      if (connErr) {
        reject(connErr);
      } else {
        connection.query({
          sql: 'SELECT COUNT(DISTINCT project.id) FROM project JOIN project_role ON project.id = project_role.project_id WHERE project.apikey=? AND project_role.user_id=?;',
          values: [key, user],
        }, (err, results) => {
          connection.release();
          if (err) {
            return reject(err);
          }
          if (results.length === 0) {
            return resolve(false);
          }
          return resolve(true);
        });
      }
    });
  });
}

/**
 * createProject(name, isPlus, user) returns project id
 *
 * @param {String} project name
 * @param {Boolean} isGoniPlus project
 * @param {Integer} user id
 * @return {Integer} project id
 */
export function createProject(name, isPlus, user) {
  return new Promise((resolve, reject) => {
    pool.getConnection((connErr, connection) => {
      if (connErr) {
        reject(connErr);
      } else {
        connection.beginTransaction((tErr) => {
          if (tErr) {
            connection.release();
            reject(tErr);
          } else {
            const t = getTimestamp();
            connection.query({
              sql: `INSERT INTO project ${createProjectColumn} VALUES ${createProjectField}`,
              values: [name, isPlus ? 1 : 0, createAPIKey(user), user, t, t],
            }, (pErr, projectResult) => {
              if (pErr) {
                return connection.rollback(() => {
                  connection.release();
                  return reject(pErr);
                });
              }
              return connection.query({
                sql: `INSERT INTO project_role ${projectRoleColumn} VALUES ${projectRoleField}`,
                values: [projectResult.insertId, user, ROLE_ADMIN],
              }, (rErr) => {
                if (rErr) {
                  return connection.rollback(() => {
                    connection.release();
                    return reject(rErr);
                  });
                }
                return connection.commit((err) => {
                  if (err) {
                    return connection.rollback(() => {
                      connection.release();
                      return reject(err);
                    });
                  }
                  connection.release();
                  return resolve(projectResult.insertId);
                });
              });
            });
          }
        });
      }
    });
  });
}

/**
 * getProject(id, user) returns project object
 *
 * @param {Integer} project id
 * @param {Integer} user id
 * @return {Object} project id(Integer), name(String), isPlus(Boolean), APIKEY(String)
 */
export function getProject(id, user) {
  return new Promise((resolve, reject) => {
    pool.getConnection((connErr, connection) => {
      if (connErr) {
        reject(connErr);
      } else {
        connection.query({
          sql: 'SELECT DISTINCT project.id, project.name, project.is_plus, project.apikey FROM project JOIN project_role ON project.id = project_role.project_id WHERE project.id = ? AND project_role.user_id = ?',
          values: [id, user],
        }, (err, results) => {
          connection.release();
          if (err) {
            return reject(err);
          }
          if (results.length !== 0) {
            return resolve(results[0]);
          }
          return resolve(null);
        });
      }
    });
  });
}

/**
 * getProjectList(id) returns user's project list
 *
 * @param {Integer} user id
 * @return {Array} {Object} project id(Integer), name(String), isPlus(Boolean), APIKEY(String)
 */
export function getProjectList(id) {
  return new Promise((resolve, reject) => {
    pool.getConnection((connErr, connection) => {
      if (connErr) {
        reject(connErr);
      } else {
        connection.query({
          sql: 'SELECT DISTINCT project.id, project.name, project.is_plus, project.apikey FROM project JOIN project_role ON project.id = project_role.project_id WHERE project_role.user_id = ?',
          values: [id],
        }, (err, results) => {
          connection.release();
          if (err) {
            return reject(err);
          }
          return resolve(results);
        });
      }
    });
  });
}

/**
 * getProjectMemberList(id) returns project's member list
 *
 * @param {Integer} project id
 * @return {Array} {Object} user id(Integer), user email(String), user role(Integer)
 */
export function getProjectMemberList(id) {
  return new Promise((resolve, reject) => {
    pool.getConnection((connErr, connection) => {
      if (connErr) {
        reject(connErr);
      } else {
        connection.query({
          sql: 'SELECT DISTINCT user.id, user.email, project_role.user_role FROM user JOIN project_role ON user.id = project_role.user_id WHERE project_role.project_id = ?',
          values: [id],
        }, (err, results) => {
          connection.release();
          if (err) {
            return reject(err);
          }
          return resolve(results);
        });
      }
    });
  });
}

/**
 * getProjectRole(id, user) returns user_role if user is project admin
 *
 * @param {Integer} project id
 * @param {Integer} user id
 * @return {Integer} user role (0: Admin / 1: Member)
 */
export function getProjectRole(id, user) {
  return new Promise((resolve, reject) => {
    pool.getConnection((connErr, connection) => {
      if (connErr) {
        reject(connErr);
      } else {
        connection.query({
          sql: 'SELECT user_role FROM project_role WHERE project_id=? AND user_id=?',
          values: [id, user],
        }, (err, results) => {
          connection.release();
          if (err) {
            return reject(err);
          }
          if (results.length === 0) {
            return resolve(null);
          }
          return resolve(results[0].user_role);
        });
      }
    });
  });
}

/**
 * getSlackIntegrationData(id) returns slack integration data
 *
 * @param {Integer} project id
 * @return {Object}
 */
export function getSlackIntegrationData(id) {
  return new Promise((resolve, reject) => {
    pool.getConnection((connErr, connection) => {
      if (connErr) {
        reject(connErr);
      } else {
        connection.query({
          sql: 'SELECT team_name, channel, configuration_url, created_at FROM notification_slack WHERE project_id=?',
          values: [id],
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
 * removeSlackIntegrationFromProject(id, user) returns true
 * if user successfully removed from project
 *
 * @param {Integer} project id
 * @param {Integer} user id
 * @return {Boolean} returns false when user is not admin
 */
export function removeSlackIntegrationFromProject(id, user) {
  return new Promise((resolve, reject) => {
    pool.getConnection((connErr, connection) => {
      if (connErr) {
        reject(connErr);
      } else {
        connection.query({
          sql: 'DELETE FROM notification_slack WHERE project_id=? AND user_id=?',
          values: [id, user],
        }, (err, result) => {
          connection.release();
          if (err) {
            return reject(err);
          }
          if (result.affectedRows === 0) {
            return resolve(false);
          }
          return resolve(true);
        });
      }
    });
  });
}

/**
 * removeUserFromProject(id, user) returns true
 * if user successfully removed from project
 *
 * @param {Integer} project id
 * @param {Integer} user id
 * @return {Boolean}
 */
export function removeUserFromProject(id, user) {
  return new Promise((resolve, reject) => {
    pool.getConnection((connErr, connection) => {
      if (connErr) {
        reject(connErr);
      } else {
        connection.query({
          sql: 'DELETE FROM project_role WHERE project_id=? AND user_id=?',
          values: [id, user],
        }, (err, result) => {
          connection.release();
          if (err) {
            return reject(err);
          }
          if (result.affectedRows === 0) {
            return resolve(false);
          }
          return resolve(true);
        });
      }
    });
  });
}

export {
  getUser,
};

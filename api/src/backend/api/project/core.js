import pool from 'backend/core/mysql';
import {
  createAPIKey,
} from 'backend/util/project';
import {
  getTimestamp,
} from 'backend/util/time';

const ROLE_ADMIN = 0;
const ROLE_MEMBER = 1;

const createProjectColumn = '(name,is_plus,apikey,admin_id,created_at)';
const createProjectField = '(?,?,?,?,FROM_UNIXTIME(?))';
const projectRoleColumn = '(project_id,user_id,user_role)';
const projectRoleField = '(?,?,?)';

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
      }
      connection.beginTransaction((tErr) => {
        if (tErr) {
          reject(tErr);
        }
        const t = getTimestamp();
        connection.query({
          sql: `INSERT INTO project ${createProjectColumn} VALUES ${createProjectField}`,
          values: [name, isPlus ? 1 : 0, createAPIKey(user), user, t],
        }, (pErr, projectResult) => {
          if (pErr) {
            return connection.rollback(() => {
              connection.release();
              reject(pErr);
            });
          }
          connection.query({
            sql: `INSERT INTO project_role ${projectRoleColumn} VALUES ${projectRoleField}`,
            values: [projectResult.insertId, user, ROLE_ADMIN],
          }, (rErr) => {
            if (rErr) {
              return connection.rollback(() => {
                connection.release();
                reject(rErr);
              });
            }
            connection.commit((err) => {
              if (err) {
                return connection.rollback(() => {
                  connection.release();
                  reject(err);
                });
              }
              return resolve(projectResult.insertId);
            });
          });
        });
      });
    });
  });
}

/**
 * getProject(id) returns project object
 *
 * @param {Integer} project id
 * @param {Integer} user id
 * @return {Object} id(String), password(String), salt(String)
 */
export function getProject(id, user) {
  return new Promise((resolve, reject) => {
    pool.getConnection((connErr, connection) => {
      if (connErr) {
        reject(connErr);
      }
      connection.query({
        sql: 'SELECT project.id, project.name, project.is_plus, project.apikey FROM project JOIN project_role WHERE project.id=? AND project_role.user_id=?', // eslint-disable-line
        values: [id, user],
      }, (err, results) => {
        connection.release();
        if (err) {
          reject(err);
        }
        resolve(results[0]);
      });
    });
  });
}

/**
 * getProjectList(id) returns user's project list
 *
 * @param {Integer} user id
 * @return {Array} {Object} id(String), password(String), salt(String)
 */
export function getProjectList(id) {
  return new Promise((resolve, reject) => {
    pool.getConnection((connErr, connection) => {
      if (connErr) {
        reject(connErr);
      }
      connection.query({
        sql: 'SELECT project.id, project.name, project.is_plus, project.apikey FROM project JOIN project_role WHERE project_role.user_id =?', // eslint-disable-line
        values: [id],
      }, (err, results) => {
        connection.release();
        if (err) {
          reject(err);
        }
        resolve(results);
      });
    });
  });
}

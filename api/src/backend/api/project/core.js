import pool from 'backend/core/mysql';

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

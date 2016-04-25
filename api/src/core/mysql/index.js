import mysql from 'mysql';

const pool = mysql.createPool({
  host: 'host',
  port: 3306,
  user: 'user',
  password: 'password',
  database: 'database',
});

export default pool;

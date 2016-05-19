import mysql from 'mysql';

const pool = mysql.createPool({
  host: process.env.GONI_MYSQL_HOST || 'host',
  port: process.env.GONI_MYSQL_PORT ? parseInt(process.env.GONI_MYSQL_PORT, 10) : 3306,
  user: process.env.GONI_MYSQL_USER || 'user',
  password: process.env.GONI_MYSQL_PASS || 'password',
  database: 'goni_saas',
});

export default pool;

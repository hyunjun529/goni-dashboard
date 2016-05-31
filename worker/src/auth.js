export const queueHost = process.env.GONI_QUEUE_HOST || 'queueHost';
export const queuePort = process.env.GONI_QUEUE_PORT ? parseInt(process.env.GONI_QUEUE_PORT, 10) : 5672;
export const queueUser = process.env.GONI_QUEUE_USER || 'queueUser';
export const queuePass = process.env.GONI_QUEUE_PASS || 'queuePass';
export const dbQueueName = 'goniplus_queue_db';
export const pushQueueName = 'goniplus_queue_push';

export const influxHost = process.env.GONI_INFLUX_HOST || 'influxHost';
export const influxPort = process.env.GONI_INFLUX_PORT ? parseInt(process.env.GONI_INFLUX_PORT, 10) : 8086;
export const influxProtocol = 'http';
export const influxUser = process.env.GONI_INFLUX_USER || 'influxUser';
export const influxPass = process.env.GONI_INFLUX_PASS || 'influxPass';
export const influxDB = 'goniplus';

export const mysqlHost = process.env.GONI_MYSQL_HOST || 'host';
export const mysqlPort = process.env.GONI_MYSQL_PORT ? parseInt(process.env.GONI_MYSQL_PORT, 10) : 3306;
export const mysqlUser = process.env.GONI_MYSQL_USER || 'user';
export const mysqlPass = process.env.GONI_MYSQL_PASS || 'password';

export default {};

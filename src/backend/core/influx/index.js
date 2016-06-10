import influx from 'influx';

const influxHost = process.env.GONI_INFLUX_HOST || 'influxHost';
const influxPort = process.env.GONI_INFLUX_PORT ? parseInt(process.env.GONI_INFLUX_PORT, 10) : 8086;
const influxProtocol = 'http';
const influxUser = process.env.GONI_INFLUX_USER || 'influxUser';
const influxPass = process.env.GONI_INFLUX_PASS || 'influxPass';

const influxGoniClient = influx({
  host: influxHost,
  port: influxPort,
  protocol: influxProtocol,
  username: influxUser,
  password: influxPass,
  database: 'goni',
});

const influxGoniPlusClient = influx({
  host: influxHost,
  port: influxPort,
  protocol: influxProtocol,
  username: influxUser,
  password: influxPass,
  database: 'goniplus',
});

export {
  influxGoniClient,
  influxGoniPlusClient,
};

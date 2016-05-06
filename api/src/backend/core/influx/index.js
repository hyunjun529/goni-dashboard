import influx from 'influx';

const influxHost = 'host';
const influxPort = 8086;
const influxProtocol = 'http';
const influxUser = 'user';
const influxPass = 'pass';

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

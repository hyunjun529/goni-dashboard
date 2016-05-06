import time from 'time';

export function timestampToDate(timestamp) {
  return new Date(timestamp);
}

export function getTimestamp() {
  return String(Math.round(Date.now() / 1000));
}

export function getTokenTimestamp() {
  return String(Math.round(Date.now() / 1000) + 21600);
}

export function checkExpired(timestamp) {
  if (Math.round(Date.now() / 1000) > time.Date.parse(timestamp, 'UTC')) {
    return true;
  }
  return false;
}

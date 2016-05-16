import reqwest from 'reqwest';

export function httpDelete(url, token) {
  return new Promise((resolve, reject) => {
    reqwest({
      url,
      method: 'delete',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      error: (err) => {
        reject(err);
      },
      success: (res) => {
        resolve(res);
      },
    });
  });
}

export function httpGet(url, token) {
  return new Promise((resolve, reject) => {
    reqwest({
      url,
      method: 'get',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      error: (err) => {
        reject(err);
      },
      success: (res) => {
        resolve(res);
      },
    });
  });
}

export function httpPost(url, token, data) {
  return new Promise((resolve, reject) => {
    reqwest({
      url,
      method: 'post',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data,
      error: (err) => {
        reject(err);
      },
      success: (res) => {
        resolve(res);
      },
    });
  });
}

export function httpPostAuth(url, data) {
  return new Promise((resolve, reject) => {
    reqwest({
      url,
      method: 'post',
      data,
      error: (err) => {
        reject(err);
      },
      success: (res) => {
        resolve(res);
      },
    });
  });
}

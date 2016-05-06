import reqwest from 'reqwest';

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

export function httpPost(url, data) {
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

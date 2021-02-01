export const ajax = (settings) => {
  let params = {};

  switch (typeof settings) {
    case 'string':
      params.url = settings;
      break;
    case 'object':
      params = settings;
      break;
  }

  if (!('data' in params)) params.data = {};
  if (!('method' in params)) params.method = 'POST';

  let promise = {
    resolve: null,
    reject: null
  };

  const request = new XMLHttpRequest();

  const url = (url) => params.url = url;
  
  const method = (method) => params.method = method;

  const headers = (headers) => params.headers = headers;

  const push = (data, value) => {
    switch (typeof data) {
      case 'string':
        params.data = Object.assign({[data]: value}, params.data);
        break;
      case 'object':
        params.data = Object.assign(data, params.data);
        break;
    }
  };

  const data = (data, value) => push(data, value);

  const setHeaders = (xhr, headers) => {
    headers = headers || {};

    if (!headers.hasOwnProperty('Content-Type')) {
      headers['Content-Type'] = 'application/x-www-form-urlencoded';
    }
   
    Object.keys(headers).forEach((name) => {
      (headers[name] && xhr.setRequestHeader(name, headers[name]));
    });
  };

  const send = (data) => {
    push(data);

    return new Promise((resolve, reject) => {
      promise.resolve = resolve;
      promise.reject = reject;

      request.open(params.method, params.url);
      setHeaders(request, params.headers);

      const contentType = params.headers['Content-Type'];

      switch (contentType) {
        case 'application/x-www-form-urlencoded':
          request.send(Object.keys(params.data).map((key) => encodeURIComponent(key) + '=' + encodeURIComponent(params.data[key])).join('&'));
          break;
        case 'application/json':
          request.send(JSON.stringify(params.data));
          break;
      }

      request.onreadystatechange = () => {
        if (request.readyState !== 4) return;
    
        if (request.status < 200 || request.status > 299) {
          promise.reject(request);
          return;
        }
    
        promise.resolve(request.responseText);
      };
    });
  };

  const post = (data) => {
    params.method = 'POST';
    return send(data);
  };

  const get = (data) => {
    params.method = 'GET';
    return send(data);
  };

  return {
    url: url,
    headers: headers,
    method: method,
    data: data,
    send: send,
    post: post,
    get: get
  };
};

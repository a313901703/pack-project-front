import request from '../utils/httpRequest';

export function queryAll(params) {
  return request({
    url: '/event-rules',
    method: 'GET',
    params,
  });
}

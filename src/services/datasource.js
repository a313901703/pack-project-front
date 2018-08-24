import request from '../utils/httpRequest';

export function queryApis(params) {
  console.log('all', params);
  return request({
    url: '/apis',
    method: 'GET',
    params,
  });
}

export function queryApi(id) {
  console.log('one', id);
  return request({
    url: `/apis/${id}`,
    method: 'GET',
  });
}

export function addApis(data) {
  console.log('addd', data);
  return request({
    url: '/apis',
    method: 'POST',
    data,
  });
}

export function editApis(payload) {
  console.log('edt');
  const { id, data } = payload;
  return request({
    url: `/apis/${id}`,
    method: 'PUT',
    data,
  });
}

export function removeApis(id) {
  console.log('delete', id);
  return request({
    url: `/apis/${id}`,
    method: 'DELETE',
  });
}

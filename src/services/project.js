import request from '../utils/httpRequest';

export function queryAll(params) {
  return request({
    url: '/projects',
    method: 'GET',
    params,
  });
}

export function queryOne(id) {
  return request({
    url: `/projects/${id}`,
    method: 'get',
  });
}

export function addProjects(data) {
  return request({
    url: '/projects',
    method: 'POST',
    data,
  });
}

export function editProject(payload) {
  const { id, data } = payload;
  return request({
    url: `/projects/${id}`,
    method: 'PUT',
    data,
  });
}

export function deleteProject(id) {
  return request({
    url: `/projects/${id}`,
    method: 'DELETE',
  });
}

export function queryAllPack(params) {
  return request({
    url: '/packages',
    method: 'GET',
    params,
  });
}

export function addPack(data) {
  return request({
    url: '/packages/pack',
    method: 'POST',
    data,
  });
}

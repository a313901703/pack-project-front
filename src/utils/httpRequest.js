import axios from 'axios';
import { notification } from 'antd';
// import { Message } from 'element-ui'
// import store from '@/store'
// import { getToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  // baseURL: 'http://127.0.0.1:8070/v1', // api的base_url
  baseURL: 'http://10.8.8.233:8011/v1',
  timeout: 30000, // request timeout
});

// request interceptor
service.interceptors.request.use(
  config => {
    // Do something before request is sent
    // if (store.getters.token) {
    //   // 让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改
    //   config.headers['X-Token'] = getToken()
    // }
    return config;
  },
  error => {
    // Do something with request error
    Promise.reject(error);
  }
);

// respone interceptor
service.interceptors.response.use(
  response => response.data,
  // response => {
  //   console.log('request success',response)
  //   return response.data
  // },
  /**
   * 下面的注释为通过在response里，自定义code来标示请求状态
   * 当code返回如下情况则说明权限有问题，登出并返回到登录页
   * 如想通过xmlhttprequest来状态码标识 逻辑可写在下面error中
   * 以下代码均为样例，请结合自生需求加以修改，若不需要，则可删除
   */
  // response => {
  //   const res = response.data
  //   if (res.code !== 20000) {
  //     Message({
  //       message: res.message,
  //       type: 'error',
  //       duration: 5 * 1000
  //     })
  //     // 50008:非法的token; 50012:其他客户端登录了;  50014:Token 过期了;
  //     if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
  //       // 请自行在引入 MessageBox
  //       // import { Message, MessageBox } from 'element-ui'
  //       MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
  //         confirmButtonText: '重新登录',
  //         cancelButtonText: '取消',
  //         type: 'warning'
  //       }).then(() => {
  //         store.dispatch('FedLogOut').then(() => {
  //           location.reload() // 为了重新实例化vue-router对象 避免bug
  //         })
  //       })
  //     }
  //     return Promise.reject('error')
  //   } else {
  //     return response.data
  //   }
  // },
  error => {
    let message = '';
    if (error && error.response) {
      switch (error.response.status) {
        case 400:
          message = '请求错误(400)';
          break;
        case 401:
          message = '未授权，请重新登录(401)';
          break;
        case 403:
          message = '拒绝访问(403)';
          break;
        case 404:
          message = '请求出错(404)';
          break;
        case 408:
          message = '请求超时(408)';
          break;
        case 500:
          message = '服务器错误(500)';
          break;
        case 501:
          message = '服务未实现(501)';
          break;
        case 502:
          message = '网络错误(502)';
          break;
        case 503:
          message = '服务不可用(503)';
          break;
        case 504:
          message = '网络超时(504)';
          break;
        case 505:
          message = 'HTTP版本不受支持(505)';
          break;
        default:
          message = '连接服务器失败';
      }
    } else {
      message = '连接服务器失败!';
    }
    notification.error({
      message: '请求失败',
      description: message,
    });
    // const err = new Error(message);
    // err.name = error.response.status;
    // err.response = error.response;
    // throw error;
    // throw error;
  }
);

export default service;

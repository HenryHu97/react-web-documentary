import axios from 'axios'
import store from '../store'

const Ajax = axios.create({
  baseURL: window.BASE_URL
})

// Ajax请求拦截,并在请求头中添加token
Ajax.interceptors.request.use(config => {
  let token = store.getState().common.token,
  paths = ['/user/login']

  console.log(config, '========================')
  
  if(paths.includes(config.url)) {
    return config
  } else {
    if(!!token) {
      config.headers.token = token
      return config
    } else {
      return Promise.reject({code: 400, message: '请求数据需要携带token'})
    }
  }
})




export default req => {
  return new Promise(resolve => {
    Ajax.request({
      url: req.url,
      method: req.method || "GET",
      data: req.data || {},
      params: req.params || {}
    }).then(({data}) => {
      resolve(data)
    }).catch(e => {
      resolve(e)
    })
  })
}
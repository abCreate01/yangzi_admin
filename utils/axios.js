import axios from 'axios' // 引用axios
import Config from '../myConfig/MyConfig'
import qs from 'querystring'

// axios 配置
axios.defaults.timeout = 3000 // 设置超时时间
axios.defaults.baseURL = Config.API_URL // base url

// http request 拦截器（所有发送的请求都要从这儿过一次），通过这个，我们就可以把token传到后台，我这里是使用sessionStorage来存储token等权限信息和用户信息，若要使用cookie可以自己封装一个函数并import便可使用
axios.interceptors.request.use(
  config => {
    const token = sessionStorage.getItem('token') // 获取存储在本地的token
    config.data = qs.stringify(config.data)
    config.headers = {
      'Content-Type': 'application/x-www-form-urlencoded' // axios会自动封装为json。这种做法让后端可以用request.getParams可以获得
    }
    if (token) {
      config.headers.Authorization = 'Token ' + token // 携带权限参数
    }
    return config
  },
  err => {
    return Promise.reject(err)
  }
)

export default axios

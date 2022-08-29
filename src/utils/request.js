// 基于axios封装网络请求
// 每个程序员想法不同，等装的方法和名字都不一样，但想法相同
import theAxios from 'axios'
import router from '@/router'
// import { Notify } from 'vant'
import { getToken, removeToken } from '@/utils/token'
// import { getStorage } from '@/utils/storage.js'
// import { getNewTokenAPI } from '@/api'
const axios = theAxios.create({
  baseURL: 'http://geek.itheima.net/',
  timeout: 20000 // 20s超时时间（请求20秒无响应直接判定超时）
})

// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  // 目标：统一携带token
  // 判断本地有token再携带，判断api/index.js里如果没有携带authorization，我再添加上去
  // 未定义是undefined，null是需要赋予的
  // ?.可选链操作符，如果前面对象里没有length，整个表达式原地返回undefined
  if (getToken()?.length > 0 && config.headers.Authorization === undefined) {
    config.headers.Authorization = `Bearer ${getToken()}`
  }
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

// 添加响应拦截器
// 本质是一个函数
axios.interceptors.response.use(function (response) {
  // http响应状态码为2xx,3xx，进入这里
  // 对响应数据做点什么
  return response
}, async function (error) {
  // http响应状态码为4xx,5xx，进入这里
  // 对响应错误做点什么
  // 只有401才代表身份过期，需要跳转登录页面
  if (error.response.status === 401) {
    // 不能使用this.$router,因为this不是vue组件对象，无法调用$router
    // 解决：this.$router为了拿到router路由对象，所以直接引入/router下的router对象
    // Notify({ type: 'warning', message: '身份已过期' })
    removeToken() // 先清空，才能让路由守卫判断失效
    // 方式1：强制跳转登录
    // router.replace('/login')

    router.replace(`/login?path=${router.currentRoute.fullPath}`)

    // 方式2：使用refresh_token换回新的token继续使用，用户无感知
    // const res = await getNewTokenAPI()
    // console.log(res)

    // 新的token回来之后，1：更新token到本地
  //   setToken(res.data.data.token)
  //   // 2.更新新的token在请求头里
  //   error.config.headers.Authorization = `Bearer ${res.data.data.token}`
  //   // 3.未完成这次请求，再一次发起
  //   // error.config就是上一次请求的配置对象
  //   // 结果要return回原本逻辑页面调用的地方——return回一个Promise对象
  //   return axios(error.config)
  // } else if (error.response.status === 500 && error.config.url === '/v1_0/authorizations' && error.config.method === 'put') {
  //   // 刷新的refresh_token也过期了
  //   localStorage.clear()
  //   Notify({ type: 'warning', message: '身份已过期' })
  //   router.replace('/login')
  }
  // return Promise.reject(error)
})

export default ({ url, method = 'GET', params = {}, data = {}, headers = {} }) => {
  return axios({
    url,
    method,
    params,
    data,
    headers
  })
  // 以后换库, 只需要改这里, 逻辑页面不用动, 保证代码的复用性和独立性(高内聚低耦合)
  //   return $.ajax({
  //     url: url,
  //     type: method,
  //     data: data,
  //     header: headers
  //   })
}

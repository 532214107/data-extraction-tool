
import axios from 'axios'
import { VueAxios } from './axios'

// 创建 axios 实例
const service = axios.create({
    baseURL: process.env.VUE_APP_API_BASE_URL, // api base_url
    timeout: 5 * 60000, // 请求超时时间
})

const err = (error) => {
    if (error.response) {
        const headers = error.response.headers
        const data = error.response.data
        console.log(data)
        if (error.response.status === 403) {
           
        }
        if (error.response.status === 429) {
            
        }
        if (error.response.status === 401) {
            
        }
        if ("Redirect" == headers.redirect) {
           
        }
    }
    return Promise.reject(error)
}

// request interceptor
service.interceptors.request.use(config => {
    const token = 0
    if (token) {
        config.headers['Access-Token'] = token // 让每个请求携带自定义 token 请根据实际情况自行修改
    }
    return config
}, err)

// response interceptor
service.interceptors.response.use((response) => {
    return response.data
}, err)

const installer = {
    vm: {},
    install(Vue) {
        Vue.use(VueAxios, service)
    }
}

export {
    installer as VueAxios,
    service as axios
}
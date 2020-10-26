import { axios } from '@/utils/request'


//获取实体标签schema
export function getLabekSchema (params) {
    return axios({
        url:`/api/label_schema/`,
        method: 'get',
        params
    })
} 

// 获取数据统计数据
export function getStatistic (params) {
    return axios({
        url: "/api/data_statistic/",
        method: 'get',
        params
    })
}


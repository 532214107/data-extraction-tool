import { axios } from '@/utils/request'


//获取实体标签schema
export function getLabekSchema (params) {
    return axios({
        url:`/api/label_schema/`,
        method: 'get',
        params
    })
} 


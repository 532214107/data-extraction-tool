import { axios } from '@/utils/request'

// 获取领域
export function getAllTaske (params) {
    return axios({
        url: '/api/all_tasks/',
        method: 'get',
        params
    })
}
// 更具id获取结构
export function querySchemaByTaskId (params) {
    return axios({
        url: "/api/get_schema_by_task_id/",
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

// 获取实体标签第一层
export function getLabelSchema (params, method) {
    if(method == 'post'){
        return axios({
            url: "/api/label_schema/",
            method: 'post'
        })
    }else if(method == 'get'){
        return axios({
            url: "/api/label_schema/",
            method: 'get',
            params
        })
    }
}
/**
 * 获取待规范实体类别
 */

 export function getRegulatedEntities (data) {
    return axios({
        url: "/api/regulated_entities/",
        method: 'post',
        data    
    })
 }

 /**
  * 保存单个以规范
  */
 export function saveRegulatedEntities(data) {
     return axios({
         url: "/api/save_regulated_entities/",
         method: 'post',
         data
     })
 }

 /**
  * 待聚合实体列表
  */
 export function getRegulatedPredicateType (data) {
     return axios({
         url: "/api/regulated_predicate_type/",
         method: "post",
         data
     })
 }
 /**
  * 根据实体获取同义词或者同类词表
  */

 export function synonym (params){
     return axios({
         url: "/api/synonym/",
         method: 'get',
         params
     })
 }
 /**
  * 保存聚合实体
  */
export function saveRegulatedPredicates (data) {
    return axios({
        url: "/api/save_regulated_predicate_type/",
        method: "post",
        data
    })
}

/**
 * 任务开始接口
 */

export function task_start (data){
    return axios({
        url: '/api/task_start/',
        method: 'post',
        data
    })
}

/**
 * 已有任务页面
 */
// 获取当前已有任务
export function getAllTasks() {
    return axios({
        url: "/api/all_tasks/",
        method: 'get',
    })
}

export function getDataStatistic (params) {
    return axios({
        url: "/api/data_statistic/",
        method: 'get',
        params
    })
}

export function Getextraction (data) {
    return axios({
        url: "/api/api/nlp/extraction/",
        method: 'post',
        data
    })
}
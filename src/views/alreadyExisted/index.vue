<template>
    <div class="alreadyExistedBody">
        <!-- 已有任务 -->
        <!-- 任务列表 -->
        <div class="taskList">
            <p class="t_title">任务列表</p>
            <el-table
                :data="tableData"
                style="width: 100%">
                <el-table-column
                    prop="task_id"
                    label="task_id">
                </el-table-column>
                <el-table-column
                    prop="create_time"
                    label="创建时间">
                </el-table-column>
                <el-table-column
                    prop="update_time"
                    label="更新时间">
                </el-table-column>
                <el-table-column
                    prop="task_status"
                    label="任务状态">
                    <template slot-scope="scope">
                        <el-tag 
                            effect="dark"
                            type="danger"
                            v-if="scope.row.task_status == '文件上传中'"
                        >
                            {{scope.row.task_status}}
                        </el-tag>
                        <el-tag 
                            effect="dark"
                            type="info"
                            v-if="scope.row.task_status == '实体获取中'"
                        >
                            {{scope.row.task_status}}
                        </el-tag>
                        <el-tag 
                            effect="dark"
                            type="info"
                            v-if="scope.row.task_status == '语料爬取中'"
                        >
                            {{scope.row.task_status}}
                        </el-tag>
                        <el-tag 
                            effect="dark"
                            type="info"
                            v-if="scope.row.task_status == '语料降噪中'"
                        >
                            {{scope.row.task_status}}
                        </el-tag>
                        <el-tag 
                            effect="dark"
                            type="info"
                            v-if="scope.row.task_status == '模型训练中'"
                        >
                            {{scope.row.task_status}}
                        </el-tag>
                        <el-tag 
                            effect="dark"
                            type="info"
                            v-if="scope.row.task_status == '模型集成中'"
                        >
                            {{scope.row.task_status}}
                        </el-tag>
                        <el-tag 
                            effect="dark"
                            type="success"
                            v-if="scope.row.task_status == '完成'"
                        >
                            {{scope.row.task_status}}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column
                    label="操作">
                    <template slot-scope="scope">
                        <el-button @click="download(scope.row)" type="text" size="small">语料下载</el-button>
                        <el-button @click="statistics(scope.row)" type="text" size="small">数据统计</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div>
            <p class="t_title">数量图例</p>
        </div>
    </div>
</template>

<script>
import {
    getAllTasks,
    getDataStatistic
} from "@/api"
export default {
    name: "alreadyExisted",
    data(){
        return {
            tableData: []
        }
    },
    mounted(){
        this.init()
    },
    methods: {
        init(){
            this.getAllTasks()
        },
        getAllTasks(){
            getAllTasks().then(res=>{
                this.tableData = res.result.all_tasks
            })
        },
        download(row){
            window.location.href = '/api/download_dataset/?task_id='+'row.task_id'
        },
        statistics(row){
            getDataStatistic({task_id: '1614846955'}).then(res=>{
                console.log(res)
            })
        },
    }
}
</script>
<style lang="scss" scoped>
.alreadyExistedBody{
    width: 1200px;
    height: 100%;
    margin: 0 auto;
    .t_title{
        font-size: 20px;
        font-weight: bold;
        border-left: 5px solid #000;
        padding-left: 20px;
        margin: 30px 0 10px 0;
    }
}
</style>
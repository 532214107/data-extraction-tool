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
                            type="warning"
                            v-if="scope.row.task_status == '文件上传中'"
                        >
                            {{scope.row.task_status}}
                        </el-tag>
                        <el-tag 
                            effect="dark"
                            type="danger"
                            v-if="scope.row.task_status == '实体获取中'"
                        >
                            {{scope.row.task_status}}
                        </el-tag>
                        <el-tag 
                            effect="dark"
                            type=""
                            v-if="scope.row.task_status == '语料爬取中'"
                        >
                            {{scope.row.task_status}}
                        </el-tag>
                        <el-tag 
                            effect="dark"
                            type=""
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
                    label="操作"
                    width="300">
                    <template slot-scope="scope">
                        <el-button @click="download(scope.row, 'enti_pair')" type="text" size="small">实体对下载</el-button>
                        <el-button @click="download(scope.row, 'dataset')" type="text" size="small">数据集下载</el-button>
                        <el-button @click="statistics(scope.row)" type="text" size="small">数据统计</el-button>
                        <el-button @click="goto(scope.row)" type="text" size="small">预测服务</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div v-show="id">
            <p class="t_title">数据统计</p>
            <!-- 图表 -->
            <div class="chart pieDiv">
                <div id="pieDiv1"></div>
                <div id="pieDiv2"></div>
                <div id="pieDiv3"></div>
                <div id="pieDiv4"></div>
            </div>
            <div class="chart chartBox">
                <!-- 关系图 -->
                <div id="graphChart"></div>
                <div id="pieChat"></div>
            </div>
            
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
            tableData: [],
            id: null
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
        download(row, data){
            window.location.href = '/api/download/?task_id='+row.task_id + '&file_type=' + data
        },
        statistics(row){
            this.id = row.task_id
            getDataStatistic({task_id: row.task_id}).then(res=>{
                this.initPie1('pieDiv1', '实体对数量', res.data_cnt.enti_pairs_cnt, '#5470C6')
                this.initPie1('pieDiv2', '实体类型数', res.data_cnt.enti_types_cnt, '#91CC75')
                this.initPie1('pieDiv3', '关系类型数', res.data_cnt.rel_types_cnt, '#FAC858')
                this.initPie1('pieDiv4', '句子数量', res.data_cnt.sentence_cnt, '#EE6666')
                this.initGraph(res.node_link_schema.links, res.node_link_schema.nodes)
                this.initPie2(res.sentence_info.detail)
            })
        },
        initPie1(id, name, value, color){
            let chart = this.$echarts.init(document.getElementById(id));
            let option = {
                color: [color],
                title: {
                    text: name,
                    left: 'center',
                    top: '40%',
                    textStyle: {
                        fontSize: 20,
                        fontWeight: 'bold',
                        color
                    },
                    subtext: value,
                    subtextStyle: {
                        fontSize: 20,
                        fontWeight: 'bold',
                        color
                    }
                },
                series: [
                    {
                        name,
                        type: 'pie',
                        radius: ['55%', '70%'],
                        avoidLabelOverlap: false,
                        label: {
                            show: false,
                        },
                        emphasis: {
                            scale: false
                        },
                        labelLine: {
                            show: false
                        },
                        data: [
                            {value, name},
                        ]
                    }
                ]
            };
            chart.setOption(option)
        },
        initGraph(links, nodes){
            console.log(links, nodes)
            let chart = this.$echarts.init(document.getElementById('graphChart'));
            let option = {
                title: {
                    text: ''
                },
                tooltip: {},
                animationDurationUpdate: 1500,
                animationEasingUpdate: 'quinticInOut',
                label: {
                    normal: {
                        show: true,
                        textStyle: {
                            fontSize: 12
                        },
                    }
                },
                legend: {
                    x: "center",
                    show: false,
                    data: nodes.map(item=>item.category)
                },
                series: [
                    {
                        type: 'graph',
                        layout: 'force',
                        symbolSize: 45,
                        focusNodeAdjacency: true,
                        roam: true,
                        categories: nodes.map(item=> {
                            return {name: item.category}
                        }),
                        label: {
                            normal: {
                                show: true,
                                textStyle: {
                                    fontSize: 12
                                },
                            }
                        },
                        force: {
                            repulsion: 1000
                        },
                        edgeSymbolSize: [4, 50],
                        // edgeLabel: {
                        //     normal: {
                        //         show: true,
                        //         textStyle: {
                        //             fontSize: 10
                        //         },
                        //         formatter: "{c}"
                        //     }
                        // },
                        data: nodes,
                        links: links,
                        lineStyle: {
                            normal: {
                                opacity: 0.9,
                                width: 1,
                                curveness: 0
                            }
                        }
                    }
                ]
            }
            console.log(option)
            chart.setOption(option)
        },
        initPie2(data){
            let chart = this.$echarts.init(document.getElementById('pieChat'))
            let option = {
                tooltip: {
                    trigger: 'item'
                },
                legend: {
                    top: '5%',
                    left: 'center'
                },
                series: [
                    {
                        name: '访问来源',
                        type: 'pie',
                        radius: ['40%', '70%'],
                        avoidLabelOverlap: false,
                        label: {
                            show: false,
                            position: 'center'
                        },
                        emphasis: {
                            label: {
                                show: false,
                                fontSize: '40',
                                fontWeight: 'bold'
                            }
                        },
                        labelLine: {
                            show: false
                        },
                        data: data.map(item=>{
                            return {
                                name: item.relation_name,
                                value: item.count
                            }
                        })
                    }
                ]
            };
            chart.setOption(option)
        },
        goto(row){
             const { href } = this.$router.resolve({
                 name: "extractionShow",
                 query: {
                     id: row.task_id
                 }
             });
             window.open(href, '_blank');
        }
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
    .chart{
        width: 100%;
        height: 300px;
        border: 1px solid #ccc;
    }
    .pieDiv>div{
        width: 25%;
        height: 100%;
        float: left;
    }
    .chartBox{
         border-top: none;
        &>div:first-child{
            border-right: 1px solid #ccc;
        }
        &>div{
            width: 50%;
            height: 100%;
            float: left;
           
        }
    }
}
</style>
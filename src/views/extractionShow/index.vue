<template>
    <div class="informationExtraction">
        <p class="t_title">预测服务</p>
        <div class="container" v-loading='!allData'>
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span>文本内容与抽取结果三元组</span>
                    <el-button style="float: right; padding: 3px 0" type="text" @click="dialogVisible = true">更换文本</el-button>
                </div>
                <div class="cardBody1" v-if="allData">
                    <div class="item" v-for="(item,key) in allData" :key="key">
                        <div class="title">
                            {{item.sentence}}
                        </div>
                        <div class="content">
                            <span v-for="(spo,index) in item.triples" :key='index' @dblclick="changeSpo(spo, key, index, item.sentence)">{{spo.join("->")}}</span>
                        </div>
                    </div>
                </div>
            </el-card>
            <el-card class="box-card">
                <div class="cardBody">
                    <div id="chartBox"></div>
                </div>
            </el-card>
        </div>


        <el-dialog
            title="更换文本"
            :visible.sync="dialogVisible"
            width="50%"
            :before-close="handleClose">
            <el-input
                v-loading="loading"
                type="textarea"
                :autosize="{ minRows: 5, maxRows: 10}"
                placeholder="请输入内容"
                v-model="textarea">
            </el-input>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="search">确 定</el-button>
            </span>
        </el-dialog>


        <el-dialog
            title="修改三元组"
            :visible.sync="dialogVisible1"
            width="50%"
            :before-close="handleClose">
            <el-input
                v-loading="loading"
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 3}"
                placeholder="请输入内容"
                v-model="textarea1">
            </el-input>
            <p>注：三元组以"->"分割</p>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible1 = false">取 消</el-button>
                <el-button type="primary" @click="changeSpo1">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import {Getextraction} from "@/api"
export default {
    name: "informationExtraction",
    data(){
        return {
            dialogVisible: false,
            dialogVisible1: false,
            textarea: '王选（1937年2月5日—2006年2月13日），男，江苏无锡人，出生于上海，计算机文字信息处理专家，计算机汉字激光照排技术创始人，当代中国印刷业革命的先行者，被称为“汉字激光照排系统之父”，被誉为“有市场眼光的科学家”。',
            loading: false,
            allData: null,
            textarea1: null,
            parInd: null,
            subInd: null,
            parText: null
        }
    },
    mounted(){
        this.Getextraction()
    }, 
    methods: {
        search(){
            this.loading = true
            let form = new FormData()
            form.append('content', this.textarea)
            form.append('task_id', this.$route.query.id)
            Getextraction(form).then(res=>{
                this.allData = res.results
                this.loading = false
                this.dialogVisible = false
                this.initchartBox(res.graph)
            })
        },
        Getextraction(){
            let form = new FormData()
            form.append('content', this.textarea)
            form.append('task_id', this.$route.query.id)
            Getextraction(form).then(res=>{
                this.allData = res.results
                this.initchartBox(res.graph)
                console.log(res.result)
            })
        },
        handleClose(done) {
            this.$confirm('确认关闭？')
            .then(_ => {
                done();
            })
            .catch(_ => {});
        },
        changeSpo(text, parInd, subInd, parText){
            this.textarea1 = text.join('->')
            this.parText = parText
            this.parInd = parInd
            this.subInd = subInd
            this.dialogVisible1 = true
        },
        changeSpo1(){
            let data = this.allData.text_spo
            let arr = this.textarea1.split('->')
            let isTo = true
            arr.forEach((item, index) => {
                if(index!=1 && this.parText.indexOf(item) == -1){
                    isTo = false
                    return
                }
            });
            
            if(!isTo){
                this.$message.error('所填写三元组不在原文中出现或没有连续出现。');
                return
            }
            let arr1 = [...data[this.parInd].spo_list[this.subInd]]
            let arr2 = []
            arr.forEach((item, index) => {
               if(arr1.indexOf(item) == -1){
                   arr2.push({
                       label: item,
                       name: arr1[index]
                   })
               }
            })
            data[this.parInd].spo_list[this.subInd] = arr
            this.allData.nodes.forEach(item=>{
                arr2.forEach(i => {
                    if(item.name == i.name){
                        item.name = i.label
                    }
                })
                
            })
            console.log(this.allData.nodes)
            this.allData.text_spo = data
            this.dialogVisible1 = false
            this.initchartBox(this.allData)
            
        },
        initchartBox(data){  
            console.log(data)
            let chart = this.$echarts.init(document.getElementById('chartBox'))
            let categories = [],
                dnodeSize = 19,
                fontSize = 14;
            let nodes = data.nodes.map(item=>{
                if (!item.category) {
                    item.category = item.label;
                }
                if (categories.indexOf(item.category) == -1) {
                    categories.push(item.category);
                }
                item.value = item.value || 0;
                item.symbol = 'circle';
                item.symbolSize = 40;
                item.x = null;
                item.y = null;
                item.itemStyle = null;
                item.label = {
                    normal: {
                        show: true,
                        position: 'right'
                    }
                };
                return item
            })
            let links = data.links.map(item=>{
                return item
            })
            categories = categories.map(category => ({
                name: category
            }));
            let colorPalette = ["#009688", '#03a9f4', "#f44336", "#607d8b", "#e91e63", "#ff5722", "#673ab7",  "#4caf50", "#ff9800", "#8bc34a", "#00bcd4", "#9c27b0"]
            let option = {
                color: colorPalette,
                title: {
                    text: "",
                    top: '1%',
                    left: '1%',
                    textStyle: {
                        color: "#333333",
                        fontSize: fontSize * 1.8,
                        fontWeight: 'bolder'
                    },
                    subtext: '图中共有 ' + data.nodes.length + ' 个节点以及 ' + data.links.length + ' 条关系',
                    subtextStyle: {
                        color: "#333333",
                        fontSize: fontSize,
                        fontWeight: 'bold'
                    }
                },
                tooltip: {
                    formatter: function (params) {
                        if (params.dataType === 'node')
                            return params.data.category;
                        else
                            return params.data.name;
                    }
                },
                legend: {
                    data: categories,
                    bottom: '1%',
                    left: '1%',
                    orient: 'vertical',
                    selectedMode: false,
                    textStyle: {
                        color: '#333',
                        fontSize: fontSize * 0.9,
                        fontWeight: 'bold'
                    }
                },
                series: [{
                    type: 'graph',
                    layout: 'force',
                    data: nodes,
                    links: links,
                    categories: categories,
                    lineStyle: {
                        color: 'source',
                        curveness: 0.3,
                        width: 3
                    },
                    emphasis: {
                        lineStyle: {
                            width: 5
                        }
                    },
                    force: {
                        repulsion: 1000,
                        layoutAnimation: false
                    },
                    roam: true,
                    focusNodeAdjacency: true,
                    animationDuration: 2000
                }]
            }
            chart.clear()
            chart.setOption(option)
        }
    },
}
</script>

<style lang="scss" scoped>

.informationExtraction{
    height: calc(100vh - 90px);
    padding-top: 20px;
    width: 1200px;
    margin: 0 auto;
    .t_title{
        font-size: 20px;
        font-weight: bold;
        border-left: 5px solid #000;
        padding-left: 20px;
        margin: 30px 0 10px 0;
    }
    .container {
        display: flex;
        justify-content: space-between;
        .box-card{
            width: 49%;
        }
        .cardBody1{
            min-height: 300px;
        }
        .cardBody{
            height: 600px;
            &>div{
                width: 100%;
                height: 100%
            }
        }
        .title{
            margin-top: .4em;
        }
        .content{
            padding: 10px;
            border-bottom: 1px solid #ccc;
            span{
                color: white;
                font-size: 0.8em;
                font-weight: bold;
                background-color: #34495E;
                border-radius: 0.2em;
                margin-right: 1em;
                padding: 0.5em;
                display: inline-block;
                margin-bottom: 1em;
                cursor: pointer;
            }
        }
    }
}
</style>
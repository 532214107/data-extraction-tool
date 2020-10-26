<template>
  <div class="main">
      <!-- 数量图例 -->
      <div class="item">
        <p>数据展示</p>
        <div class="circleList" v-if="allData">
            <chart title="实体类型数" :num="allData.data_cnt.enti_types_cnt" :color="colorList[1]"></chart>
            <chart title="关系类型数" :num="allData.data_cnt.rel_types_cnt" :color="colorList[2]"></chart>
            <chart title="实体对数" :num="allData.data_cnt.enti_pairs_cnt" :color="colorList[3]"></chart>
            <chart title="总句子数" :num="allData.data_cnt.sentence_cnt" :color="colorList[0]"></chart>
        </div>
      </div>
      <!-- 关系展示 -->
      <div class="item">
        <p>关系展示</p>
        <div v-if="allData">
            <graph :chartData="allData.node_link_schema"></graph>
        </div>
      </div>
  </div>
</template>

<script>
import Chart from "./components/chart"
import Graph from "./components/graph"
import {getStatistic} from "@/api/index.js"
export default {
    name: "showMessage",
    components: {
        Chart,
        Graph
    },
    data(){
        return {
            colorList: ['#E01F54','#001852','#e05038','#009966','#9fa8a3',
                '#89bdd3','#e6af4b','#d3758f','#dcc392','#2e4783',
                '#82b6e9','#ff6347','#a092f1','#0a915d','#7d4627',
                '#6699FF','#ff6666','#3cb371','#d5b158','#38b6b6'
            ],
            allData: null
        }
    },
    mounted(){
        this.getStatistic()
    },
    methods: {
        getStatistic() {
            getStatistic({task_name: this.task_name}).then(res=>{
                this.allData = res
            })
        }
    },
    computed: {
        task_name: function(){
            return this.$router.task_name || '人物领域'
        }
    }
}
</script>

<style lang="scss" scoped>
.main{
    width: 1200px;
    margin:  0 auto;
    padding-top: 60px;
    .item{
        margin-bottom: 20px;
        border: 1px solid #ccc;
        border-radius: 10px;
        padding: 20px;
        &>p{
            font-weight: bold;
            font-size: 24px;
            padding-left: 20px;
        }
    }
    .circleList{
        display: flex;
        justify-content: space-around;
        flex-wrap: wrap;
    }
}
</style>
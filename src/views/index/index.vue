<template>
    <div class="main">
        <!-- 步骤条 -->
        <div class="stepBpx">
            <step-box :active="active"></step-box>
        </div>
        <!-- content -->
        <div class="content">
            <!-- 数据准备 -->
            <div class="itemBox" v-show="active == 0">
                <data-preparation ref="preparation" @getTableList="getTableList"></data-preparation>
            </div>
            <!-- 实体规范 -->
            <div class="itemBox" v-show="active == 1">
                <entity-standard ref="entity"></entity-standard>
            </div>
            <!-- 关系聚合 -->
            <div class="itemBox" v-show="active == 2">
                <relation-aggregation ref="relation"></relation-aggregation>
            </div>
            <!-- 数据获取 -->
            <div class="itemBox" v-show="active == 3">
                <data-acquisition ref="acquisition"></data-acquisition>
            </div>
            <!-- WORKING -->
            <!-- <div class="itemBox" v-show="active == 4">
                <working-page></working-page>
            </div> -->
        </div>
        <!-- buttonBox -->
        <div class="buttonBox">
            <el-button type="primary" :disabled='active == 0' @click="last">上一步</el-button>
            <el-button type="primary" @click="next">{{text}}</el-button>
        </div>
    </div>
</template>

<script>
import StepBox from "./components/steps"
import DataPreparation from "./components/DataPreparation"
import EntityStandard from "./components/EntityStandard"
import RelationAggregation from "./components/RelationAggregation"
import DataAcquisition from "./components/DataAcquisition"
import WorkingPage from "./components/WORKING"
export default {
    name: "index",
    components: {
        StepBox,
        DataPreparation,
        EntityStandard,
        RelationAggregation,
        DataAcquisition,
        WorkingPage
    },
    data(){
        return {
            active: 0, // 步骤条
            text: "下一步",
            isNext: true,
            task_id: null
        }
    },
    mounted(){
        if(this.$route.query.active >= 0){
            this.active = Number(this.$route.query.active)
        }
        if(this.active == 0){
            this.$refs.preparation.init()
        }
    },
    methods: {
        next(){
            if(this.text == "开始"){
                this.$refs.acquisition.save()
                return
            }
            if(this.active == 1 && !this.$refs.entity.isNext()){
                this.$message({type: "warning", message: "请先将所有实体规范"})
                 return
            }
            if(this.active == 2 && !this.$refs.relation.isNext()){
                this.$message({type: "warning", message: "请先将所有类别聚合完成后点击下一步"})
                 return
            }
            this.isNext ? this.active <= 4 ? (this.active++, this.$router.push({query: {active: this.active, id: this.$route.query.id}})) : '' : this.$message({type: "warning", message: "请先上传文件或通过id查询领域类别关系"})
        },
        last(){
            this.active >= 1 ? (this.active--, this.$router.push({query: {active: this.active, id: this.$route.query.id}})) : ''
            
        },
        getTableList(l, id){
            if(l > 0){
                this.isNext = true
                this.task_id = id
            }
        },
        init(active){
            switch(active){
                case 0 :
                    this.$refs.preparation.init()
                    break
                case 1 :
                    this.$refs.entity.init()
                    break
                case 2 :
                    this.$refs.relation.init()
                    break
                case 3 :
                    this.$refs.acquisition.init()
                    break
            }
        },
        watchActive(val){
            if(val == 3){
                this.text = '开始'
            }else{
                this.text = '下一步'
            }
            this.init(val)
        }
    },
    watch: {
        active: {
            handler:"watchActive",
        }
    }
}
</script>
<style lang="scss" scoped>
    .main{
        width: 1200px;
        margin: 0 auto;
    }
    .content{
        width: 100%;
        padding-top: 50px;
        .itemBox{
            width: 100%;
            height: 600px;
        }
    }
    .buttonBox{
        text-align: right;
    }
</style>
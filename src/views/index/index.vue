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
                <data-preparation></data-preparation>
            </div>
            <!-- 实体规范 -->
            <div class="itemBox" v-show="active == 1">
                <entity-standard></entity-standard>
            </div>
            <!-- 关系聚合 -->
            <div class="itemBox" v-show="active == 2">
                <relation-aggregation></relation-aggregation>
            </div>
            <!-- 数据获取 -->
            <div class="itemBox" v-show="active == 3">
                <data-acquisition></data-acquisition>
            </div>
            <!-- WORKING -->
            <div class="itemBox" v-show="active == 4">
                <working-page></working-page>
            </div>
        </div>
        <!-- buttonBox -->
        <div class="buttonBox">
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
            text: "下一步"
        }
    },
    methods: {
        next(){
            if(this.text == "完成"){
                return
            }
            this.active <= 4 ? this.active++ : ''
            if(this.active == 4){
                this.text = "完成"
            }
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
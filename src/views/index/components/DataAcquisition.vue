<template>
    <div class="dataAcquisitionBody">
        <!-- 数据 -->
        <el-row :gutter="20">
            <el-col :span="8">
                <div class="centent">
                    <div class="c_header">当前领域：计算机历史</div>
                    <ul class="c_list">
                        <li v-for="(item,index) in list" :key="index"
                        :class="{action: index == actionIndex}"
                        @click="clickListItem(index)">
                             <div>{{item.subject_type}}({{item.subject_en_abbr}})</div>    
                            <div>{{item.predicate}}</div>    
                            <div>{{item.object_type}}({{item.object_en_abbr}})</div>
                        </li>
                    </ul>
                </div>
            </el-col>
            <el-col :span="16">
                <div class="centent">
                    <el-form ref="form" :model="form" label-width="200px">
                        <el-form-item label="带获取的种子来源：">
                            <!-- <el-radio v-model="form.seedSource" label="0">知行中文图谱</el-radio> -->
                            <el-checkbox-group v-model="form.seedSource">
                                <el-checkbox label="知行中文图谱" value="0"></el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                        <el-form-item label="语料来源">
                            <el-select v-model="form.corpusSource" placeholder="请选择语料来源">
                                <el-option label="百度百科" value="0"></el-option>
                                <el-option label="百度新闻" value="1"></el-option>
                                <el-option label="新浪新闻" value="2"></el-option>
                                <el-option label="央视新闻" value="3"></el-option>
                                <el-option label="搜狗新闻" value="4"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="数据集格式">
                            <el-select v-model="form.DSFormat" placeholder="请选择数据集格式">
                                <el-option label="BAG_LEVEL" value="0"></el-option>
                                <el-option label="SENTENCE_LEVEL" value="1"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="语料去噪方法">
                            <el-select v-model="form.corpusDenoisingFormat" placeholder="请选择语料去噪方法">
                                <el-option label="关键词法" value="0"></el-option>
                                <el-option label="实体距离法" value="1"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-form>
                    
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import {querySchemaByTaskId, task_start} from '@/api'
export default {
    name: "dataAcquisition",
    data(){
        return {
            list: [
                {
                    left: 'PER',
                    center: '工作单位',
                    right: 'ORG'
                },
                {
                    left: 'PER',
                    center: '工作单位',
                    right: 'ORG'
                },
                {
                    left: 'PER',
                    center: '工作单位',
                    right: 'ORG'
                }
            ],
            list1: [
                {
                    left: 'WJ',
                    center: '研制者',
                    right: 'PER'
                }
            ],
            actionIndex: null,
            form: {
                seedSource: ["知行中文图谱"],
                corpusSource: '0',
                DSFormat: '0',
                corpusDenoisingFormat: '0'
            },
            task_id: null
        }
    },
    methods: {
        clickListItem(val){
            this.actionIndex = val
        },
        querySchemaByTaskId(task_id){
            querySchemaByTaskId({task_id}).then(res=>{
                let {query: {id}} = this.$route
                if(id != task_id){
                    this.$router.push({query: {active: 0, id: task_id}})
                }
                if(res.status == 'success'){
                    this.$emit("getTableList", res.result.schema.length, task_id)
                    this.list = res.result.schema
                }
            })
        },
        init(){
            this.task_id = this.$route.query.id
            this.querySchemaByTaskId(this.task_id)
        },
        save(){
            let formdata = new FormData()
            formdata.append('task_id', this.task_id)
            formdata.append('seeds_source', this.form.seedSource)
            formdata.append('corpus_source', this.form.corpusSource)
            formdata.append('dataset_pattern', this.form.DSFormat)
            formdata.append('denoise_method', this.form.corpusDenoisingFormat)
            task_start(formdata).then(res=>{
                this.$router.push({path: 'alreadyExisted'})
            })
        }
    }
}
</script>

<style lang="scss" scoped>
p{
    padding: 0;
    margin: 0;
}
.dataAcquisitionBody{
    width: 100%;
    height: 100%;
    .centent{
        width: 100%;
        height: 100%;
        border: 1px solid #ccc;
        border-radius: 5px;
        .c_header{
            font-size: 24px;
            height: 40px;
            line-height: 40px;
            font-weight: bold;
            text-align: center;
            border-bottom: 1px solid #ccc;
        }
        .c_list{
            width: 95%;
            margin: 0 auto;
            height: calc(100% - 45px);
            margin-top: 4px;
            overflow-y: auto;
            &>li:first-child{
                border-top: 1px solid #ccc;
            }
            li{
                border-bottom: 1px solid #ccc;
                height: 30px;
                line-height: 30px;
                cursor: pointer;
                &:hover{
                    color: red;
                }
                &>div{
                    float: left;
                    width: calc(100%/3);
                    border-right: 1px solid #ccc;
                    text-align: center;
                    height: 30px;
                }
                &>div:first-child{
                    border-left: 1px solid #ccc;
                }
            }
            li.action{
                color: red;
            }
        }
        .pointer{
            cursor: pointer;
        }
    }
}
</style>
<style>
.el-row{
    height: 100%;
}
.el-col{
    height: 100%;
}
</style>
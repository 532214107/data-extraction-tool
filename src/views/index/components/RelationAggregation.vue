<template>
    <div class="relationAhhregationBody">
        <!-- 关系聚合 -->
        <el-row :gutter="20">
            <el-col :span="8">
                <div class="centent">
                    <div class="c_header">待聚合关系类别</div>
                    <ul class="c_list">
                        <li v-for="(item,index) in list" :key="index"
                        :class="{action: item.name == actionIndex}"
                        @click="clickListItem(item)">
                            <div>{{item.name}}</div>
                        </li>
                    </ul>
                </div>
            </el-col>
            <el-col :span="8">
                <div class="centent">
                    <div class="c_header">已聚合关系类别</div>
                    <ul class="c_list">
                        <li v-for="(item,index) in list1" :key="index">
                            <div @click="clickListItem1(item)">{{item.name}}</div>
                        </li>
                    </ul>
                </div>
            </el-col>
            <el-col :span="8">
                <div class="centent" v-loading='loading'>
                    <div class="firstTitle">
                        <p class="c_header">关系词聚合</p> 
                        <p class="f_title">{{f_title}}</p>
                        <div class="labels">
                            <el-input
                                class="input-new-tag"
                                v-if="inputVisible"
                                v-model="inputValue"
                                ref="saveTagInput"
                                size="small"
                                @keyup.enter.native="handleInputConfirm"
                                @blur="handleInputConfirm"
                            >
                            </el-input>
                            <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
                            <el-tag
                                :key="tag"
                                v-for="tag in dynamicTags"
                                closable
                                :disable-transitions="false"
                                @close="handleClose(tag)">
                                {{tag}}
                            </el-tag>
                            <el-tag
                                v-for="(tag, index) in newTagss"
                                :key="index"
                                closable
                                type="success"
                                @close="handleClose1(tag)">
                                {{tag}}
                            </el-tag>
                            
                        </div>
                        <div>
                            <el-button @click="save" type="success" size="mini">保存</el-button>
                        </div>
                    </div>
                    <div class="secondTitle">
                        <p>通过HIT同义词词林为您找到关系同义词如下，点击聚合到该关系类型下：</p>
                        <div class="labels">
                            <el-tag
                                v-for="(tag, index) in newTags"
                                :key="index"
                                type="success"
                                @click="addTags(tag)"
                                class="pointer">
                                {{tag}}
                            </el-tag>
                        </div>
                    </div>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import {getRegulatedPredicateType, synonym, saveRegulatedPredicates} from "@/api"
export default {
    name: "relationAhhregation",
    data(){
        return {
            list: [], // 待聚合列表
            list1: [], // 已聚合列表
            actionIndex: null,
            dynamicTags: [],
            newTags: [],
            newTagss: [],
            inputVisible: false,
            inputValue: '',
            task_id: null,
            f_title: '请选择需要聚合的词',
            loading: false
        }
    },
    methods: {
        init(){
            this.task_id = this.$route.query.id
            this.getRegulatedPredicateType()
        },
        getRegulatedPredicateType(){
            let formdata = new FormData()
            formdata.append('task_id', this.task_id)
            getRegulatedPredicateType(formdata).then(res=>{
                let {result:{regulated_predicates, unregulated_predicates}} = res
                this.list = unregulated_predicates.map(item=>{
                     Object.keys(item)[0]
                     return {
                         name: Object.keys(item)[0],
                         arr: item[Object.keys(item)[0]]
                     }
                })
                this.list1 = regulated_predicates.map(item=>{
                     Object.keys(item)[0]
                     return {
                         name: Object.keys(item)[0],
                         arr: item[Object.keys(item)[0]]
                     }
                })
            })
        },
        getSynonym(word){
            synonym({word}).then(res=>{
                this.loading = false
                let {result: {synonym_words, synonym_class_words, word}} = res
                this.dynamicTags = synonym_words
                this.newTags= synonym_class_words
                this.f_title = word
            })
        },
        clickListItem(item){
            this.loading = true
            this.actionIndex = item.name
            this.getSynonym(item.name)
        },
        clickListItem1(item){
            this.getSynonym(item.name)
        },
        save(){
            this.loading = true
            let formdata = new FormData()
            let obj = {}
            obj.predicate = this.f_title
            obj.synonym_list = [...this.dynamicTags,...this.newTagss, this.f_title]
            formdata.append('task_id', this.task_id)
            formdata.append('data', JSON.stringify([obj]))
            saveRegulatedPredicates(formdata).then(res=>{
                this.loading = false
                this.dynamicTags = []
                this.newTags= []
                this.newTagss= []
                this.f_title = '请选择需要聚合的词'
                 let {result:{regulated_predicates, unregulated_predicates}} = res
                this.list = unregulated_predicates.map(item=>{
                     Object.keys(item)[0]
                     return {
                         name: Object.keys(item)[0],
                         arr: item[Object.keys(item)[0]]
                     }
                })
                this.list1 = regulated_predicates.map(item=>{
                     Object.keys(item)[0]
                     return {
                         name: Object.keys(item)[0],
                         arr: item[Object.keys(item)[0]]
                     }
                })
            })
        },
        handleClose(tag){
            this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
        },
        showInput() {
            this.inputVisible = true;
            this.$nextTick(_ => {
            this.$refs.saveTagInput.$refs.input.focus();
            });
        },
        handleInputConfirm() {
            let inputValue = this.inputValue;
            if (inputValue) {
            this.dynamicTags.push(inputValue);
            }
            this.inputVisible = false;
            this.inputValue = '';
        },
        addTags(tag){
            this.newTags.splice(this.newTags.indexOf(tag), 1);
            this.newTagss.push(tag)
        },
        handleClose1(tag){
            this.newTagss.splice(this.newTagss.indexOf(tag), 1);
            this.newTags.unshift(tag)
        },
        isNext(){
            if(this.list.length == 0){
                return true
            }
        }
    }
}
</script>

<style lang="scss" scoped>
p{
    padding: 0;
    margin: 0;
}
.relationAhhregationBody{
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
            overflow-x: auto;
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
                    width: 100%;
                    text-align: center;
                    height: 30px;
                    text-align: center;
                }
            }
            li.action{
                color: red;
            }
        }
        .firstTitle,
        .secondTitle{
            height: 50%;
            width: 100%;
            
        }
        .secondTitle{
            border-top: 1px solid #ccc;
            p {
                width: 90%;
                margin: 0 auto;
                font-size: 16px;
                padding: 5px 10px;
                text-indent: 32px;
                line-height: 30px;
            }
        }
        .firstTitle{
            
            .f_title{
                text-align: center;
                font-size: 16px;
                font-weight: bold;
            }
            &>div:last-child{
                text-align: right;
                padding-right: 20px;
            }
        }
        .labels{
            width: 90%;
            height: 200px;
            margin: 10px auto 0;
            border: 1px solid #ccc;
            padding: 10px;
            overflow-y: auto;
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
.el-tag + .el-tag {
    margin-left: 10px;
    margin-bottom: 10px;
  }
.button-new-tag {
    margin-right: 10px;
    margin-bottom: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
}
.input-new-tag {
    width: 90px;
    margin-right: 10px;
    margin-bottom: 10px;
    vertical-align: bottom;
}
.el-scrollbar__wrap{
    overflow-x: scroll;
}
</style>
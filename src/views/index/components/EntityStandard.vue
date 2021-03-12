<template>
    <div class="entityStandardBody">
        <!-- 实体规范 -->
        <el-row :gutter="20">
            <el-col :span="5">
                <div class="centent">
                    <div class="c_header">待规范实体类别</div>
                    <ul class="c_list">
                        <li class="c_item" 
                            :class="{action: item.title == actionTitle}" 
                            v-for="item in list" 
                            :key="item.title" 
                            @click="clickListItem(item)"
                        >{{item.title}}</li>
                    </ul>
                </div>
            </el-col>
            <el-col :span="5">
                <div class="centent">
                    <div class="c_header">已规范实体类别</div>
                    <ul class="c_list">
                        <li class="c_item" @click="hanldListItem1(item)" v-for="(item) in list1" :key="item.title">{{item.title}}</li>
                    </ul>
                </div>
            </el-col>
            <el-col :span="14">
                <div class="centent">
                    <div class="firstTitle">
                        <p class="c_header">LAYER1</p> 
                        <div class="LAYER1Box">
                            <el-scrollbar class="tab_scroll" style="height: 100%;">
                                <div class="LAYER1Content">
                                    <span @click="hanldLayer1(item[0],index)" :class="{action: actionIndex == index}" v-for="(item, index) in Layer1List" :key="item[0]">{{item[0]}}({{item[1]}})</span>
                                </div>
                            </el-scrollbar>
                        </div>
                    </div>
                    <div class="secondTitle">
                        <p class="c_header">LAYER2</p> 
                        <div class="LAYER1Box">
                            <el-scrollbar class="tab_scroll" style="height: 100%;">
                                <div class="LAYER1Content">
                                    <span @click="hanldLayer2(item[0])" v-for="(item) in Layer2List" :key="item[0]">{{item[0]}}({{item[1]}})</span>
                                </div>
                            </el-scrollbar>
                        </div>
                    </div>
                    <div class="secondTitle">
                        <p class="c_header">{{actionTitle}} <span class="subtitle">1.选择待规范实体2.添加添加label添加标签3.添加完成后点击保存</span> </p> 
                        <div class="LAYER1Box" v-loading='loding'>
                            <el-scrollbar class="tab_scroll" style="height: calc(100% - 30px);">
                                <div class="LAYER1Content">
                                    <!-- <span v-for="(item) in PERlist" :key="item[0]">{{item[0]}}({{item[1]}})</span> -->
                                    <el-tag
                                        v-for="tag in PERlist"
                                        :key="tag"
                                        closable
                                        @close="handleTagClose(tag)">
                                        {{tag}}
                                    </el-tag>
                                </div>
                            </el-scrollbar>
                            <el-button @click="save" type="success" size="mini">保存</el-button>
                        </div>
                    </div>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import {getLabelSchema, getRegulatedEntities, saveRegulatedEntities} from "@/api"
export default {
    name: "entityStandard",
    data(){
        return {
            list: [], // 待规范实体
            list1: [], // 已规范实体
            actionTitle: null,
            Layer1List: [],
            Layer2List: [],
            PERlist: [],
            actionIndex: null,
            task_id: null,
            loding: false
        }
    },
    methods: {
        clickListItem(item){
            this.actionTitle = item.title
        },
        hanldListItem1(item){
            this.actionTitle = item.title
            this.PERlist = item.words
        },
        getLabelSchema(label){
             if(label == null){
                 getLabelSchema(null, 'post').then(res=>{
                    if(res.status == 'success'){
                         this.Layer1List = res.result.ROOT
                        // this.hanldLayer1(this.Layer1List[0][0], 0)
                    }else{
                        console.log('获取label接口有问题!!!')
                    }
                })
            }else{
                getLabelSchema({label}, 'get').then(res=>{
                    if(res.status == 'success'){
                        this.Layer2List = res.result[label]
                    }else{
                        console.log('获取label接口有问题!!!')
                    }
                })
                
            }
            
        },
        hanldLayer1(label, index){
            this.actionIndex = index
            this.getLabelSchema(label)
            let isInside = this.PERlist.indexOf(label)
            if(isInside == -1){
                this.PERlist.push(label)
            }
        },
        hanldLayer2(label){
            let isInside = this.PERlist.indexOf(label)
            if(isInside == -1){
                this.PERlist.push(label)
            }
        },
        handleTagClose(tag){
            this.PERlist.splice(this.PERlist.indexOf(tag), 1);
        },
        // 保存单个实体
        save(){
            if(this.actionTitle && this.PERlist.length>0){
                this.loding = true
                let formData = new FormData()
                let obj = {}
                obj.enti_type = this.actionTitle
                obj.tag_list = this.PERlist
                formData.append('data', JSON.stringify([obj]))
                formData.append('task_id', this.task_id)
                saveRegulatedEntities(formData).then(res=>{
                    this.loding = false
                    this.actionTitle = null
                    this.PERlist = []
                    let {result} = res
                    this.formatList(result)
                })
            }
            
        },
        getRegulatedEntities(){
            let formData = new FormData()
            formData.append('task_id', this.task_id)
            getRegulatedEntities(formData).then(res=>{
                let {result} = res
                this.formatList(result)
            })
        },
        // 格式化 规范实体数据
        formatList(result){
            this.list1 = result.regulated_entities.map(item=>{
                let obj = {}
                obj.title = Object.keys(item)[0]
                obj.words = item[Object.keys(item)[0]]
                return obj
            })
            this.list = result.unregulated_entities.map(item=>{
                let obj = {}
                obj.title = Object.keys(item)[0]
                obj.words = item[Object.keys(item)[0]]
                return obj
            })
        },
        init(){
            this.task_id = this.$route.query.id
            this.getLabelSchema(null)
            this.getRegulatedEntities()
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
.entityStandardBody{
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
            li{
                border-bottom: 1px solid #ccc;
                height: 30px;
                line-height: 30px;
                padding-left: 20px;
                cursor: pointer;
                &:hover{
                    color: red;
                }
            }
            li.action{
                color: red;
            }
        }
        .firstTitle,
        .secondTitle{
            height: 33%;
            width: 100%;
            p {
                width: 98%;
                margin: 0 auto;
                text-align: left;
            }
            .LAYER1Box{
                height: calc(100% - 40px);
                width: 100%;
                padding: 10px;
                overflow-x: hidden;
                font-size: 14px;
                .LAYER1Content{
                    width: 99%;
                    display: flex;
                    justify-content: flex-start;
                    overflow: hidden;
                    span{
                        margin: 10px 10px 0 0;
                        cursor: pointer;
                        &:hover{
                            color: red;
                        }
                    }
                    span.action{
                        color: red;
                    }
                    flex-wrap: wrap;
                }
            }
        }
        .secondTitle{
            border-top: 1px solid #ccc;
            .subtitle{
                font-size: 16px;
                color: #ccc;
            }
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
.el-scrollbar__wrap{
    overflow-x: hidden;
    overflow-y: scroll;
}
</style>
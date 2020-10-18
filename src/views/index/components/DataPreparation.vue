<template>
  <div class="box">
      <div class="leftBox">
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span>标签&上传文件</span>
                </div>
                <div class="leftTop">
                    <el-scrollbar class="tab_scroll" style="height: 100%;">
                        <el-tag
                            :key="tag"
                            v-for="tag in dynamicTags"
                            closable
                            :disable-transitions="false"
                            @close="handleClose(tag)">
                            {{tag}}
                        </el-tag>
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
                    </el-scrollbar>
                </div>
                <div class="leftBottom">
                    <el-upload
                    class="upload-demo"
                    drag
                    accept=".xls,.xlsx"
                    action="/api/schema_file_upload/"
                    multiple>
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                        <div class="el-upload__tip" slot="tip">只能上传.xls/.xlsx文件</div>
                    </el-upload>
                </div>
            </el-card>
      </div>
      <div class="rightBox">
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span>领域类别关系</span>
                    <el-button style="float: right; padding: 3px 0" type="text">增加</el-button>
                </div>
                <div style="height: calc(100% - 60px)">
                    <el-scrollbar class="tab_scroll" style="height: 100%;">
                        <div v-for="(item, key) in tableList" :key="key" class="listBox">
                            <div class="entity1">{{item.entity1}}</div>    
                            <div class="relation">{{item.relation}}</div>    
                            <div class="entity2">{{item.entity2}}</div>    
                        </div> 
                    </el-scrollbar>
                </div>
            </el-card>
      </div>
  </div>
</template>

<script>
import {getLabekSchema} from "@/api/index"
export default {
    name: "dataPreparation",
    data(){
        return {
            dynamicTags: ['人物领域', '人才领域', '历史领域', '航信领域'],
            inputVisible: false,
            inputValue: '',
            tableList: [
                {
                    entity1: "PER",
                    relation: "工作单位",
                    entity2: "ORG"
                },
                {
                    entity1: "PER",
                    relation: "工作单位",
                    entity2: "ORG"
                },
                {
                    entity1: "PER",
                    relation: "工作单位",
                    entity2: "ORG"
                },
                {
                    entity1: "PER",
                    relation: "工作单位",
                    entity2: "ORG"
                },
                {
                    entity1: "PER",
                    relation: "工作单位",
                    entity2: "ORG"
                },
                {
                    entity1: "PER",
                    relation: "工作单位",
                    entity2: "ORG"
                },
                {
                    entity1: "PER",
                    relation: "工作单位",
                    entity2: "ORG"
                },
                {
                    entity1: "PER",
                    relation: "工作单位",
                    entity2: "ORG"
                },
                {
                    entity1: "PER",
                    relation: "工作单位",
                    entity2: "ORG"
                },
                {
                    entity1: "PER",
                    relation: "工作单位",
                    entity2: "ORG"
                },
            ]
        }
    },
    mounted(){
        this.getLabekSchema()
    },
    methods: {
        handleClose(tag) {
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
        getLabekSchema(){
            getLabekSchema().then(res=>{
                console.log(res)
            })
        }
    }
}
</script>

<style  lang="scss" scoped>
.box{
    width: 100%;
    height: 100%;
    .leftBox,
    .rightBox{
        float: left;
        width: 50%;
        height: 100%;
        padding: 20px;
    }
    .box-card{
        width: 100%;
        height: 100%;
    }
    .clearfix{
        text-align: center;
        font-size: 20px;
    }
    .leftBox{
        .leftTop{
            height: 50%;
            overflow-x: hidden;
            .tab_scroll{
                overflow-x: hidden;
            }
            .el-tag{
                margin-right: 10px;
                margin-bottom: 10px;
            }
            .button-new-tag {
                margin-left: 10px;
                height: 32px;
                line-height: 30px;
                padding-top: 0;
                padding-bottom: 0;
            }
            .input-new-tag {
                width: 90px;
            }
        }
    }
    .rightBox{
        .listBox{
            width: 90%;
            margin: 0 auto 10px;
            height: 45px;
            border-bottom: 1px solid #ccc;
            &>div{
                width: (100%/3);
                float: left;
                line-height: 45px;
                text-align: center;
            }
        }
    }
    ::v-deep{
        .el-card__body{
            height: 100%;
        }
        .el-scrollbar__wrap{
            overflow-x: hidden;
        }
        .el-upload-dragger{
            width: 250px;
            height: 125px;
            .el-icon-upload {
                font-size: 34px;
                color: #C0C4CC;
                margin: 5px 0 8px;
                line-height: 50px;
            }
        }
        .upload-demo{
            text-align: center;
            .el-scrollbar__view{
                height: 100%;
            }
        }
    }
}
</style>
<template>
  <div class="box">
      <div class="leftBox">
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span>查询&上传文件</span>
                </div>
                <div class="leftTop">
                        <el-row :gutter="20">
                            <el-col :span="10">
                                <el-input size="small" v-model="inputText" placeholder="请输入任务ID"></el-input>
                            </el-col>
                            <el-col :span="4">
                                <el-button size="small" type="primary" @click="search">查询</el-button>
                            </el-col>
                        </el-row>
                </div>
                <div class="leftBottom">
                    <el-upload
                    class="upload-demo"
                    drag
                    accept=".xls,.xlsx,.csv"
                    action="/api/schema_file_upload/"
                    multiple
                    :on-success="success"
                    ref="uploadFile"
                    >
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                        <div class="el-upload__tip" slot="tip">只能上传.xls/.xlsx/.csv文件</div>
                    </el-upload>
                </div>
            </el-card>
      </div>
      <div class="rightBox">
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span>领域类别关系</span>
                </div>
                <div style="height: calc(100% - 60px)">
                    <el-scrollbar class="tab_scroll" style="height: 100%;">
                        <template v-show="tableList.length > 0">
                            <div v-for="(item, key) in tableList" :key="key" class="listBox">
                                <div class="entity1">{{item.subject_type}}({{item.subject_en_abbr}})</div>    
                                <div class="relation">{{item.predicate}}</div>    
                                <div class="entity2">{{item.object_type}}({{item.object_en_abbr}})</div>
                                <div class="operation" @click="operation(item, key)">操作</div>    
                            </div> 
                        </template>
                        <div v-show="tableList.length == 0" class="listBox">
                            <div style="width: 100%">请上传文件或通过id检索</div>
                        </div> 
                    </el-scrollbar>
                </div>
            </el-card>
      </div>


      <el-dialog
            :title="formText"
            :visible.sync="dialogVisible"
            width="50%"
            :before-close="handleClose"
        >
        <el-form ref="form" :model="form" :rules='rules'>
            <el-form-item label="实体1" prop="object_type" :label-width="formLabelWidth">
                <el-input v-model="form.object_type" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="实体1标签" prop="object_en_abbr" :label-width="formLabelWidth">
                <el-input v-model="form.object_en_abbr" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="关系类型" prop="predicate" :label-width="formLabelWidth">
                <el-input v-model="form.predicate" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="实体2" prop="subject_type" :label-width="formLabelWidth">
                <el-input v-model="form.subject_type" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="实体2标签" prop="subject_en_abbr" :label-width="formLabelWidth">
                <el-input v-model="form.subject_en_abbr" autocomplete="off"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="confirm">确 定</el-button>
        </span>
        </el-dialog>
  </div>
</template>

<script>
import {querySchemaByTaskId} from '@/api'
export default {
    name: "dataPreparation",
    data(){
        return {
            dynamicTags: ['人物领域', '人才领域', '历史领域', '航信领域'],
            inputVisible: false,
            inputValue: '',
            tableList: [],
            dialogVisible: false,
            form: {
                "object_type": null,
                "object_en_abbr": null,
                "predicate": null,
                "subject_type": null,
                "subject_en_abbr": null
            },
            rules: {
                object_type: [{ required: true, message: '请输入实体1', trigger: 'blur' }],
                object_en_abbr: [{ required: true, message: '请输入实体1标签', trigger: 'blur' }],
                predicate: [{ required: true, message: '请输入关系类型', trigger: 'blur' }],
                subject_type: [{ required: true, message: '请输入实体2', trigger: 'blur' }],
                subject_en_abbr: [{ required: true, message: '请输入实体2标签', trigger: 'blur' }]
            },
            formLabelWidth: "formLabelWidth",
            formText: '编辑',
            actionIndex: null,
            inputText: ""
        }
    },
    mounted(){
        
    },
    methods: {
        init(){
            if(this.$route.query.id){
                this.querySchemaByTaskId(this.$route.query.id)
            }
        },
        //上传成功执行
        success(res){
            if(res.status == 'success'){
                this.querySchemaByTaskId(res.result.task_id)
                this.$refs.uploadFile.clearFiles()
            }
        },
        // 数据格式化
        format(arr){
            let index = this.actionIndex
            this.tableList[index] = arr[0]
            this.actionIndex = null
        },
        /**
         * 编辑实体item
         */
        operation(item, key){
            this.dialogVisible = true
            this.form = item
            this.actionIndex = key
        },
        handleClose(done){
            this.$confirm('确认关闭？')
            .then(() => {
                done();
            })
            .catch(() => {});
        },
        // 对话框确认
        confirm(){
            let obj = {...this.form}
            this.$refs.form.validate((valid) => {
                if (valid) {
                    this.format([obj])
                    this.dialogVisible = false
                } else {
                    return false;
                }
            });
        },
        
        // 查询任务
        search(){
            if(this.inputText != ""){
                this.querySchemaByTaskId(this.inputText)
            }else{
                this.$message({type: "error", message: "请输入用户ID"});
            }
        },
        /**
         * 通过task_id查询领域类别关系
         */
        querySchemaByTaskId(task_id){
            querySchemaByTaskId({task_id}).then(res=>{
                let {query: {id}} = this.$route
                if(id != task_id){
                    this.$router.push({query: {active: 0, id: task_id}})
                }
                if(res.status == 'success'){
                    this.$emit("getTableList", res.result.schema.length, task_id)
                    this.tableList = res.result.schema
                }
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
            .tag{
                cursor: pointer;
            }
            .tag:hover{
                background-color: #fff;
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
                float: left;
                line-height: 45px;
                text-align: center;
            }
            .entity1,
            .entity2{
                width: 30%;
            }
            .relation{
                width: 25%;
            }
            .operation{
                width: 15%;
                color: #409EFF;
                cursor: pointer;
            }
            .operation:hover{
                color: #66b1ff;
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
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
                            class="tag"
                            :key="tag"
                            v-for="tag in dynamicTags"
                            :disable-transitions="false">
                            {{tag}}
                        </el-tag>
                    </el-scrollbar>
                </div>
                <div class="leftBottom">
                    <el-upload
                    class="upload-demo"
                    drag
                    accept=".xls,.xlsx,.csv"
                    action="/api/schema_file_upload/"
                    multiple
                    :on-success="success">
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
                    <el-button style="float: right; padding: 3px 0" type="text" @click="operation(null)">增加</el-button>
                </div>
                <div style="height: calc(100% - 60px)">
                    <el-scrollbar class="tab_scroll" style="height: 100%;">
                        <template v-show="tableList.length > 0">
                            <div v-for="(item, key) in tableList" :key="key" class="listBox">
                                <div class="entity1">{{item.实体1}}({{item.实体1标签}})</div>    
                                <div class="relation">{{item.关系类型}}</div>    
                                <div class="entity2">{{item.实体2}}({{item.实体2标签}})</div>
                                <div class="operation" @click="operation(item, key)">操作</div>    
                            </div> 
                        </template>
                        <div v-show="tableList.length == 0" class="listBox">
                            <div style="width: 100%">请上传文件或点击左侧标签</div>
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
            <el-form-item label="实体1" prop="实体1" :label-width="formLabelWidth">
                <el-input v-model="form.实体1" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="实体1标签" prop="实体1标签" :label-width="formLabelWidth">
                <el-input v-model="form.实体1标签" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="关系类型" prop="关系类型" :label-width="formLabelWidth">
                <el-input v-model="form.关系类型" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="实体2" prop="实体2" :label-width="formLabelWidth">
                <el-input v-model="form.实体2" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="实体2标签" prop="实体2标签" :label-width="formLabelWidth">
                <el-input v-model="form.实体2标签" autocomplete="off"></el-input>
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
                "实体1": null,
                "实体1标签": null,
                "关系类型": null,
                "实体2": null,
                "实体2标签": null,
            },
            rules: {
                实体1: [{ required: true, message: '请输入实体1', trigger: 'blur' }],
                实体1标签: [{ required: true, message: '请输入实体1标签', trigger: 'blur' }],
                关系类型: [{ required: true, message: '请输入关系类型', trigger: 'blur' }],
                实体2: [{ required: true, message: '请输入实体2', trigger: 'blur' }],
                实体2标签: [{ required: true, message: '请输入实体2标签', trigger: 'blur' }]
            },
            formLabelWidth: "formLabelWidth",
            formText: '增加',
            actionIndex: null
        }
    },
    mounted(){
        
    },
    methods: {
        //上传成功执行
        success(res){
            let {table_body} = res
            this.tableList.unshift(...table_body)
        },
        // 数据格式化
        format(arr){
            console.log(arr, this.actionIndex)
            let index = this.actionIndex
            if(typeof this.actionIndex == 'number'){
                this.tableList[index] = arr[0]
            }else{
                this.tableList.unshift(...arr)
            }
            this.actionIndex = null
        },
        // 增加
        operation(item, key){
            this.dialogVisible = true
            if(item){
                this.formText = '编辑'
                this.form.实体1 = item.实体1
                this.form.实体2 = item.实体2
                this.form.关系类型 = item.关系类型
                this.form.实体1标签 = item.实体1标签
                this.form.实体2标签 = item.实体2标签
                this.actionIndex = key
            }else{
                this.formText = '增加'
                this.form.实体1 = null
                this.form.实体2 = null
                this.form.关系类型 = null
                this.form.实体1标签 = null
                this.form.实体2标签 = null
                this.actionIndex = null
            }
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
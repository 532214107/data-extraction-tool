<template>
    <div class="workingBody">
        <!-- 数据 -->
        <el-row :gutter="20">
            <el-col :span="8">
                <div class="centent">
                    <div class="c_header">当前领域：计算机历史</div>
                    <ul class="c_list">
                        <li v-for="(item,index) in list" :key="index"
                        :class="{action: index == actionIndex}"
                        @click="clickListItem(index)">
                            <div>{{item.left}}</div>
                            <div>{{item.center}}</div>
                            <div>{{item.right}}</div>
                        </li>
                    </ul>
                </div>
            </el-col>
            <el-col :span="16">
                <div class="centent">

                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
export default {
    name: "working",
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
                seedSource: '',
                corpusSource: '',
                DSFormat: '',
                corpusDenoisingFormat: ''
            }
        }
    },
    methods: {
        clickListItem(val){
            this.actionIndex = val
        }
    }
}
</script>

<style lang="scss" scoped>
p{
    padding: 0;
    margin: 0;
}
.workingBody{
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
        .pointer{
            cursor: pointer;
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
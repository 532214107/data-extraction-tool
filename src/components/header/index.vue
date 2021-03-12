<template>
    <div>
        <el-menu 
            :default-active="activeIndex" 
            class="el-menu-demo" 
            mode="horizontal" 
            active-text-color="#ffd04b"
            background-color="#545c64"
            text-color="#fff"
            router>
            <el-menu-item index="/index">首页</el-menu-item>
            <el-menu-item index="/alreadyExisted">已有任务</el-menu-item>
            <el-menu-item index="/extractionShow">抽取展示</el-menu-item>
        </el-menu>
    </div>
</template>

<script>
export default {
    name: "Header",
    data(){
        return {
            activeIndex: '/index',
        }
    },
    mounted(){
        this.activeIndex = "/" + window.location.href.split('/')[4]
    }
}
</script>

<style lang="scss" scoped>
.el-menu-demo{
    width: 100%;
    padding: 0 200px;
}
</style>
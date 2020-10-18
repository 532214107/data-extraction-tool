<template>
  <div>
    <el-steps 
        :active="active" 
        align-center
    >
        <el-step title="数据准备"></el-step>
        <el-step title="实体规范"></el-step>
        <el-step title="关系聚合"></el-step>
        <el-step title="数据获取"></el-step>
        <el-step title="WORKING"></el-step>
    </el-steps>
  </div>
</template>

<script>
export default {
    name: "steps",
    props: {
        active: {
            type: Number,
            default: 1
        }
    }
}
</script>

<style>

</style>
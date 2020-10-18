<template>
  <el-container>
        <el-header>
            <global-header></global-header>
        </el-header>
        <el-main>
            <router-view />
        </el-main>
    </el-container>
</template>

<script>
import GlobalHeader from '@/components/header'

export default {
  name: 'BasicLayout',
  components: {
    GlobalHeader
  },
  data() {
    return {
      layoutClass: null
    }
  },
  created() {
    const { layoutClass } = this.$route.meta
    this.layoutClass = layoutClass
  }
}
</script>

<style lang="scss" scoped>
  .container {
    width: 1440px;
    margin: 0 auto;
  }
  .el-header{
    padding: 0;
  }
</style>
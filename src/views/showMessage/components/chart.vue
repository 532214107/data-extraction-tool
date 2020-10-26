<template>
    <div class="circle" :style="{color: color}">
        <div class="title">{{title}}</div>
        <div class="content">
            <countTo :startVal='startVal' :endVal='num' :duration='1000'></countTo>
        </div>
    </div>
</template>

<script>
import countTo from 'vue-count-to';
export default {
    props: {
        num: {
            type: Number,
            required: true,
            default: function () {
                return 0
            }
        },
        title: {
            type: String,
            required: true,
            default: function () {
                return '数'
            }
        },
        color: {
            type: String,
            default: function () {
                return "#000"
            }
        }
    },
    components: {
        countTo
    },
    data () {
      return {
        startVal: 0
      }
    }
}
</script>

<style>
.circle{
    width: 200px;
    height: 200px;
    border: 10px solid;
    background-color: #ccc;
    border-radius: 50%;
    margin: 20px;
}
.title,
.content{
    width: 100%;
    height: 100px;
    text-align: center;
    font-size: 20px;
}
.title{
    line-height: 130px;
}
</style>
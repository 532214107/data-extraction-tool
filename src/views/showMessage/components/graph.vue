<template>
  <div id="myChart" style="height: 500px"></div>
</template>

<script>
let colorPalette = ["#009688", '#03a9f4', "#f44336", "#607d8b", "#e91e63", "#ff5722", "#673ab7",  "#4caf50", "#ff9800", "#8bc34a", "#00bcd4", "#9c27b0"]
let fontSize = 14
let option = {
    backgroundColor: 'white',
    color: colorPalette,
    legend: [
        {
            data: []
        }
    ],
    title: {
        top: '1%',
        left: '1%',
        textStyle: {
            color: "#333333",
            fontSize: fontSize,
            fontWeight: 'bolder'
        },
    },
    tooltip: {
        formatter: function (params) {
            if (params.dataType === 'node')
                return params.data.category;
            else
                return params.data.name;
        }
    },
    series: [{
        name: "关系图",
        type: 'graph',
        layout: 'force',
        data: [],
        links: [],
        edgeSymbol: ['', 'arrow'],
        categories:[],
        lineStyle: {
            color: 'source',
            curveness: 0.3
        },
        emphasis: {
            lineStyle: {
                width: 5
            }
        },
        force: {
            repulsion: 1000,
            layoutAnimation: false
        },
        roam: true,
        focusNodeAdjacency: true,
        animationDuration: 2000
    }]
};
export default {
    name: "graph",
    props: ['chartData'],
    data(){
        return {
            option:option,
            colorPalette: ["#009688", '#03a9f4', "#f44336", "#607d8b", "#e91e63", "#ff5722", "#673ab7",  "#4caf50", "#ff9800", "#8bc34a", "#00bcd4", "#9c27b0"]
        }
    },
    mounted(){
        this.init()
    },
    methods: {
        init(){
            if(this.chartData){
                let myChart = this.$echarts.init(document.getElementById('myChart')) 
                myChart.showLoading()    
                let arr = []
                let arr1 = []
                this.chartData.nodes.forEach(item => {
                    arr.push({name: item.category})
                    arr1.push(item.category)
                });
                this.option.series[0].data = this.chartData.nodes
                this.option.series[0].links = this.chartData.links
                this.option.series[0].categories = this.chartData.arr
                this.option.legend[0].data = this.chartData.arr1
                myChart.hideLoading()    
                console.log(this.option)
                myChart.setOption(this.option)
            }
        }
    },
    watch: {
        chartData(){
            this.init()
        }
    }
}
</script>

<style lang="scss" scoped>

</style>>
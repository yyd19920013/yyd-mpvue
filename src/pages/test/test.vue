<template>
    <div :animation="animationData" class="test">
        测试页面
        <button @click="clickFn" type="button">跳转</button>
    </div>
</template>

<script>
import {wxAnimation} from 'js/yydjs';

export default{
    data(){
        return{
            animationData:{},
        }
    },

    onShow(){
        wxAnimation({
            parent:this,
            animationName:'animationData',
            animationConfig:{
                scale:[2,2],
                rotate:45,
            },
        });
    },

    methods:{
        clickFn(){
            wx.switchTab({
                url:'../home/home',
            });
        },
    },

    components:{

    },
}
</script>

<style lang="scss" scoped>
    .test{

    }
</style>

<template>
    <div class="home">
        <button @click="clickFn">跳转测试</button>
    </div>
</template>

<script>
import {resetData} from 'js/yydjs';

const resetDataFn=resetData({

});

export default{
    data(){
        return resetDataFn.data;
    },

    onHide(){
        //重置data
        resetDataFn.reset(this);
    },

    onShow(){

    },

    methods:{
        clickFn(){
            wx.navigateTo({
                url:'../test/test?a=1&b=2',
            });
        },
    },

    components:{

    },
}
</script>

<style lang="scss" scoped>
    .home{

    }
</style>

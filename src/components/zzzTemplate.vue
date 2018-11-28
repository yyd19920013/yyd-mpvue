<template>
    <div class="name">

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

    /*
        例子：
    */

    props:{},

    onHide(){
        //重置data
        resetDataFn.reset(this);
    },

    onLoad(){

    },

    methods:{

    },
}
</script>

<style lang="scss" scoped>
    .name{

    }
</style>

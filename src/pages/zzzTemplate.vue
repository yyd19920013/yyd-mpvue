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

    onHide(){
        //重置data
        resetDataFn.reset(this);
    },

    onShow(){

    },

    methods:{

    },

    components:{

    },
}
</script>

<style lang="scss" scoped>
    .name{

    }
</style>

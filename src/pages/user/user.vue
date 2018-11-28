<template>
    <div class="user">
        我的页面
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
    .user{

    }
</style>

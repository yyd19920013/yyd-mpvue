<template>
    <div class="home">
        <button @click="clickFn">跳转测试</button>
        <button @click="clickFn1">{{a}}</button>
    </div>
</template>
<script>
import { resetData } from 'js/yydjs';

const resetDataFn = resetData({ //需要重置的data属性
    a: 1,
});

export default {
    data() {
        return Object.assign({}, resetDataFn.data, {

        });
    },

    onHide() {
        //重置data
        resetDataFn.reset(this);
    },

    onShow() {

    },

    methods: {
        clickFn() {
            wx.navigateTo({
                url: '../test/test?a=1&b=2',
            });
        },
        clickFn1() {
            this.a++;
        },
    },

    components: {

    },
}

</script>
<style lang="scss" scoped>
.home {}

</style>

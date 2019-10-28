<template>
    <div class="name">
    </div>
</template>
<script>
import { resetData } from 'js/yydjs';

const resetDataFn = resetData({ //需要重置的data属性

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

    },

    components: {

    },
}

</script>
<style lang="scss" scoped>
.name {}

</style>

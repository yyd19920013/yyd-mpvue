<template>
    <div class="name">
    </div>
</template>
<script>
import {} from 'js/yydjs';

export default {
    data() {
        return {

        };
    },

    onShow() {

    },

    onHide() { //为保证每次离开都触发，需写在leaveFn
        this.leaveFn();
    },

    onUnload() { //为保证每次离开都触发，需写在leaveFn
        this.leaveFn();
    },

    methods: {
        leaveFn() { //onHide和onUnload只会触发一个，如果是onHide可能需要重置data属性

        },
    },

    components: {

    },
}

</script>
<style lang="scss" scoped>
@import '~css/public.scss';

.name {
    @include styleInit;
    /deep/ & {}
}

</style>

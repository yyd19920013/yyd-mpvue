<template>
    <div class="deptList">
        <deptFilter />
    </div>
</template>
<script>
import deptFilter from 'components/deptFilter';

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
        deptFilter,
    },
}

</script>
<style lang="scss" scoped>
@import '~css/public.scss';

.deptList {
    @include styleInit;
    /deep/ & {}
}

</style>

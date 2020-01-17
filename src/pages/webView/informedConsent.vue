<template>
    <div class="informedConsent">
        <web-view :src="src" />
    </div>
</template>
<script>
import { IHURL, ProductCode } from 'services';

export default {
    data() {
        return {
            src: `${IHURL}/index.html#/agreement?bCode=${ProductCode}`,
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

.informedConsent {
    @include styleInit;
    /deep/ & {}
}

</style>

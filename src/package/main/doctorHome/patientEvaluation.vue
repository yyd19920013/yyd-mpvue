<template>
    <div class="patientEvaluation">
        <evaluationList v-if="id" :id="id" />
    </div>
</template>
<script>
import evaluationList from 'components/evaluationList';

export default {
    data() {
        return {
            id: '',
        };
    },

    onShow() {
        this.getId();
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
        getId() {
            let { id, commentTotal } = this.$router.query;

            this.id = id;
            wx.setNavigationBarTitle({
                title: `患者评价（${commentTotal}）`,
            });
        },
    },

    components: {
        evaluationList,
    },
}

</script>
<style lang="scss" scoped>
@import '~css/public.scss';

.patientEvaluation {
    @include styleInit;
    /deep/ & {
        .evaluationList {
            height: 100vh;
        }
    }
}

</style>

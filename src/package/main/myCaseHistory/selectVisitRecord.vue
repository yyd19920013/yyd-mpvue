<template>
    <div class="selectVisitRecord">
        <div class="search">
            <div class="searchWrap">
                <div class="input">
                    <div class="inputWrap">
                        <input v-model.lazy="keyWord" placeholder="请输入要搜索的关键字" @input="inputChange($event)" />
                        <span v-if="keyWordText" class="close tap" @click="clearInput"></span>
                    </div>
                </div>
                <div class="cancel" @click="visitRecordListSelectVisitRecordFn">
                    取消
                </div>
            </div>
        </div>
        <visitRecordList />
    </div>
</template>
<script>
import vm from 'src/main';
import visitRecordList from 'components/visitRecordList';

export default {
    data() {
        return {
            keyWord: '',
            keyWordText: '',
        };
    },

    onLoad() {
        vm.$on('visitRecordListSelectVisitRecord', this.visitRecordListSelectVisitRecordFn);
    },

    onShow() {

    },

    onHide() { //为保证每次离开都触发，需写在leaveFn
        this.leaveFn();
    },

    onUnload() { //为保证每次离开都触发，需写在leaveFn
        vm.$off('visitRecordListSelectVisitRecord');
        this.leaveFn();
    },

    methods: {
        leaveFn() { //onHide和onUnload只会触发一个，如果是onHide可能需要重置data属性

        },
        visitRecordListSelectVisitRecordFn() {
            this.$router.back(1);
        },
        inputChange(ev) {
            let { value } = ev.target;

            this.keyWordText = value;
            vm.$emit('visitRecordListSetInnerParams', {
                keyWord: this.keyWordText,
            });
            vm.$emit('visitRecordListGetFilterList');
        },
        clearInput() {
            this.keyWord = '';
            this.keyWordText = '';
        },
    },

    components: {
        visitRecordList,
    },
}

</script>
<style lang="scss" scoped>
@import '~css/public.scss';

.selectVisitRecord {
    @include styleInit;
    /deep/ & {
        min-height: 100vh;
        background-color: $bg;
        .search {
            height: 80rpx;
            border-bottom: $border1;
            .searchWrap {
                width: 100%;
                padding: 10rpx 0;
                height: 80rpx;
                line-height: 60rpx;
                background-color: #fff;
                display: flex;
                position: fixed;
                left: 0;
                top: 0;
                z-index: 1000;
                .input {
                    flex: 1;
                    padding-left: $padding1;
                    .inputWrap {
                        width: 100%;
                        padding: 0 60rpx;
                        height: 100%;
                        background: $bg url('../../../images/icon/img_magnifyingGlass.png') no-repeat 20rpx center;
                        background-size: 30rpx;
                        border-radius: 34rpx;
                        position: relative;
                        input {
                            width: 100%;
                            height: 100%;
                        }
                        .close {
                            width: 60rpx;
                            height: 100%;
                            background: url('../../../images/icon/img_clear.png') no-repeat center center;
                            background-size: 30rpx;
                            position: absolute;
                            right: 0;
                            top: 0;
                        }
                    }
                }
                .cancel {
                    width: 120rpx;
                    text-align: center;
                }
            }
        }
        .visitRecordList {
            width: 100%;
            height: 100vh;
            position: absolute;
            left: 0;
            top: 0;
            border-top: 80rpx solid transparent;
            overflow: hidden;
        }
    }
}

</style>

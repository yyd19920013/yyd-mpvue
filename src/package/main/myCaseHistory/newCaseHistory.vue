<template>
    <div class="newCaseHistory">
        <div class="hint">
            请先完善就诊信息
        </div>
        <div class="wrap">
            <ul class="infoList">
                <li class="tap">
                    <div class="wrap">
                        <span>就诊时间</span>
                        <div class="rightContent">
                            <pickerWrap :title="' '" :mode="'date'" :value="date" :change="dChangeFn" />
                        </div>
                    </div>
                </li>
                <li class="tap">
                    <div class="wrap">
                        <span>就诊医院</span>
                    </div>
                </li>
                <li class="tap">
                    <div class="wrap">
                        <span>就诊科室</span>
                    </div>
                </li>
                <li class="tap">
                    <div class="wrap">
                        <span>就诊医生</span>
                    </div>
                </li>
                <li class="tap noArrow">
                    <div class="wrap">
                        <span>是否确诊</span>
                        <div class="rightContent">
                            <radio-group class="radioGroup" @change="radioChange">
                                <label v-for="(item,index) in [{value:'是'},{value:'否',checked:true}]" :key="index">
                                    <radio class="radio" :value="index" :checked="item.checked" color="#33adff" />
                                    <span>{{item.value}}</span>
                                </label>
                            </radio-group>
                        </div>
                    </div>
                </li>
                <li v-show="isConfirmed=='0'" class="tap">
                    <div class="wrap">
                        <span>诊断</span>
                    </div>
                </li>
            </ul>
            <div v-show="isConfirmed=='0'" class="clinicType">
                <span>就诊类型</span>
                <radio-group class="radioGroup" @change="radioChange2">
                    <label :class="{active:clinicType==index}" v-for="(item,index) in [{value:'初诊',checked:true},{value:'复诊'}]" :key="index" color="#33adff">
                        <radio class="radio" :value="index" :checked="item.checked" />
                        <span>{{item.value}}</span>
                    </label>
                </radio-group>
            </div>
        </div>
        <div class="buttonWrap">
            <button type="button">确定</button>
        </div>
    </div>
</template>
<script>
import pickerWrap from 'components/pickerWrap';

export default {
    data() {
        return {
            date: '',
            isConfirmed: '1',
            clinicType: '0',
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
        radioChange1(ev) {
            let { value } = ev.mp.detail;

            this.isConfirmed = value;
        },
        radioChange2(ev) {
            let { value } = ev.mp.detail;

            this.clinicType = value;
        },
        dChangeFn(changeArray) {
            let res = changeArray(this, 'date');

            console.log(res);
        },
    },

    components: {
        pickerWrap,
    },
}

</script>
<style lang="scss" scoped>
@import '~css/public.scss';

.newCaseHistory {
    @include styleInit;
    /deep/ & {
        min-height: 100vh;
        background-color: $bg;
        .hint {
            padding: 0 $padding1;
            height: 70rpx;
            line-height: 70rpx;
            font-size: 24rpx;
            background-color: $bg;
            color: #999;
        }
        .wrap {
            .infoList {
                @include infoList1('../../../');
            }
            .clinicType {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 0 $padding1;
                height: 100rpx;
                background-color: #fff;
                .radioGroup {
                    display: flex;
                    width: 200rpx;
                    height: 60rpx;
                    line-height: 60rpx;
                    text-align: center;
                    font-size: 24rpx;
                    border: 1px solid $main;
                    border-radius: $borderRadius1;
                    background-color: #fff;
                    color: $main;
                    label {
                        flex: 1;
                        border-radius: $borderRadius1;
                        &:first-of-type {
                            margin-left: -1px;
                        }
                        &:last-of-type {
                            margin-right: -1px;
                        }
                        .radio {
                            display: none;
                        }
                        &.active {
                            background-color: $main;
                            color: #fff;
                        }
                    }
                }
            }
        }
        .buttonWrap {
            @include buttonWrap;
        }
    }
}

</style>

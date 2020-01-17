<template>
    <div class="selectPatient">
        <div class="hint">
            通过实名认证的就诊人才可进行复诊配药
        </div>
        <div class="patientWrap">
            <ul class="patientList">
                <li v-for="(item,index) in patientList" :key="index" @click="clickFn(item,index)">
                    {{item.personName}}
                </li>
            </ul>
        </div>
        <div class="buttonWrap">
            <button type="button" @click="addPatient">+ 新增就诊人</button>
        </div>
    </div>
</template>
<script>
import vm from 'src/main';
import { wxToast } from 'js/yydjs';
import { getFamilyMemberList } from 'services';

export default {
    data() {
        return {
            patientList: [],
        };
    },

    onShow() {
        this.getFamilyMemberList();
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
        getFamilyMemberList() {
            getFamilyMemberList().then((res) => {
                if (res.body) {
                    this.patientList = res.body;
                }
            });
        },
        clickFn(item, index) {
            const { certified, mpiId } = item;
            if (!certified || certified == 0) {
                wxToast("当前就诊人未实名认证");
                setTimeout(() => {
                    wx.navigateTo({ url: `/package/userInfo/family/familyInfo?mpiId=${mpiId}` });
                }, 2000);
            } else {
                this.selectPatient(item, index);
            }
        },
        selectPatient(item, index) {
            let { mpiId, personName, sex, dob } = item;
            let query = Object.assign({}, this.$router.query, {
                mpiId,
                personName,
                sex,
                dob,
            });
            let { type } = query;

            vm.$emit('selectPatientClick', {
                item,
                index,
            });

            if (type == 'visit' || type == 'homeVisit') {
                this.$router.redirect({
                    path: '/package/main/myCaseHistory/myCaseHistory',
                    query,
                });
            } else {
                this.$router.back(1);
            }
        },
        addPatient() {
            this.$router.redirect('/package/userInfo/family/addFamily');
        },
    },

    components: {

    },
}

</script>
<style lang="scss" scoped>
@import '~css/public.scss';

.selectPatient {
    @include styleInit;
    /deep/ & {
        height: 100vh;
        background-color: $bg;
        .hint {
            @include hint;
        }
        .patientWrap {
            width: 100%;
            max-height: 100vh;
            border-top: 60rpx solid transparent;
            border-bottom: 200rpx solid transparent;
            overflow: hidden;
            overflow-y: auto;
            position: absolute;
            left: 0;
            top: 0;
        }
        .patientList {
            padding-left: $padding1;
            background-color: #fff;
            li {
                height: $height1;
                line-height: $height1;
                border-bottom: $border1;
                &:last-of-type {
                    border-bottom: none;
                }
            }
        }
        .buttonWrap {
            width: 100%;
            padding: 64rpx 0;
            height: 200rpx;
            text-align: center;
            position: fixed;
            left: 0;
            bottom: 0;
            button {
                width: 360rpx;
                height: 72rpx;
                font-size: 28rpx;
                border: 1px solid $main;
                border-radius: 36rpx;
                background-color: transparent;
                color: $main;
            }
        }
    }
}

</style>

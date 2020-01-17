<template>
    <div class="doctorDetail">
        <div class="doctorInfo">
            <imgWrap className="avatar" :auto="false" :src="detail.avatarFileId?viewImage+detail.avatarFileId:'img_head_doctor.png'" />
            <div class="rightContent">
                <h3>
                    <span class="span">{{detail.doctorName}}</span>
                    <span class="em">{{detail.doctorLevelText}}</span>
                </h3>
                <h4>
                    <span class="span">{{detail.orgFullName}}</span>
                    <span class="em">{{detail.deptName}}</span>
                </h4>
            </div>
        </div>
        <ul class="infoList">
            <li>
                <div class="title">
                    执业点
                </div>
                <div class="main">
                    <span class="span">{{detail.orgFullName}}</span>
                    <span class="em">{{detail.deptName}}</span>
                </div>
            </li>
            <li>
                <div class="title">
                    擅长
                </div>
                <div class="main">
                    {{detail.speciality || '暂无'}}
                </div>
            </li>
            <li class="last">
                <div class="title">
                    简介
                </div>
                <div class="main">
                    {{detail.introduce || '暂无'}}
                </div>
            </li>
        </ul>
    </div>
</template>
<script>
import imgWrap from 'components/imgWrap';
import { viewImage, getDoctorInfo } from 'services';

export default {
    data() {
        return {
            detail: {},

            viewImage,
        };
    },

    onShow() {
        this.getDoctorInfoFn();
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
        getDoctorInfoFn() {
            let { id } = this.$router.query;

            getDoctorInfo([id], (res) => {
                if (res.body) {
                    this.detail = res.body;
                }
            });
        },
    },

    components: {
        imgWrap,
    },
}

</script>
<style lang="scss" scoped>
@import '~css/public.scss';

.doctorDetail {
    @include styleInit;
    /deep/ & {
        .doctorInfo {
            @include doctorInfo('../../../');
            .rightContent {
                padding-right: 0;
                background: none;
            }
        }
        .infoList {
            padding: 0 $padding1;
            padding-left: $height1;
            li {
                padding-top: 60rpx;
                padding-left: 60rpx;
                border-left: 1px solid $blueBg;
                position: relative;
                &:before, &:after {
                    content: "";
                    border-radius: 50%;
                    position: absolute;
                }
                &:before {
                    width: 40rpx;
                    height: 40rpx;
                    background-color: $blueBg;
                    top: 60rpx;
                    left: -20rpx;
                }
                &:after {
                    width: 20rpx;
                    height: 20rpx;
                    background-color: $main;
                    top: 70rpx;
                    left: -10rpx;
                }
                .title {
                    line-height: 40rpx;
                }
                .main {
                    line-height: 40rpx;
                    font-size: 24rpx;
                    color: #999;
                    .span {
                        padding-right: 20rpx;
                    }
                }
            }
        }
    }
}

</style>

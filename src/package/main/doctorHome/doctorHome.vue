<template>
    <div class="doctorHome" :class="showSourceNumber ? 'no-scroll' :''">
        <div class="homeInfo">
            <div class="doctorInfo">
                <imgWrap className="avatar" :auto="false" :src="detail.avatarFileId?viewImage+detail.avatarFileId:'img_head_doctor.png'" />
                <navigator class="rightContent" :url="'/package/main/doctorHome/doctorDetail?id='+detail.id">
                    <h3>
                        <span class="span">{{detail.doctorName}}</span>
                        <span class="em">{{detail.doctorLevelText}}</span>
                    </h3>
                    <h4>
                        <span class="span">{{detail.orgFullName}}</span>
                        <span class="em">{{detail.deptName}}</span>
                    </h4>
                </navigator>
            </div>
            <ol class="count">
                <li>
                    <h3>{{detail.consultNum}}次</h3>
                    <h4>咨询人次</h4>
                </li>
                <li>
                    <h3>{{detail.avgScore}}分</h3>
                    <h4>咨询评分</h4>
                </li>
            </ol>
        </div>
        <div class="service">
            <div class="title">
                <span class="span">医生服务</span>
                <em class="em tap" @click="showNotice=true">须知</em>
            </div>
            <ul class="serviceList">
                <li v-for="(item,index) in detail.doctorOnlineItems" :key="index" @click="selectService(item)">
                    <div class="wrap" :style="{backgroundImage:'url('+itemCodeJson[item.itemCode].url+')'}">
                        <h3>
                            <span class="span">
                                {{itemCodeJson[item.itemCode].name}}
                                <span v-if="item.isRequirePlan==1&&(item.itemCode=='01'&&!docScheduleItem1.id||item.itemCode=='02'&&!docScheduleItem2.id||item.itemCode=='04'&&!docScheduleItem3.id)" class="i">(暂无排班)</span>
                            </span>
                            <span v-if="item.isRequirePlan==0||(item.itemCode=='01'&&docScheduleItem1.id||item.itemCode=='02'&&docScheduleItem2.id||item.itemCode=='04'&&docScheduleItem3.id)" class="em">{{item.price}}元/次</span>
                        </h3>
                        <h4>
                            <span class="span">{{itemCodeJson[item.itemCode].desc}}</span>
                            <span class="em">{{itemCodeJson[item.itemCode].desc1}}</span>
                        </h4>
                        <template v-if="item.isRequirePlan==1">
                            <h5 v-if="item.itemCode=='01'&&docScheduleItem1.id||item.itemCode=='02'&&docScheduleItem2.id||item.itemCode=='04'&&docScheduleItem3.id" class="tap">
                                <span>最近可预约时间：</span>
                                <template v-if="item.itemCode=='01'&&docScheduleItem1.id">
                                    <span>{{docScheduleItem1.formatWorkDate}}</span>
                                    <span>{{docScheduleItem1.formatWeekDay}}</span>
                                    <span>{{docScheduleItem1.formatStartTime}}-{{docScheduleItem1.formatEndTime}}</span>
                                </template>
                                <template v-else-if="item.itemCode=='02'&&docScheduleItem2.id">
                                    <span>{{docScheduleItem2.formatWorkDate}}</span>
                                    <span>{{docScheduleItem2.formatWeekDay}}</span>
                                    <span>{{docScheduleItem2.formatStartTime}}-{{docScheduleItem2.formatEndTime}}</span>
                                </template>
                                <template v-else-if="item.itemCode=='04'&&docScheduleItem3.id">
                                    <span>{{docScheduleItem3.formatWorkDate}}</span>
                                    <span>{{docScheduleItem3.formatWeekDay}}</span>
                                    <span>{{docScheduleItem3.formatStartTime}}-{{docScheduleItem3.formatEndTime}}</span>
                                </template>
                            </h5>
                        </template>
                    </div>
                </li>
            </ul>
        </div>
        <div class="evaluate">
            <navigator class="title" :url="'/package/main/doctorHome/patientEvaluation?id='+detail.id+'&commentTotal='+detail.commentTotal">
                <span>患者评价（{{detail.commentTotal}}）</span>
            </navigator>
            <div v-if="detail.commentTags.length" class="main">
                <span v-for="(item,index) in detail.commentTags" :key="index">{{item.tagCodeText}} {{item.tagNum}}</span>
            </div>
        </div>
        <evaluationList v-if="id" :id="id" :isLoadOnce="true" />
        <van-dialog class="noticeDialog" use-slot :title="notice.title" :show="showNotice" @close="showNotice=false" confirmButtonText="知道了">
            <div class="wrap">
                {{notice.value}}
            </div>
        </van-dialog>
        <template v-if="id">
            <selectSourceNumber :show.sync="showSourceNumber1" :doctorOnlineExtraId="id" itemCode="01" @selectTime="selectTime" />
            <selectSourceNumber :show.sync="showSourceNumber2" :doctorOnlineExtraId="id" itemCode="02" @selectTime="selectTime" />
            <selectSourceNumber :show.sync="showSourceNumber3" :doctorOnlineExtraId="id" itemCode="04" @selectTime="selectTime" />
        </template>
    </div>
</template>
<script>
import imgWrap from 'components/imgWrap';
import selectSourceNumber from 'components/selectSourceNumber';
import evaluationList from 'components/evaluationList';
import { copyJson, dateFormat0, getWeekName, wxToast } from 'js/yydjs';
import { viewImage, getIhDoctorInfo, getDocScheduleList, getSetting } from 'services';
import { mapActions } from 'vuex';

export default {
    data() {
        return {
            showNotice: false,
            showSourceNumber1: false,
            showSourceNumber2: false,
            showSourceNumber3: false,
            detail: {
                doctorOnlineItems: [],
                commentTags: [],
            },
            docScheduleItem1: {},
            docScheduleItem2: {},
            docScheduleItem3: {},
            notice: {},
            id: '',
            serviceItem: {},

            itemCodeJson: {
                '01': {
                    url: require('images/icon/ic_wenzhen_img.png'),
                    name: '图文咨询',
                    desc: '使用图文、语音与医生沟通',
                    showName: 'showSourceNumber1',
                    scheduleName: 'docScheduleItem1',
                },
                '02': {
                    url: require('images/icon/ic_wenzhen_video.png'),
                    name: '视频咨询',
                    desc: '预约时间与医生进行视频咨询',
                    showName: 'showSourceNumber2',
                    scheduleName: 'docScheduleItem2',
                },
                '04': {
                    url: require('images/icon/ic_wenzhen_fzpy.png'),
                    name: '复诊配药',
                    desc: '复诊患者在线咨询配药，送药到家',
                    desc1: '（仅为诊疗费，不包含药费）',
                    showName: 'showSourceNumber3',
                    scheduleName: 'docScheduleItem3',
                },
            },
            viewImage,
        };
    },
    computed: {
        showSourceNumber() {
            return this.showSourceNumber1 || this.showSourceNumber2 || this.showSourceNumber3;
        },
    },
    onShow() {
        this.getIhDoctorInfoFn();
        this.getSettingFn();
    },

    onHide() { //为保证每次离开都触发，需写在leaveFn
        this.leaveFn();
    },

    onUnload() { //为保证每次离开都触发，需写在leaveFn
        this.leaveFn();
    },

    methods: {
        ...mapActions('userInfo', [
            'needLoginAndImproveInfo'
        ]),
        leaveFn() { //onHide和onUnload只会触发一个，如果是onHide可能需要重置data属性

        },
        getIhDoctorInfoFn() {
            let { id } = this.$router.query;

            this.id = id;
            getIhDoctorInfo([+id, 0, 0], (res) => {
                if (res.body) {
                    this.detail = res.body;
                }
            });
        },
        getSettingFn() {
            getSetting(['04'], (res) => {
                if (res.body) {
                    this.notice = res.body;
                }
            });
        },
        selectService(item) {
            var self = this;
            this.needLoginAndImproveInfo().then(() => {
                let { docScheduleItem1, docScheduleItem2, docScheduleItem3 } = self;
                let { itemCode, isRequirePlan } = item;
                let key = self.itemCodeJson[itemCode];
                let { scheduleName, showName } = key;
                let haveData = item.itemCode == '01' && docScheduleItem1.id || item.itemCode == '02' && docScheduleItem2.id || item.itemCode == '04' && docScheduleItem3.id;

                self.serviceItem = item;
                if (isRequirePlan == 1) {
                    if (haveData) {
                        self[showName] = true;
                    } else {
                        wxToast('暂无排班');
                    }
                } else {
                    if (itemCode != '04') {
                        self.toAddInfo({});
                    } else {
                        self.toAddInfoVisit({});
                    }
                }
            });
        },
        selectTime(params) {
            let { isFirst, itemCode, item } = params;
            let key = this.itemCodeJson[itemCode];
            let { scheduleName, showName } = key;

            this[scheduleName] = item;
            if (!isFirst) {
                this[showName] = false;
                if (itemCode != '04') {
                    this.toAddInfo(item);
                } else {
                    this.toAddInfoVisit(item);
                }
            }
        },
        toAddInfo(item) {
            let { id, doctorName, doctorId, deptName, deptId, orgId } = this.detail;
            let { doctorOnlineExtraId, itemCode, price } = this.serviceItem;
            let { id: docScheduleId = '', fullStartTime: startTime = '', fullEndTime: endTime = '', formatWorkDate = '', formatWeekDay = '', formatStartTime = '', formatEndTime = '' } = item;
            if (!startTime) docScheduleId = '';
            let query = {
                id,
                itemCode,
                doctorName,
                doctorId,
                deptName,
                deptId,
                orgId,
                doctorOnlineExtraId,
                price,
                docScheduleId,
                startTime,
                endTime,
                formatWorkDate,
                formatWeekDay,
                formatStartTime,
                formatEndTime,
            };

            this.$router.navigate({
                path: '/package/main/doctorHome/addInfo',
                query,
            });
        },
        toAddInfoVisit(item) {
            let { orgId, orgFullName, standardDeptId, standardDeptName: revisitDeptName, goodsId, doctorName: revisitDoctorName } = this.detail;
            let { doctorOnlineExtraId, price, itemCodeText: goodsName } = this.serviceItem;
            let { id: docScheduleId = '', fullStartTime: scheduleStartTime = '', fullEndTime: scheduleEndTime = '', formatWorkDate = '', formatWeekDay = '', formatStartTime = '', formatEndTime = '' } = item;
            if (!scheduleStartTime) docScheduleId = '';
            let query = {
                type: 'visit',
                orgId,
                orgFullName,
                standardDeptId,
                goodsId,
                goodsName,
                doctorOnlineExtraId,
                price,
                revisitDoctorName,
                revisitDeptName,
                docScheduleId,
                scheduleStartTime,
                scheduleEndTime,
                formatWorkDate,
                formatWeekDay,
                formatStartTime,
                formatEndTime,
            };

            this.$router.navigate({
                path: '/package/main/doctorHome/selectPatient',
                query,
            });
        },
    },

    components: {
        imgWrap,
        selectSourceNumber,
        evaluationList,
    },
}

</script>
<style lang="scss" scoped>
@import '~css/public.scss';

.doctorHome {
    @include styleInit;
    &.no-scroll {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
    }
    /deep/ & {
        min-height: 100vh;
        background-color: $bg;
        .homeInfo {
            max-height: 290rpx;
            background-color: $main;
            position: relative;
            margin-bottom: 20rpx;
            overflow: hidden;
            .doctorInfo {
                @include doctorInfo('../../../');
            }
            .count {
                display: flex;
                padding: 20rpx 0;
                height: 110rpx;
                background-color: rgba(0, 0, 0, .2);
                color: #fff;
                li {
                    flex: 1;
                    text-align: center;
                    border-right: 1px solid #fff;
                    &:last-of-type {
                        border-color: transparent;
                    }
                    h3 {
                        font-size: 32rpx;
                    }
                    h4 {
                        font-size: 24rpx;
                    }
                }
            }
        }
        .service {
            background-color: #fff;
            .title {
                display: flex;
                justify-content: space-between;
                padding: 0 $padding1;
                height: $height1;
                line-height: $height1;
                border-bottom: $border1;
                .span {
                    color: #999;
                }
                .em {
                    color: $main;
                }
            }
            .serviceList {
                margin-bottom: 20rpx;
                li {
                    padding: $padding1;
                    border-bottom: $border1;
                    .wrap {
                        padding-left: 110rpx;
                        background: no-repeat left top;
                        background-size: 80rpx;
                        line-height: 40rpx;
                        h3 {
                            display: flex;
                            justify-content: space-between;
                            font-size: 32rpx;
                            .i {
                                font-size: 24rpx;
                                color: #999;
                            }
                            .em {
                                color: $orange;
                            }
                        }
                        h4 {
                            @include multiLine1;
                            font-size: 24rpx;
                            color: #999;
                        }
                        h5 {
                            display: inline-block;
                            padding: 0 5rpx;
                            height: 36rpx;
                            line-height: 34rpx;
                            font-size: 24rpx;
                            border: 1px solid $main;
                            color: $main;
                            border-radius: 4rpx;
                            span {
                                padding-right: 10rpx;
                                &:last-of-type {
                                    padding-right: 0;
                                }
                            }
                        }
                    }
                }
            }
        }
        .evaluate {
            background-color: #fff;
            .title {
                padding: 0 $padding1;
                height: $height1;
                line-height: $height1;
                border-bottom: $border1;
                span {
                    display: block;
                    background: url('../../../images/icon/ic_file_more.png') no-repeat right center;
                    background-size: 12rpx;
                    color: #999;
                }
            }
            .main {
                @include labelList;
                border-bottom: $border1;
                padding: $padding1;
                padding-bottom: 10rpx;
            }
        }
        .noticeDialog {
            .wrap {
                padding: $padding1;
                color: #999;
            }
        }
        .startTimePopup {
            .wrap {
                .title {
                    height: $height1;
                    line-height: $height1;
                    text-align: center;
                    border-bottom: $border1;
                    position: relative;
                    .cancel {
                        width: 100rpx;
                        color: #999;
                        position: absolute;
                        left: 0;
                        top: 0;
                    }
                    h3 {
                        padding: 0 100rpx;
                    }
                }
                .timeList {
                    padding: 22rpx 74rpx;
                    height: 50vh;
                    overflow: hidden;
                    overflow-y: auto;
                    li {
                        padding: 22rpx 0;
                        .time {
                            height: 66rpx;
                            line-height: 66rpx;
                            text-align: center;
                            background-color: $bg;
                            color: #666;
                            border: $border1;
                            border-radius: 33rpx;
                            span {
                                padding-right: 10rpx;
                                &:last-of-type {
                                    padding-right: 0;
                                }
                            }
                        }
                        &.active {
                            .time {
                                border-color: $main;
                                background-color: $blueBg;
                                color: $main;
                            }
                        }
                    }
                }
            }
        }
    }
}

</style>

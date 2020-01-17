<template>
    <div class="imOrderDetail">
        <template v-if="orderId">
            <div class="statusBar">
                <div class="statusBarWrap">
                    <template v-if="itemCode!='04'">
                        <div class="status" :style="{color:orderStatusColor}">
                            {{orderDetail.conStatusText}}
                        </div>
                        <div class="rightContent">
                            <div v-if="orderDetail.conStatus=='11'&&showHint" class="conStatus conStatus1">
                                <span class="span">{{formatTimeEnd}}</span>
                                <span class="em">内未支付，咨询自动取消</span>
                            </div>
                            <div v-else-if="orderDetail.docScheduleId&&(orderDetail.conStatus=='50'||orderDetail.conStatus=='51')" class="conStatus conStatus2">
                                <span class="span">预约时间：{{orderDetail.formatTime1}} {{orderDetail.formatTime2}}</span>
                                <span class="em">{{orderDetail.formatTime3}}</span>
                            </div>
                            <div v-else-if="orderDetail.conStatus=='52'" class="conStatus conStatus3">
                                <span class="span">{{formatTimeEnd1}}</span>
                                <span class="em">后咨询结束</span>
                            </div>
                            <div v-else-if="orderDetail.conStatus=='53'" class="conStatus conStatus4">
                                <span v-if="orderDetail.commentStatus=='0'" @click="toEvaluation">去评价</span>
                                <div v-else class="starWrap" @click="toEvaluation">
                                    <i v-for="(item,index) in 5" :key="index" :class="{active:orderDetail.score>index}"></i>
                                </div>
                            </div>
                            <div v-else-if="orderDetail.conStatus=='15'" class="conStatus conStatus5">
                                咨询超时未支付
                            </div>
                            <div v-else-if="(orderDetail.conStatus=='12'||orderDetail.conStatus=='45')&&(orderDetail.payStatus=='11'||orderDetail.payStatus=='12')" class="conStatus conStatus6">
                                患者主动取消
                            </div>
                            <div v-else-if="(orderDetail.conStatus=='12'||orderDetail.conStatus=='45')&&orderDetail.payStatus=='13'" class="conStatus conStatus7">
                                费用将在3个工作日内退还
                            </div>
                        </div>
                    </template>
                    <template v-else>
                        <div class="status" :style="{color:orderStatusColor}">
                            {{orderDetail.orderStatusText}}
                        </div>
                        <div class="rightContent">
                            <div v-if="orderDetail.orderStatus=='11'&&showHint" class="revist revist1">
                                <span class="span">{{formatTimeEnd}}</span>
                                <span class="em">内未支付，复诊自动取消</span>
                            </div>
                            <div v-else-if="orderDetail.docScheduleId&&orderDetail.orderStatus=='01'" class="revist revist2">
                                <span class="span">预约时间：{{orderDetail.formatTime1}} {{orderDetail.formatTime2}}</span>
                                <span class="em">{{orderDetail.formatTime3}}</span>
                            </div>
                            <div v-else-if="orderDetail.orderStatus=='02'" class="revist revist3">
                                <span class="span">{{formatTimeEnd1}}</span>
                                <span class="em">后复诊结束</span>
                            </div>
                            <div v-else-if="orderDetail.orderStatus=='05'" class="revist revist4">
                                <span v-if="orderDetail.commentStatus=='0'" @click="toEvaluation">去评价</span>
                                <div v-else class="starWrap" @click="toEvaluation">
                                    <i v-for="(item,index) in 5" :key="index" :class="{active:orderDetail.score>index}"></i>
                                </div>
                            </div>
                            <div v-else-if="orderDetail.orderStatus=='03'&&orderDetail.payStatus=='15'" class="revist revist5">
                                复诊超时未支付
                            </div>
                            <div v-else-if="orderDetail.orderStatus=='03'&&(orderDetail.payStatus=='11'||orderDetail.payStatus=='12')" class="revist revist6">
                                患者主动取消
                            </div>
                            <div v-else-if="orderDetail.orderStatus=='03'&&orderDetail.payStatus=='13'" class="revist revist7">
                                费用将在3个工作日内退还
                            </div>
                        </div>
                    </template>
                    <div v-if="orderDetail.conStatus=='50'||orderDetail.orderStatus=='01'" class="diagnosisTimeWrap">
                        <div class="diagnosisTime">
                            {{orderDetail.formatTime4}}前未接诊将自动退款
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="(orderDetail.conStatus=='11'||orderDetail.conStatus=='15'||orderDetail.conStatus=='15')||(orderDetail.orderStatus=='11'||orderDetail.orderStatus=='03'&&orderDetail.payStatus=='15')" class="footer">
                <div class="footerWrap">
                    <div class="leftContent">
                        <h3>{{itemCodeTextJson[itemCode]}}：</h3>
                        <h4>￥{{needPayAmountFormat}}</h4>
                    </div>
                    <div class="buttonWrap">
                        <template v-if="orderDetail.conStatus=='11'||orderDetail.orderStatus=='11'">
                            <button class="cancel" type="button" @click="cancel">取消订单</button>
                            <button class="pay" type="button" @click="pay">立即支付</button>
                        </template>
                        <button v-else class="reorder" type="button" @click="reorder">重新下单</button>
                    </div>
                </div>
            </div>
        </template>
        <template v-else>
            <div v-if="!showVideoCall" class="bootPage">
                <div class="main">
                    <imgWrap className="logo" src="common/ic_logo.png" />
                    <div class="title">佛山南海区人民医院</div>
                </div>
                <div class="end">
                    承建单位：创业慧康科技股份有限公司
                </div>
            </div>
        </template>
        <div class="messageWrap">
            <imOrderChat v-if="showIM" :itemCode="itemCode" :orderDetail="orderDetail" />
            <imOrderVideoCall :orderDetail="orderDetail" />
        </div>
    </div>
</template>
<script>
import vm from 'src/main';
import nimInit from './components/NIM/nimInit';
import imOrderChat from './imOrderChat';
import imOrderVideoCall from './imOrderVideoCall';
import imgWrap from './components/imgWrap';
import { lStore, copyJson, normalDate, secondFormat0, dateFormat0, getWeekName, toFixed0, fileType, wxToast } from './js/yydjs';
import { getAccessToken, getIMToken, getOrderDetail, getRevisitOrderDetail, oCancelConsult, oCancelRevisit, getOrder } from './services';

export default {
    data() {
        return {
            timer: null,
            timer1: null,
            timeEnd: 0,
            timeEnd1: 0,
            formatTimeEnd: '00:00',
            formatTimeEnd1: '00:00',
            showHint: false,
            showHint1: false,
            orderDetail: {},
            orderId: '',
            showIM: false,
            showVideoCall: false,
            needPayAmount: '',

            itemCodeTextJson: {
                '01': '图文咨询',
                '02': '视频咨询',
                '04': '复诊配药',
            },
            consultOrderStatus: {
                '11': {
                    code: '11',
                    text: '待付款',
                    color: '#ff7043',
                },
                '50': {
                    code: '50',
                    text: '待接诊',
                    color: '#33adff',
                },
                '51': {
                    code: '51',
                    text: '未开始',
                    color: '#33adff',
                },
                '52': {
                    code: '52',
                    text: '进行中',
                    color: '#33adff',
                },
                '53': {
                    code: '53',
                    text: '已完成',
                    color: '#333',
                },
                '57': {
                    code: '57',
                    text: '已完成',
                    color: '#333',
                },
                '12': {
                    code: '12',
                    text: '已取消',
                    color: '#999',
                },
                '15': {
                    code: '15',
                    text: '支付超时',
                    color: '#999',
                },
            },
            revistOrderStatus: {
                '11': {
                    code: '11',
                    text: '待付款',
                },
                '01': {
                    code: '01',
                    text: '待接诊',
                },
                '02': {
                    code: '02',
                    text: '复诊中',
                },
                '05': {
                    code: '05',
                    text: '已完成',
                },
                '03': {
                    code: '03',
                    text: '已取消',
                },
            },
            getOrderDetail,
            getRevisitOrderDetail,
            oCancelConsult,
            oCancelRevisit,
        };
    },

    computed: {
        itemCode() {
            let { orderDetail } = this;
            let itemCode = (orderDetail.orderDetailId ? orderDetail.itemCode : '04') || '';

            return itemCode;
        },
        orderStatusColor() {
            let { consultOrderStatus, orderDetail = {} } = this;
            let { conStatus, orderStatus, refundStatus } = orderDetail;
            let { color = '#999' } = consultOrderStatus[conStatus] || {};

            switch (orderStatus) {
                case '11':
                    color = '#ff7043';
                    break;
                case '01':
                    color = '#33adff';
                    break;
                case '02':
                    color = '#33adff';
                    break;
                case '05':
                    color = '#333';
                    break;
                case '03':
                    color = '#999';
                    break;
            }
            switch (refundStatus) {
                case '42':
                    color = '#ff7043';
                    break;
                case '46':
                    color = '#33adff';
                    break;
            }
            return color;
        },
        needPayAmountFormat() {
            let { needPayAmount = 0 } = this;

            return toFixed0(needPayAmount, 2, true);
        },
    },

    onLoad() {
        vm.$on('nimOnConnect', this.nimOnConnectFn);
        vm.$on('orderDetailNeedRefresh', this.orderDetailRefresh);
    },

    onShow() {
        this.getIMTokenFn();
    },

    onHide() { //为保证每次离开都触发，需写在leaveFn
        this.leaveFn();
    },

    onUnload() { //为保证每次离开都触发，需写在leaveFn
        vm.$off('nimOnConnect', this.nimOnConnectFn);
        vm.$off('orderDetailNeedRefresh', this.orderDetailRefresh);
        clearInterval(this.timer);
        clearInterval(this.timer1);
        this.leaveFn();
    },

    methods: {
        leaveFn() { //onHide和onUnload只会触发一个，如果是onHide可能需要重置data属性

        },
        nimOnConnectFn() {
            if (lStore.get('isConnected')) {
                this.showIM = true;
            }
        },
        getIMTokenFn() {
            let accessToken = getAccessToken();
            let { orderDetailId, revisitId, showVideoCall, back } = this.$router.query;
            let orderId = orderDetailId || revisitId;

            this.orderId = orderId;
            this.showVideoCall = +showVideoCall;
            const doneFn = () => {
                if (orderId) {
                    this.getOrderDetailFn();
                } else {
                    if (showVideoCall) {
                        wx.setNavigationBarTitle({
                            title: '视频通话',
                        });
                    } else {
                        if (back == '1') {
                            this.$router.back(1);
                        } else {
                            this.$router.switch('/pages/home/index');
                        }
                    }
                }
            };

            if (accessToken) {
                getIMToken([], null, (res) => {
                    let { data = {} } = res || {};

                    if (data) {
                        if (data.code == 200) {
                            if (data.body) {
                                let { accId, token } = data.body;

                                lStore.set('nimAccount', accId);
                                lStore.set('nimToken', token);
                                nimInit(null, null, doneFn);
                            }
                        } else {
                            doneFn();
                        }
                    } else {
                        doneFn();
                    }

                });
            } else {
                doneFn();
            }
        },
        getOrderDetailFn(refresh = false, noUpdate = false) {
            if (this.orderDetail.orderNo && !refresh) {
                let { doctorName } = this.orderDetail;

                wx.setNavigationBarTitle({
                    title: doctorName,
                });
                return;
            }
            let { orderDetailId, revisitId } = this.$router.query;
            let orderId = orderDetailId || revisitId;
            let api = orderDetailId ? 'getOrderDetail' : 'getRevisitOrderDetail';

            this.orderId = orderId;
            if (!orderId) return;
            this[api]([orderId], (res) => {
                if (res.body) {
                    let orderDetail = res.body;
                    let { doctorAccId, startTime, endTime, consutleEndAt, scheduleStartTime, scheduleEndTime, endDt, doctorName } = orderDetail;

                    wx.setNavigationBarTitle({
                        title: doctorName,
                    });
                    if (api == 'getOrderDetail') {
                        orderDetail.formatTime1 = dateFormat0(startTime, 'MM月dd日');
                        orderDetail.formatTime2 = getWeekName(startTime, '周');
                        orderDetail.formatTime3 = startTime && endTime ? dateFormat0(startTime, 'hh:mm') + '-' + dateFormat0(endTime, 'hh:mm') : '';
                        orderDetail.formatTime4 = dateFormat0(endTime, 'MM月dd日hh:mm');
                    } else {
                        orderDetail.formatTime1 = dateFormat0(scheduleStartTime, 'MM月dd日');
                        orderDetail.formatTime2 = getWeekName(scheduleStartTime, '周');
                        orderDetail.formatTime3 = scheduleStartTime && scheduleEndTime ? dateFormat0(scheduleStartTime, 'hh:mm') + '-' + dateFormat0(scheduleEndTime, 'hh:mm') : '';
                        orderDetail.formatTime4 = dateFormat0(scheduleEndTime, 'MM月dd日hh:mm');
                    }
                    this.orderDetail = orderDetail;
                    this.countDownFn();
                    this.countDownFn1();

                    lStore.set('nimChat', {
                        scene: 'p2p',
                        to: doctorAccId,
                    });
                    this.nimOnConnectFn();
                    if (!noUpdate) {
                        this.getOrderFn();
                        setTimeout(() => {
                            vm.$emit('componentsUpdate', 'imOrderChat');
                        }, 300);
                    }

                }
            });
        },
        getOrderFn() {
            if (this.needPayAmount || this.needPayAmount === 0) return;
            let { orderNo } = this.orderDetail;

            getOrder([orderNo], (res) => {
                if (res.body) {
                    let { needPayAmount } = res.body;

                    this.needPayAmount = needPayAmount;
                }
            });
        },
        orderDetailRefresh() {
            this.getOrderDetailFn(true, true);
        },
        countDownFn() {
            let { createDt, createAt } = this.orderDetail;
            let timeEnd = createDt || createAt;

            timeEnd = Math.floor((normalDate(timeEnd) - new Date() + 60 * 15 * 1000) / 1000) || 0;
            this.timeEnd = timeEnd < 0 ? 0 : timeEnd;
            this.formatTimeEnd = secondFormat0(this.timeEnd, 'mm:ss');
            if (this.timeEnd > 0) {
                this.showHint = true;
            }
            clearInterval(this.timer);
            this.timer = setInterval(() => {
                this.timeEnd--;
                this.formatTimeEnd = secondFormat0(this.timeEnd, 'mm:ss');
                if (this.timeEnd <= 0) {
                    this.timeEnd = 0;
                    this.formatTimeEnd = '00:00';
                    clearInterval(this.timer);
                    if (this.showHint) {
                        this.getOrderDetailFn(true, true);
                    }
                    this.showHint = false;
                }
            }, 1000);
        },
        countDownFn1() {
            let { consutleEndAt, endDt } = this.orderDetail;
            let timeEnd1 = consutleEndAt || endDt;

            timeEnd1 = Math.floor((normalDate(timeEnd1) - new Date()) / 1000) || 0;
            this.timeEnd1 = timeEnd1 < 0 ? 0 : timeEnd1;
            this.formatTimeEnd1 = secondFormat0(this.timeEnd1, 'hh小时mm分');
            if (this.timeEnd1 > 0) {
                this.showHint1 = true;
            }
            clearInterval(this.timer1);
            this.timer1 = setInterval(() => {
                this.timeEnd1 -= 5;
                this.formatTimeEnd1 = secondFormat0(this.timeEnd1, 'hh小时mm分');
                if (this.timeEnd1 <= 0) {
                    this.timeEnd1 = 0;
                    this.formatTimeEnd1 = '00:00';
                    clearInterval(this.timer1);
                    if (this.showHint1) {
                        this.getOrderDetailFn(true, true);
                    }
                    this.showHint1 = false;
                }
            }, 5000);
        },
        toEvaluation() {
            let { orderDetailId = '', revisitId = '' } = this.orderDetail;

            this.$router.navigate({
                path: '/package/main/evaluation/evaluation',
                query: {
                    orderDetailId,
                    revisitId,
                },
            });
        },
        cancel() {
            wx.showModal({
                title: '提示',
                content: '是否确定取消订单？',
                success: (res) => {
                    if (res.confirm) {
                        let { orderNo, itemCode = '', orderDetailId, revisitId } = this.orderDetail;
                        let api = orderDetailId ? 'oCancelConsult' : 'oCancelRevisit';
                        let params1 = [{
                            orderDetailId,
                            itemCode,
                            userType: '11',
                        }];
                        let params2 = [{
                            revisitId, //必传（数值类型）复诊订单主键
                            userType: '11', //必传，用户类型 10 医生 11 患者
                        }];
                        let params = orderDetailId ? params1 : params2;

                        this[api](params, (res) => {
                            wxToast('取消订单成功');
                            this.getOrderDetailFn(true);
                        });
                    } else if (res.cancel) {

                    }
                }
            });
        },
        pay() {
            let { orderDetailId = '', revisitId = '', orderNo } = this.orderDetail;
            let query = {
                orderDetailId,
                revisitId,
                orderNo,
            };

            this.$router.redirect({
                path: '/package/main/payment/payment',
                query,
            });
            this.orderDetail.orderNo = '';
        },
        reorder() {
            let { doctorOnlineExtraId: id } = this.orderDetail;

            this.$router.navigate({
                path: '/package/main/doctorHome/doctorHome',
                query: {
                    id,
                },
            });
        },
    },

    components: {
        imOrderChat,
        imOrderVideoCall,
        imgWrap,
    },
}

</script>
<style lang="scss" scoped>
@import '~css/public.scss';

.imOrderDetail {
    @include styleInit;
    /deep/ & {
        .statusBar {
            height: $height1;
            .statusBarWrap {
                display: flex;
                justify-content: space-between;
                width: 100%;
                padding: 0 $padding1;
                height: $height1;
                line-height: $height1;
                background-color: #fff;
                position: fixed;
                left: 0;
                top: 0;
                z-index: 1000;
                .status {
                    width: 180rpx;
                }
                .rightContent {
                    flex: 1;
                    font-size: 24rpx;
                    .conStatus, .revist {
                        display: flex;
                        justify-content: flex-end;
                        align-items: center;
                        height: 100%;
                        .starWrap {
                            @include starWrap('../../../');
                        }
                    }
                    .conStatus1, .conStatus3, .revist1, .revist3 {
                        .span {
                            color: $orange;
                        }
                        .em {
                            color: #666;
                        }
                    }
                    .conStatus2, .revist2 {
                        .span {
                            color: #666;
                        }
                        .em {
                            padding-left: 10rpx;
                            color: $orange;
                        }
                    }
                    .conStatus4, .revist4 {
                        span {
                            width: 180rpx;
                            height: 60rpx;
                            line-height: 58rpx;
                            text-align: center;
                            color: $main;
                            border: 1px solid $main;
                            border-radius: 30rpx;
                        }
                    }
                }
                .diagnosisTimeWrap {
                    width: 100%;
                    padding: 10rpx 80rpx;
                    background-color: $bg;
                    position: absolute;
                    left: 0;
                    top: $height1;
                    .diagnosisTime {
                        padding: 10rpx 20rpx;
                        line-height: 40rpx;
                        text-align: center;
                        font-size: 24rpx;
                        background-color: #dcdcdc;
                        color: #999;
                        border-radius: $borderRadius1;
                    }
                }
            }
        }
        >.footer {
            @include footer;
        }
        .bootPage {
            height: 100vh;
            text-align: center;
            background-color: #fff;
            position: relative;
            z-index: 10;
            .main {
                padding-top: 15vh;
                .logo {
                    width: 200rpx;
                }
                .title {
                    line-height: 100rpx;
                    font-size: 42rpx;
                    color: $main;
                }
            }
            .end {
                width: 100%;
                line-height: 60rpx;
                font-size: 20rpx;
                color: #666;
                position: absolute;
                left: 0;
                bottom: 5vh;
            }
        }
    }
}

</style>

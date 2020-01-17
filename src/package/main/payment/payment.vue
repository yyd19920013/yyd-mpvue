<template>
    <div class="payment">
        <van-nav-bar title="支付方式">
            <view slot="left" class="back" @click="buttonClickBack">
                <van-icon custom-style="font-size: 42rpx; font-weight: bold; margin-left: -22rpx;" name="arrow-left" size="20px" />
            </view>
        </van-nav-bar>
        <div v-if="showHint" class="hint">
            支付剩余时间：{{formatTimeEnd}}
        </div>
        <div class="goodsInfo">
            <imgWrap className="goodsIcon" :src="goodsIcon" auto="false" />
            <div class="rightContent">
                <div class="left">
                    <h3>{{orderDetail.doctorName||orderDetail.storeName}}</h3>
                    <h4>{{itemCodeJson[itemCode]}}</h4>
                </div>
                <div class="right">
                    ￥{{needPayAmountFormat}}
                </div>
            </div>
        </div>
        <div class="footer">
            <div class="footerWrap">
                <div class="leftContent">
                    <h3>实际支付</h3>
                    <h4>￥{{needPayAmountFormat}}</h4>
                </div>
                <div class="buttonWrap">
                    <button class="pay" type="button" @click="payFn">{{orderDetail.needPayAmount>0?'确认支付':'确认订单'}}</button>
                </div>
            </div>
        </div>
        <div v-if="itemCode!='05'&&needSubscribe1&&!hideSubscribeMask1" class="subscribeMask subscribeMask1" @click="subscribe1"></div>
        <div v-if="itemCode=='05'&&!hideSubscribeMask2" class="subscribeMask subscribeMask2" @click="subscribe2"></div>
    </div>
</template>
<script>
import imgWrap from 'components/imgWrap';
import { normalDate, secondFormat0, toFixed0, wxToast, wxSubscribe1, wxSubscribe2 } from 'js/yydjs';
import { getOrder, appletPayOrder, notifyPayResult } from 'services';

export default {
    data() {
        return {
            hideSubscribeMask1: false,
            hideSubscribeMask2: false,
            timer: null,
            timer1: null,
            timer2: null,
            timeEnd: 0,
            formatTimeEnd: '00:00',
            delayQuery: 2000,
            queryInterval: 1500,
            maxQueryCount: 5,
            queryCount: 0,
            showHint: false,
            orderDetail: {},
            params: {
                orderNo: '', //必传，订单号orderNo
                payAmount: '', //必传，支付金额
                payChannel: '03', //必传，支付渠道：02支付宝 03微信
                voucherNo: '', //问诊卷码编号
                goodsCategory: '', //必传，商品分类：30图文问诊 40视频问诊 70复诊 80处方
                flag: true, //是否是健保付,布尔类型
                // orderInvoice: {
                //     invoiceType: 1, //发票类型：1电子发票、2纸质发票,不传默认1
                //     invoiceTitleType: 1, //发票抬头类型：1个人、2企业
                //     invoiceTitle: '', //发票抬头名称
                //     invoiceTax: '', //发票抬头_税号
                //     vatCompanyName: '',
                //     vatCompanyAddress: '',
                //     vatTelphone: '',
                //     vatBankName: '',
                //     vatBankAccount: '',
                //     email: '',
                //     invoiceNo: '',
                //     invoiceContent: ''
                // }
            },
            itemCode: '',
            needSubscribe1: true,
            isButtonClick: false,

            itemCodeJson: {
                '01': '图文咨询',
                '02': '视频咨询',
                '04': '复诊配药',
                '05': '药品费用',
            },
        };
    },

    computed: {
        goodsIcon() {
            let src = this.itemCode != '05' ? 'icon/ic_user_zxdd.png' : 'icon/ic_user_ypdd.png';

            return src;
        },
        needPayAmountFormat() {
            let { needPayAmount = 0 } = this.orderDetail;

            return toFixed0(needPayAmount, 2, true);
        },
    },

    onShow() {
        this.getSettingFn();
        this.getOrderFn();
    },

    onHide() { //为保证每次离开都触发，需写在leaveFn
        this.leaveFn();
    },

    onUnload() { //为保证每次离开都触发，需写在leaveFn
        clearInterval(this.timer);
        clearTimeout(this.timer1);
        clearTimeout(this.timer2);
        // this.unloadClickBack();
        this.leaveFn();
    },

    methods: {
        leaveFn() { //onHide和onUnload只会触发一个，如果是onHide可能需要重置data属性

        },
        buttonClickBack() {
            this.isButtonClick = true;
            this.onClickBack();
        },
        unloadClickBack() {
            if (!this.isButtonClick) {
                this.toOrderDetail();
            }
        },
        onClickBack() {
            wx.showModal({
                title: '提示',
                content: '你的订单已生成，请在15分钟内容完成支付，否则系统将为你自动取消订单',
                showCancel: true,
                cancelText: '继续支付',
                confirmText: '确定离开',
                cancelColor: '#33adff',
                confirmColor: '#33adff',
                success: (res) => {
                    if (res.confirm) {
                        this.toOrderDetail();
                    }
                }
            });
        },
        getSettingFn() {
            let { orderNo } = this.$router.query;

            wx.getSetting({
                withSubscriptions: true,
                success: (res) => {
                    console.log(1111111111, res);
                    let { subscriptionsSetting: sub = {} } = res;
                    let hint1 = sub['vZDcBbQjb-YrxaPe29rU9877Rz7neIuUIG95PoZ2zro'] != 'accept' ? '就诊提醒' : '';
                    let hint2 = sub['4r2UFnoD3ApWYFqolqTx5mylWSbigOu-xUrve8xhZfk'] != 'accept' ? '就诊异常通知' : '';
                    let hint3 = sub['q5YBqBvFtrUrNtXQODJ1_ek2USB6fLrnvR-NMaJ3Dno'] != 'accept' ? '处方生成提醒' : '';
                    let hint = [];

                    if (hint1) hint.push(hint1);
                    if (hint2) hint.push(hint2);
                    if (hint3) hint.push(hint3);
                    this.needSubscribe1 = hint.length > 0;
                },
            });
        },
        subscribe1() {
            wxSubscribe1((res) => {
                let hint1 = res['vZDcBbQjb-YrxaPe29rU9877Rz7neIuUIG95PoZ2zro'] != 'accept' ? '就诊提醒' : '';
                let hint2 = res['4r2UFnoD3ApWYFqolqTx5mylWSbigOu-xUrve8xhZfk'] != 'accept' ? '就诊异常通知' : '';
                let hint3 = res['q5YBqBvFtrUrNtXQODJ1_ek2USB6fLrnvR-NMaJ3Dno'] != 'accept' ? '处方生成提醒' : '';
                let hint = [];

                this.hideSubscribeMask1 = true;
                if (hint1) hint.push(hint1);
                if (hint2) hint.push(hint2);
                if (hint3) hint.push(hint3);
                hint = hint.join('、');
                if (hint.length) {
                    wx.showModal({
                        title: '提示',
                        content: `你拒绝了订阅${hint}，如需开通，请前往右上角更多-设置-接收订阅消息。`,
                        showCancel: false,
                        success: (res) => {
                            this.payFn();
                        }
                    });
                } else {
                    this.payFn();
                }
            });
        },
        subscribe2() {
            wxSubscribe2((res) => {
                // let hint1 = res['axvKHw39t47dPxmcYKn5xOawOviG8FysMrJlHBozv8o'] != 'accept' ? '药品发货通知' : '';
                let hint2 = res['SnMNUySb6QZIhuFIbfGXFa6zgKh2CAM_cChfZOT1YLs'] != 'accept' ? '药品订单状态变更通知' : '';
                let hint = [];

                this.hideSubscribeMask2 = true;
                // if (hint1) hint.push(hint1);
                if (hint2) hint.push(hint2);
                if (hint.length) {
                    wx.showModal({
                        title: '提示',
                        content: `你拒绝了订阅${hint}。`,
                        showCancel: false,
                        success: (res) => {
                            if (!needSubscribe1) {
                                this.payFn();
                            } else {
                                wxToast('请继续操作');
                            }
                        }
                    });
                } else {
                    this.payFn();
                }
            });
        },
        getOrderFn() {
            let { orderNo } = this.$router.query;

            getOrder([orderNo], (res) => {
                if (res.body) {
                    let itemCodeJson = {
                        '30': '01',
                        '40': '02',
                        '70': '04',
                        '80': '05',
                    };
                    let { orderNo, needPayAmount, goodsCategory } = res.body;

                    this.itemCode = itemCodeJson[goodsCategory];
                    this.params.orderNo = orderNo;
                    this.params.payAmount = needPayAmount + '';
                    this.params.goodsCategory = goodsCategory;
                    this.orderDetail = res.body;
                    this.countDownFn();
                }
            });
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
                        this.getOrderFn();
                    }
                    this.showHint = false;
                }
            }, 1000);
        },
        toOrderDetail() {
            let { orderDetailId = '', revisitId = '', orderNo = '' } = this.$router.query;
            let path = this.itemCode == '05' ? '/package/order/drugOrder/OrderDetail' : '/package/main/imOrderDetail/imOrderDetail';
            let query = {};

            if (orderDetailId) {
                query.orderDetailId = orderDetailId;
            } else if (revisitId) {
                query.revisitId = revisitId;
            } else if (orderNo) {
                query.orderNo = orderNo;
            }
            this.$router.redirect({
                path,
                query,
            });
        },
        notifyPayResultFn() {
            let { delayQuery, queryInterval, maxQueryCount, queryCount } = this;
            let { orderNo } = this.params;

            clearTimeout(this.timer1);
            this.timer1 = setTimeout(() => {
                notifyPayResult([orderNo], (res) => {
                    this.queryCount++;
                    if (res.body == '3') {
                        this.toOrderDetail();
                    } else {
                        clearTimeout(this.timer2);
                        this.timer2 = setTimeout(() => {
                            if (queryCount < maxQueryCount) {
                                this.notifyPayResultFn();
                            }
                        }, queryInterval);
                    }
                });
            }, delayQuery);
        },
        payFn() {
            appletPayOrder([this.params], null, (res) => {
                let { code, body } = res;

                if (code == 200) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {}
                    let { timestamp: timeStamp, nonceStr, pg, paySign, signType } = body || {};

                    if (this.params.payAmount == '0') {
                        wxToast('无需支付，正在查询结果...');
                        this.notifyPayResultFn();
                    } else {
                        wx.requestPayment({
                            timeStamp,
                            nonceStr,
                            package: pg,
                            paySign,
                            signType,
                            success: (res) => {
                                wxToast('支付成功，正在查询支付结果...');
                                this.notifyPayResultFn();
                            },
                            fail: (res) => {
                                console.log('支付失败', body, res);
                                wxToast('支付失败，请重试！');
                            },
                        });
                    }
                } else if (code == 1001 || code == 1002) {
                    setTimeout(() => {
                        this.toOrderDetail();
                    }, 2000);
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

.payment {
    @include styleInit;
    /deep/ & {
        min-height: 100vh;
        background-color: $bg;
        .van-nav-bar {
            box-sizing: content-box !important;
            .back {
                width: 80rpx;
                height: 80rpx;
                display: flex;
                justify-content: flex-start;
                align-items: center;
            }
        }

        .hint {
            @include hint;
        }
        .goodsInfo {
            display: flex;
            padding: 40rpx $padding1;
            background-color: #fff;
            .goodsIcon {
                width: 80rpx;
                height: 80rpx;
            }
            .rightContent {
                display: flex;
                justify-content: space-between;
                align-items: center;
                flex: 1;
                padding-left: $padding1;
                line-height: 40rpx;
                .left {
                    h4 {
                        font-size: 24rpx;
                        color: #666;
                    }
                }
                .right {
                    color: $orange;
                }
            }
        }
        .footer {
            @include footer;
        }
        .subscribeMask {
            width: 230rpx;
            height: 120rpx;
            position: fixed;
            right: 30rpx;
            bottom: 0;
            z-index: 99999;
            &.subscribeMask2 {
                z-index: 999999;
            }
        }
    }
}

</style>

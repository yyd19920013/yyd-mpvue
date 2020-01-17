<template>
    <div class="evaluation">
        <template v-if="canShow">
            <div class="wrap">
                <div v-if="itemCode!='05'" class="title">
                    <imgWrap className="avatar" :auto="false" :src="orderDetail.doctorAvatar?viewImage+orderDetail.doctorAvatar:'img_head_doctor.png'" />
                    <h3>{{params.doctorName}}</h3>
                    <h4>{{params.id?'你对医生服务的打分':'为医生的服务打分'}}</h4>
                </div>
                <div v-else class="title">
                    <h4>{{params.id?'您对本次服务的评价':'请对本次服务评价'}}</h4>
                </div>
                <div class="starWrap">
                    <i v-for="(item,index) in 5" :key="index" :class="{tap:true,active:params.score>index}" @click="toScore(item,index)"></i>
                </div>
                <div v-if="params.itemCode!='05'" class="labelList">
                    <span v-if="!params.id||params.id&&item.isChecked" v-for="(item,index) in resultLabelList" :key="index" :class="{active:item.isChecked}" @click="clickFn(item,index)">{{item.text}}</span>
                </div>
                <div v-if="!params.id" class="textareaWrap">
                    <textarea v-model.lazy="params.content" placeholder="本次服务你还有什么想说的吗？请评价我们的服务，促进我们提升服务质量"></textarea>
                </div>
                <div v-else class="desc">
                    {{params.content}}
                </div>
            </div>
            <div v-if="!params.id" class="buttonWrap">
                <button :class="{gray:!params.score}" type="button" @click="confirm">提交</button>
            </div>
        </template>
    </div>
</template>
<script>
import imgWrap from 'components/imgWrap';
import { wxToast } from 'js/yydjs';
import { viewImage, getOrderDetail, getRevisitOrderDetail, getDrugOrderDetail, findDic, getByOrderNo, addComment } from 'services';

export default {
    data() {
        return {
            canShow: false,
            labelList: [],
            tagCodes: [],
            params: {
                doctorId: '', // 医生id  药品评价(05)时不用传
                orderNo: '', // 订单编号
                doctorName: '', // 医生名称
                orderDetailId: '', // 问诊订单id  复诊订单字段为revisitId
                itemCode: '', // 问诊项code，01 图文问诊 02 视频问诊 03 基层会诊 04复诊配药 05药品评价
                score: 5, // 评分
                tagCodes: '', // 评价标签代码，多个逗号隔开
                content: '', // 评价内容
                doctorOnlineExtraId: '', // 在线问诊医生id  // 药品评价(05)时可不传
                orgId: '' // 机构id
            },
            orderNo: '',
            itemCode: '',

            getOrderDetail,
            getRevisitOrderDetail,
            getDrugOrderDetail,
            viewImage,
        };
    },

    computed: {
        resultLabelList() {
            let { labelList, tagCodes } = this;
            let result = labelList.map((item) => {
                let { key } = item;

                item.isChecked = !!~tagCodes.indexOf(key);
                return item;
            });
            return result;
        },
    },

    onShow() {
        this.findDicFn();
        this.getOrderDetailFn();
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
        getOrderDetailFn() {
            let { orderDetailId, revisitId, orderNo } = this.$router.query;
            let api = orderDetailId ? 'getOrderDetail' : (revisitId ? 'getRevisitOrderDetail' : 'getDrugOrderDetail');
            let orderId = orderDetailId || revisitId || orderNo;
            let itemCode = '';

            if (revisitId) {
                itemCode = '04';
            } else if (orderNo) {
                itemCode = '05';
            }
            this[api]([orderId], (res) => {
                if (res.body) {
                    let { orderNo, commentStatus } = res.body;

                    this.orderNo = orderNo;
                    itemCode = res.body.itemCode ? res.body.itemCode : itemCode;
                    this.itemCode = itemCode;
                    this.orderDetail = res.body;
                    if (commentStatus == '1') {
                        wx.setNavigationBarTitle({
                            title: '评价详情',
                        });
                        this.getByOrderNoFn();
                    } else {
                        let { doctorId, revisitDoctorId, doctorName, orderDetailId, revisitId, doctorOnlineExtraId, orgId } = res.body;

                        wx.setNavigationBarTitle({
                            title: '发表评价',
                        });
                        if (!orgId) {
                            orgId = this.$router.query.orgId;
                        }
                        this.canShow = true;
                        this.params.itemCode = itemCode;
                        this.params.orderNo = orderNo;
                        this.params.doctorId = doctorId || revisitDoctorId;
                        this.params.doctorName = doctorName;
                        this.params.orderDetailId = orderDetailId || revisitId;
                        this.params.doctorOnlineExtraId = doctorOnlineExtraId;
                        this.params.orgId = orgId;
                    }
                }
            });
        },
        findDicFn() {
            findDic([
                ['cfs.dic.ih_commentTagCode']
            ], (res) => {
                if (res.body) {
                    let { items } = res.body[0];

                    this.labelList = items;
                }
            });
        },
        getByOrderNoFn() {
            getByOrderNo([this.orderNo], (res) => {
                this.canShow = true;
                if (res.body) {
                    let { tagCodes = '' } = res.body;

                    this.tagCodes = tagCodes.split(',');
                    this.params = res.body;
                }
            });
        },
        toScore(item, index) {
            if (this.params.id) return;
            this.params.score = index + 1;
        },
        clickFn(item, index) {
            if (this.params.id) return;
            let { key } = item;
            let posIndex = this.tagCodes.indexOf(key);

            if (~posIndex) {
                this.tagCodes.splice(posIndex, 1);
            } else {
                this.tagCodes.push(key);
            }
        },
        confirm() {
            setTimeout(() => {
                this.params.tagCodes = this.tagCodes.join(',');
                addComment([this.params], (res) => {
                    wxToast('评价成功');
                    wx.setNavigationBarTitle({
                        title: '评价详情',
                    });
                    this.getByOrderNoFn();
                });
            }, 300);
        },
    },

    components: {
        imgWrap,
    },
}

</script>
<style lang="scss" scoped>
@import '~css/public.scss';

.evaluation {
    @include styleInit;
    /deep/ & {
        min-height: 100vh;
        background-color: $bg;
        .wrap {
            padding: 50rpx;
            background-color: #fff;
            .title {
                text-align: center;
                .avatar {
                    min-width: 120rpx;
                    width: 120rpx;
                    height: 120rpx;
                    border-radius: 50%;
                    background-color: $bg;
                }
                h3 {
                    line-height: 60rpx;
                    color: #666;
                }
                h4 {
                    line-height: 60rpx;
                    color: #666;
                    font-size: 32rpx;
                }
            }
            .starWrap {
                @include starWrap('../../../');
                display: flex;
                justify-content: center;
                padding-top: 30rpx;
                padding-bottom: 50rpx;
                i {
                    width: 40rpx;
                    height: 40rpx;
                    margin: 0 10rpx;
                }
            }
            .labelList {
                @include labelList;
            }
            .textareaWrap {
                padding: 15rpx $padding1;
                height: 200rpx;
                background-color: #f5f5f5;
                border-radius: $borderRadius1;
                textarea {
                    line-height: 48rpx;
                }
            }
            .desc {
                line-height: 48rpx;
                text-align: center;
                color: #666;
            }
        }
        .buttonWrap {
            @include buttonWrap;
        }
    }
}

</style>

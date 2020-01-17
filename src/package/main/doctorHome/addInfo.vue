<template>
    <div class="addInfo" :class="showSourceNumber ? 'no-scroll' :'' ">
        <div class="infoWrap">
            <ul class="infoList">
                <li>
                    <span>科室</span>
                    <div class="rightContent">
                        <span class="text">{{params[0].deptName}}</span>
                    </div>
                </li>
                <li>
                    <span>医生</span>
                    <div class="rightContent">
                        <span class="text">{{params[0].shopName}}</span>
                    </div>
                </li>
                <li :class="{hasArrow:type=='homeConsult'}">
                    <span>咨询类型</span>
                    <div :class="{rightContent:true,tap:type=='homeConsult'}" @click="showConsultTypeFn">
                        <span v-if="params[0].goodsName" class="text">{{params[0].goodsName}}</span>
                        <span v-else class="hint">请选择咨询类型</span>
                    </div>
                </li>
                <li v-if="isRequirePlan==1" class="hasArrow">
                    <span>预约时间</span>
                    <div class="rightContent tap" @click="showSelectTimeFn">
                        <span v-if="docScheduleId" class="text">
                            <span>{{formatWorkDate}}</span>
                            <span>{{formatWeekDay}}</span>
                            <span>{{formatStartTime}}-{{formatEndTime}}</span>
                        </span>
                        <span v-else class="hint">请选择预约时间</span>
                    </div>
                </li>
            </ul>
            <ul class="infoList">
                <li class="hasArrow">
                    <span>就诊人</span>
                    <div class="rightContent tap" @click="toSelectPatient">
                        <span v-if="params[2].uniqueId" class="text">
                            <span>{{params[2].name}}</span>
                            <span>{{params[2].sex=='1'?'男':'女'}}</span>
                            <span>{{patientAge}}岁</span>
                        </span>
                        <span v-else class="hint">请选择就诊人</span>
                    </div>
                </li>
            </ul>
            <ul class="infoList">
                <li class="hasArrow">
                    <span>基本健康信息</span>
                    <div class="rightContent tap" @click="toBasicHealthInfo">
                        <span v-if="params[1].healthId" class="text">{{params[1].healthInfo}}</span>
                        <span v-else class="hint">请添加过敏史病史等</span>
                    </div>
                </li>
            </ul>
        </div>
        <div class="buttonWrap">
            <button type="button" @click="createConsultOrderFn">提交</button>
        </div>
        <van-popup :show="showSelectConsultType" position="bottom" @close="showSelectConsultType=false">
            <div class="wrap">
                <div class="title">
                    选择咨询类型
                </div>
                <ul class="main">
                    <li v-for="(item,index) in doctorOnlineItems" :key="index" :class="{active:doctorOnlineItemIndex==index}" @click="selectConsultType(item,index)">{{item.itemCodeText}}</li>
                </ul>
                <div class="end" @click="showSelectConsultType=false">
                    取消
                </div>
            </div>
        </van-popup>
        <template v-if="id">
            <selectSourceNumber :show.sync="showSourceNumber1" :doctorOnlineExtraId="id" itemCode="01" @selectTime="selectTime" />
            <selectSourceNumber :show.sync="showSourceNumber2" :doctorOnlineExtraId="id" itemCode="02" @selectTime="selectTime" />
        </template>
    </div>
</template>
<script>
import vm from 'src/main';
import selectSourceNumber from 'components/selectSourceNumber';
import { lStore, copyJson, getAge, wxToast, wxToasts } from 'js/yydjs';
import { createConsultOrder, getIhDoctorInfo, getHealthinfoAndSpecialByMpiId } from 'services';
import { mapActions } from 'vuex';

export default {
    data() {
        return {
            showSelectConsultType: false,
            showSourceNumber1: false,
            showSourceNumber2: false,
            docScheduleItem1: {},
            docScheduleItem2: {},
            serviceItem: {},
            detail: {},
            doctorOnlineItemIndex: -1,
            params: [{
                userId: '', //下单人userId
                userName: '', //下单人姓名
                userPhone: '', //下单人手机号
                shopName: '', //必传，doctorName-医生姓名
                shopId: '', //必传，doctorId-医生id
                quantity: '1', //数量-问诊固定：1
                shippingAmount: '0', //必传，物流费用(没有则传0，不能为空)
                discAmount: '0', //必传，优惠金额(没有则传0，不能为空)
                orderAmount: '', //必传，订单金额(没有则传0，不能为空)
                payChannel: '03', //支付渠道：02支付宝 03微信
                remark: '', //备注
                postWay: '3', //邮寄方式 ，1 自取、 2  邮件、3 无(到店消费)
                ex: '', //扩展信息
                invoiceId: '', //发票编号,取自发票接口主键
                orderShipId: '', //订单物流主键，取自物流信息接口主键
                goodsCategory: '', //必传，商品分类:30图文问诊 40视频问诊
                goodsCode: '', //必传，问诊项目code,来自医生线上问诊接口
                goodsId: '', //必传，问诊项目id，来自医生线上问诊接口主键
                goodsName: '', //项目名称，图文问诊、视频问诊、远程会诊
                price: '' //价格，与orderAmount相同(没有则传0，不能为空)
            }, {
                docScheduleId: '', //医生排班主键，视频问诊必传
                deptId: '', //必传，科室主键
                descr: '', //不舒服描述
                itemCode: '', //必传，问诊项目：01图文问诊 02视频问诊
                healthId: '', //就诊人基本健康信息,引用healthInfo主键
                startTime: '', //视频问诊必传，预约开始时间
                endTime: '', //视频问诊必传，预约结束时间
                remark: '', //备注信息
                orgId: '', //必传，机构id
                doctorOnlineExtraId: '' //必传，线上问诊医生主键
            }, {
                name: '', //必传，就诊人姓名
                idCardType: '01', //卡类型
                idCard: '', //卡号
                sex: '1', //必传，性别
                dob: '', //必传，出生日期
                phone: '', //手机号
                uniqueId: '', //必传，患者主索引，大C端->mpiId，晞景->outId
                ex: '' //外部扩展信息
            }],
            docScheduleItem1: {},
            docScheduleItem2: {},
            type: '',
            id: '',
            isRequirePlan: '',
            itemCode: '',
            docScheduleId: '',
            formatWorkDate: '',
            formatWeekDay: '',
            formatStartTime: '',
            formatEndTime: '',

            goodsJson: {
                '01': {
                    goodsCategory: '30',
                    goodsCode: '01',
                    goodsName: '图文咨询',
                    showName: 'showSourceNumber1',
                    scheduleName: 'docScheduleItem1',
                },
                '02': {
                    goodsCategory: '40',
                    goodsCode: '02',
                    goodsName: '视频咨询',
                    showName: 'showSourceNumber2',
                    scheduleName: 'docScheduleItem2',
                },
                '04': {
                    goodsCategory: '70',
                    goodsCode: '04',
                    goodsName: '复诊配药',
                    showName: 'showSourceNumber3',
                    scheduleName: 'docScheduleItem3',
                },
            },
        };
    },

    computed: {
        showSourceNumber() {
            return this.showSourceNumber1 || this.showSourceNumber2;
        },
        patientAge() {
            let { dob } = this.params[2];
            let age = dob ? getAge(dob) : '';

            return age;
        },
        doctorOnlineItems() {
            let { doctorOnlineItems = [] } = this.detail;

            doctorOnlineItems = doctorOnlineItems.filter((item) => item.itemCode != '04');
            return doctorOnlineItems;
        },
    },

    onLoad() {
        vm.$on('selectPatientClick', this.selectPatientClick);
        vm.$on('basicHealthInfoSubmit', this.basicHealthInfoSubmit);
    },

    onShow() {
        this.getQuery();
        this.getIhDoctorInfoFn();
    },

    onHide() { //为保证每次离开都触发，需写在leaveFn
        this.leaveFn();
    },

    onUnload() { //为保证每次离开都触发，需写在leaveFn
        vm.$off('selectPatientClick', this.selectPatientClick);
        vm.$off('basicHealthInfoSubmit', this.basicHealthInfoSubmit);
        this.leaveFn();
    },

    methods: {
        ...mapActions('userInfo', [
            'needLoginAndImproveInfo'
        ]),
        leaveFn() { //onHide和onUnload只会触发一个，如果是onHide可能需要重置data属性

        },
        setParams(json = {}, isReplace = false) {
            let copyParams = copyJson(this.params);

            for (let attr in json) {
                let index = attr;
                let params = json[attr];

                for (let key in params) {
                    if (!copyParams[index][key] && copyParams[index][key] !== 0 || isReplace) {
                        copyParams[index][key] = params[key];
                    }
                }
            }
            this.params = copyParams;
        },
        getQuery() {
            let userInfo = lStore.get('userInfo') || {};
            let { userId, userName, userPhone } = userInfo;
            let {
                type,
                id: goodsId,
                itemCode,
                doctorName: shopName,
                doctorId: shopId,
                deptName,
                deptId,
                orgId,
                doctorOnlineExtraId,
                price,
                docScheduleId = '',
                startTime = '',
                endTime = '',
                formatWorkDate = '',
                formatWeekDay = '',
                formatStartTime = '',
                formatEndTime = '',
            } = this.$router.query;
            let item = this.goodsJson[itemCode];
            let { goodsCategory, goodsCode, goodsName } = item || {};

            console.log(this.$router.query);
            this.type = type;
            this.id = goodsId;
            if (!this.itemCode) this.itemCode = itemCode;
            this.serviceItem = { doctorOnlineExtraId, itemCode, price };
            if (docScheduleId) {
                this.isRequirePlan = 1;
                this.docScheduleId = docScheduleId;
                this.formatWorkDate = formatWorkDate;
                this.formatWeekDay = formatWeekDay;
                this.formatStartTime = formatStartTime;
                this.formatEndTime = formatEndTime;
            }
            this.setParams({
                '0': {
                    userId,
                    userName,
                    userPhone,
                    shopName,
                    orderAmount: price,
                    shopId,
                    goodsId,
                    goodsCategory,
                    goodsCode,
                    goodsName,
                    price,
                    deptName,
                },
                '1': {
                    docScheduleId,
                    deptId,
                    itemCode,
                    startTime,
                    endTime,
                    orgId,
                    doctorOnlineExtraId,
                },
            });
            console.log(copyJson(this.params));
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
        setInfo(item, index = 0) {
            let { mpiId } = item;

            getHealthinfoAndSpecialByMpiId([mpiId], (res) => {
                if (res.body) {
                    let { healthinfo = {} } = res.body;
                    let { id: healthId, foodAllergy, medicalAllergy, familyDiseaseHistory, operationOrTrauma } = healthinfo;
                    let healthInfo = [];

                    if (medicalAllergy) healthInfo.push(medicalAllergy);
                    if (foodAllergy) healthInfo.push(foodAllergy);
                    if (familyDiseaseHistory) healthInfo.push(familyDiseaseHistory);
                    if (operationOrTrauma) healthInfo.push(operationOrTrauma);
                    healthInfo = healthInfo.join(';');

                    this.basicHealthInfoSubmit({
                        healthId,
                        healthInfo,
                    });
                } else {
                    this.basicHealthInfoSubmit({
                        healthId: '',
                        healthInfo: '',
                    });
                }
            });
        },
        showConsultTypeFn() {
            if (this.type != 'homeConsult') return;
            this.showSelectConsultType = true;
        },
        selectConsultType(item, index) {
            let { itemCode, isRequirePlan } = item;

            this.doctorOnlineItemIndex = index;
            this.serviceItem = item;
            this.showSelectConsultType = false;
            this.isRequirePlan = isRequirePlan;
            this.itemCode = itemCode;
            this.toAddInfo(item);
        },
        showSelectTimeFn() {
            let { itemCode, docScheduleItem1, docScheduleItem2 } = this;
            let key = this.goodsJson[itemCode];
            let { showName } = key;
            let haveData = itemCode == '01' && docScheduleItem1.id || itemCode == '02' && docScheduleItem2.id;

            if (haveData) {
                this[showName] = true;
            } else {
                wxToast('暂无排班');
            }
        },
        selectTime(params) {
            let { isFirst, itemCode, item } = params;
            let { formatWorkDate = '', formatWeekDay = '', formatStartTime = '', formatEndTime = '' } = item;
            let key = this.goodsJson[itemCode];
            let { scheduleName, showName } = key;

            this[scheduleName] = item;
            if (!isFirst) {
                this.formatWorkDate = formatWorkDate;
                this.formatWeekDay = formatWeekDay;
                this.formatStartTime = formatStartTime;
                this.formatEndTime = formatEndTime;
                this[showName] = false;
                this.toAddInfo(item);
            }
        },
        toAddInfo(item, selectType) {
            let { doctorOnlineExtraId, itemCode, price = 0 } = this.serviceItem;
            let { id: docScheduleId = '', fullStartTime: startTime = '', fullEndTime: endTime = '' } = item;
            if (!startTime) docScheduleId = '';
            if (!itemCode) itemCode = this.itemCode;
            let goodsItem = this.goodsJson[itemCode];
            let { goodsCategory, goodsCode, goodsName } = goodsItem || {};

            this.docScheduleId = docScheduleId;
            this.setParams({
                '0': {
                    goodsCategory,
                    goodsCode,
                    goodsName,
                    orderAmount: price,
                    price,
                },
                '1': {
                    itemCode,
                    doctorOnlineExtraId,
                    docScheduleId,
                    startTime,
                    endTime,
                },
            }, true);
            if (this.isRequirePlan == 0) {
                this.setParams({
                    '1': {
                        docScheduleId: '',
                        startTime: '',
                        endTime: '',
                    },
                }, true);
            }
        },
        selectPatientClick(params) {
            let { item, index } = params;
            let { personName: name, sex, dob, phoneNo: phone = '', mpiId: uniqueId, certificate = {} } = item;
            let { certificateType: idCardType, certificateNo: idCard } = certificate;

            //console.log(22122, item);
            this.setParams({
                '2': {
                    name,
                    sex,
                    dob,
                    phone,
                    uniqueId,
                    idCardType,
                    idCard,
                },
            }, true);
            this.setInfo(item, index);
        },
        basicHealthInfoSubmit(params) {
            let { healthId, healthInfo } = params;

            //console.log(33333, params);
            this.setParams({
                '1': {
                    healthId,
                    healthInfo,
                },
            }, true);
        },
        toSelectPatient() {
            var self = this;
            this.needLoginAndImproveInfo().then(() => {
                self.$router.navigate('/package/main/doctorHome/selectPatient');
            });
        },
        toBasicHealthInfo() {
            if (!this.params[2].uniqueId) return wxToast('请选择就诊人');
            let mpiId = this.params[2].uniqueId;

            this.$router.navigate({
                path: '/package/main/doctorHome/basicHealthInfo',
                query: {
                    mpiId,
                },
            });
        },
        createConsultOrderFn() {
            console.log(copyJson(this.params));
            let { goodsName } = this.params[0];
            let { healthId, docScheduleId } = this.params[1];
            let { uniqueId } = this.params[2];
            let arr1 = [
                { if: this.isRequirePlan == 1 && !docScheduleId, hint: '请选择预约时间' },
                { if: !uniqueId, hint: '请选择就诊人' },
                { if: !healthId, hint: '请添加过敏史病史等' },
            ];
            let arr2 = [
                { if: !goodsName, hint: '请选择咨询类型' },
                { if: this.isRequirePlan == 1 && !docScheduleId, hint: '请选择预约时间' },
                { if: !uniqueId, hint: '请选择就诊人' },
                { if: !healthId, hint: '请添加过敏史病史等' },
            ];
            let arr = this.type != 'homeConsult' ? arr1 : arr2;

            wxToasts(arr, () => {
                createConsultOrder(this.params, (res) => {
                    if (res.body) {
                        let { orderDetailId, orderNo, code, msg } = res.body;
                        let pathJson = {
                            '0': '/package/main/payment/payment',
                            '700': '/package/main/imOrderDetail/imOrderDetail',
                            '701': '/package/main/imOrderDetail/imOrderDetail',
                        };
                        let path = pathJson[code];
                        let query = {
                            orderDetailId,
                        };

                        wxToast(msg);
                        if (code == '0') {
                            query.orderNo = orderNo;
                        }
                        if (code == '700' || code == '701') {
                            setTimeout(() => {
                                this.$router.redirect({
                                    path,
                                    query,
                                });
                            }, 1000);
                        } else if (code == '0') {
                            this.$router.redirect({
                                path,
                                query,
                            });
                        }
                    }
                });
            });
        },
    },

    components: {
        selectSourceNumber,
    },
}

</script>
<style lang="scss" scoped>
@import '~css/public.scss';

.addInfo {
    @include styleInit;
    &.no-scroll {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
    }
    /deep/ & {
        height: 100vh;
        background-color: $bg;
        .infoWrap {
            .infoList {
                @include infoList('../../../');
            }
        }
        .buttonWrap {
            @include buttonWrap;
        }
        .van-popup {
            background-color: transparent;
            .wrap {
                text-align: center;
                .title {
                    height: $height1;
                    line-height: $height1;
                    border-bottom: $border1;
                    background-color: #fff;
                    color: #999;
                }
                .main {
                    background-color: #fff;
                    li {
                        height: $height1;
                        line-height: $height1;
                        border-bottom: $border1;
                        &.active {
                            color: $main;
                        }
                    }
                }
                .end {
                    margin-top: 20rpx;
                    height: $height1;
                    line-height: $height1;
                    background-color: #fff;
                }
            }
        }
    }
}

</style>

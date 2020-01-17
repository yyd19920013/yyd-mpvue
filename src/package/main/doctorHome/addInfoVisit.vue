<template>
    <div class="addInfoVisit" :class="showSourceNumber ? 'no-scroll' :''">
        <div class="infoWrap">
            <ul class="infoList">
                <li>
                    <span>复诊科室</span>
                    <div class="rightContent">
                        <span v-if="params.revisitDeptName" class="text">{{params.revisitDeptName}}</span>
                        <span v-else class="hint">无</span>
                    </div>
                </li>
                <li :class="{hasArrow:type=='homeVisit'}">
                    <span>医生</span>
                    <div :class="{rightContent:true,tap:type=='homeVisit'}" @click="toSelectDoctor">
                        <span v-if="params.doctorOnlineExtraId" class="text">{{params.revisitDoctorName}}</span>
                        <span v-else class="hint">请选择医生</span>
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
                <li>
                    <span>就诊人</span>
                    <div class="rightContent tap">
                        <span v-if="params.mpiId" class="text">
                            <span>{{params.personName}}</span>
                            <span>{{params.sex=='1'?'男':'女'}}</span>
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
                        <span v-if="params.healthId" class="text">{{params.healthInfo}}</span>
                        <span v-else class="hint">请添加过敏史病史等</span>
                    </div>
                </li>
                <li class="multiLine2">
                    <span>既往就诊</span>
                    <div class="rightContent">
                        <div v-if="params.deptId" class="text">
                            <h3>{{params.visitDateTime}}</h3>
                            <h4>{{params.orgFullName}}/{{params.revisitDeptName}}</h4>
                        </div>
                        <span v-else class="hint">无</span>
                    </div>
                </li>
                <li>
                    <span>确认诊断</span>
                    <div class="rightContent tap">
                        <span v-if="params.diagnoseCode" class="text">{{params.diagnoseName}}</span>
                        <span v-else class="hint">无</span>
                    </div>
                </li>
            </ul>
            <ul class="illnessInfo">
                <li class="required">
                    <div class="title">
                        <span class="span">病情描述</span>
                    </div>
                    <div class="textareaWrap">
                        <textarea v-if="!showSourceNumber" v-model.lazy="params.diseaseSituation.chiefComplaint" placeholder="请描述病情症状，目前是否好转，想要获得医生什么帮助，最少输入5个字" class="textarea"></textarea>
                        <div v-else :class="{textarea:true,gray:!params.diseaseSituation.chiefComplaint}">
                            {{params.diseaseSituation.chiefComplaint?params.diseaseSituation.chiefComplaint:'请描述病情症状，目前是否好转，想要获得医生什么帮助，最少输入5个字'}}
                        </div>
                    </div>
                </li>
                <li>
                    <div class="title">
                        <span class="span">病情照片</span>
                        <span class="em">检验检查单、病历资料、药品信息等，最多上传9张照片</span>
                    </div>
                    <van-uploader :file-list="resultFileIdsArr" :max-count="9" @afterRead="afterRead" @delete="deleteImg" />
                </li>
            </ul>
            <div class="readingConfirm">
                <van-checkbox :value="params.readed" shape="square" @change="readChange">
                    <span class="span">我已阅读并确认</span>
                </van-checkbox>
                <span class="em tap" @click="toWebView">《知情同意书》</span>
            </div>
        </div>
        <div class="buttonWrap">
            <button type="button" @click="submit">提交</button>
        </div>
        <template v-if="id">
            <selectSourceNumber :show.sync="showSourceNumber" :doctorOnlineExtraId="id" itemCode="04" @selectTime="selectTime" />
        </template>
    </div>
</template>
<script>
import vm from 'src/main';
import selectSourceNumber from 'components/selectSourceNumber';
import { getAge, copyJson, wxToast, wxToasts } from 'js/yydjs';
import { viewImage, singlePic, submitRevisitDispense, getHealthinfoAndSpecialByMpiId } from 'services';

export default {
    data() {
        return {
            showSourceNumber: false,
            params: {
                visitId: '',
                mpiId: '',
                orgId: '',
                localOrgId: '',
                orgFullName: '',
                deptId: '', //就诊列表的deptRegId
                localDeptId: '', //就诊列表的localDeptRegId
                deptName: '', //就诊列表的deptRegName
                visitDateTime: '',
                diagnoseCode: '',
                diagnoseName: '',
                patientId: '', //病人id,从就诊记录获取
                patientIdHis: '', //his病人id,从就诊记录获取
                visitDoctorName: '', //初诊医生名字
                clinicId: '', //门诊号码
                sourceVisitId: '', //就诊流水号
                goodsId: '', //服务项目id（专家问诊-getOnlineConsultDoctorInfo-doctorOnlineItems）
                goodsName: '', //服务项目名称（专家问诊-getOnlineConsultDoctorInfo-doctorOnlineItems）
                doctorOnlineExtraId: '', //在线问诊医生id
                price: '',
                drugs: [],
                herbalMedicines: [],
                fileIds: '', //新增，说明chiefComplaint弃用，file图片列表，多张以“|”分隔
                diseaseSituation: {
                    symptomDuration: '', //字典ih_symptomDuration多项“|”分隔
                    symptomName: '', //症状名称：多项“|”分隔
                    symptomDesc: '', //症状描述
                    encounterOutFlag: '', // 是否去过院外就诊：0否 1是
                    encounterOrgName: '', //就诊机构名称
                    drugName: '', //服用药物
                    chiefComplaint: '', //病情描述
                    coughFlag: '' // 是否咳嗽：0否 1是
                },
                healthIdSpecial: '', //特殊健康信息数据id
                healthId: '', //基本健康信息数据id
                readed: false,
                docScheduleId: '',
                scheduleStartTime: '',
                scheduleEndTime: '',
            },
            docScheduleItem: {},
            fileIdsArr: [],
            filePath: '',
            type: '',
            id: '',
            isRequirePlan: '',
            docScheduleId: '',
            formatWorkDate: '',
            formatWeekDay: '',
            formatStartTime: '',
            formatEndTime: '',
        };
    },

    computed: {
        patientAge() {
            let { dob } = this.params;
            let age = dob ? getAge(dob) : '';

            return age;
        },
        resultFileIdsArr() {
            let result = this.fileIdsArr.map((item) => {
                return { url: `${viewImage}${item}`, name: 'file', isImage: true };
            });

            return result;
        },
    },

    onLoad() {
        vm.$on('findDoctorSelectTime', this.findDoctorSelectTime);
        vm.$on('basicHealthInfoSubmit', this.basicHealthInfoSubmit);
    },

    onShow() {
        this.getQuery();
    },

    onHide() { //为保证每次离开都触发，需写在leaveFn
        this.leaveFn();
    },

    onUnload() { //为保证每次离开都触发，需写在leaveFn
        vm.$off('findDoctorSelectTime', this.findDoctorSelectTime);
        vm.$off('basicHealthInfoSubmit', this.basicHealthInfoSubmit);
        this.leaveFn();
    },

    methods: {
        leaveFn() { //onHide和onUnload只会触发一个，如果是onHide可能需要重置data属性

        },
        setParams(params = {}, isReplace = false) {
            let copyParams = copyJson(this.params);

            for (let key in params) {
                if (!copyParams[key] && copyParams[key] !== 0 || isReplace) {
                    copyParams[key] = params[key];
                }
            }
            this.params = copyParams;
        },
        getQuery() {
            let { type, mpiId, goodsId, goodsName, doctorOnlineExtraId, price = 0, personName, revisitDoctorName, revisitDeptName, sex, dob, visitId, orgId, localOrgId, orgFullName, deptRegId: deptId, localDeptRegId: localDeptId, deptRegName: deptName, visitDateTime, diagnoseCode, diagnoseName, patientId, patientIdHis, visitDoctorName, clinicId, sourceVisitId, docScheduleId, scheduleStartTime, scheduleEndTime, formatWorkDate = '', formatWeekDay = '', formatStartTime = '', formatEndTime = '' } = this.$router.query;

            this.type = type;
            this.setParams({
                mpiId,
                personName,
                sex,
                dob,
                visitId,

                localOrgId,
                orgFullName,
                deptId,
                localDeptId,
                deptName,

                visitDateTime,
                diagnoseCode,
                diagnoseName,
                patientId,
                patientIdHis,

                visitDoctorName,
                clinicId,
                sourceVisitId,

                orgId,
                goodsId,
                revisitDoctorName,
                revisitDeptName,
                doctorOnlineExtraId,

                price,
                goodsName,
                docScheduleId,
                scheduleStartTime,
                scheduleEndTime,
            });
            if (!this.id) {
                this.id = doctorOnlineExtraId;
            }
            if (docScheduleId) {
                this.isRequirePlan = 1;
                this.docScheduleId = docScheduleId;
                this.formatWorkDate = formatWorkDate;
                this.formatWeekDay = formatWeekDay;
                this.formatStartTime = formatStartTime;
                this.formatEndTime = formatEndTime;
            }
            this.setInfo({ mpiId });
            console.log(copyJson(this.params));
        },
        afterRead(ev) {
            let { path: filePath } = ev.mp.detail.file;

            this.filePath = filePath;
            singlePic(filePath, (res) => {
                this.fileIdsArr.push(res.body);
            });
        },
        deleteImg(ev) {
            let { index } = ev.mp.detail;

            wx.showModal({
                title: '提示',
                content: '是否确定删除图片？',
                success: (res) => {
                    if (res.confirm) {
                        this.fileIdsArr.splice(index, 1);
                    } else if (res.cancel) {

                    }
                }
            });
        },
        readChange(ev) {
            let readed = ev.mp.detail;

            this.setParams({
                readed,
            }, true);
            console.log(readed);
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
        basicHealthInfoSubmit(params) {
            let { healthId, healthInfo } = params;

            console.log(33333, params);
            this.setParams({
                healthId,
                healthInfo,
            }, true);
        },
        findDoctorSelectTime(params) {
            let { detail, serviceItem, item } = params;
            let { orgId, orgFullName, standardDeptId, standardDeptName, goodsId, doctorName: revisitDoctorName } = detail;
            let { isRequirePlan, doctorOnlineExtraId, price = '0', itemCodeText: goodsName } = serviceItem;

            console.log('找医生数据', copyJson(params));
            this.docScheduleId = '';
            this.setParams({
                docScheduleId: '',
                scheduleStartTime: '',
                scheduleEndTime: '',
            }, true);
            this.isRequirePlan = isRequirePlan;
            this.id = '';
            setTimeout(() => {
                this.id = doctorOnlineExtraId;
            }, 300);
            this.setParams({
                orgId,
                orgFullName,
                // revisitDeptName: standardDeptName,
                goodsId,
                revisitDoctorName,
                doctorOnlineExtraId,

                price,
                goodsName,
            }, true);
        },
        toSelectDoctor() {
            if (this.type != 'homeVisit') return;
            let { type } = this;
            let { standardDeptId = '', standardDeptName = '' } = this.$router.query;

            this.$router.navigate({
                path: '/package/main/findDoctor/findDoctor',
                query: {
                    type,
                    standardDeptId,
                    standardDeptName,
                },
            });
        },
        showSelectTimeFn() {
            let haveData = this.docScheduleItem.id;

            if (haveData) {
                this.showSourceNumber = true;
            } else {
                wxToast('暂无排班');
            }
        },
        selectTime(params) {
            let { isFirst, itemCode, item } = params;
            let { formatWorkDate = '', formatWeekDay = '', formatStartTime = '', formatEndTime = '' } = item;

            this.docScheduleItem = item;
            if (!isFirst) {
                this.formatWorkDate = formatWorkDate;
                this.formatWeekDay = formatWeekDay;
                this.formatStartTime = formatStartTime;
                this.formatEndTime = formatEndTime;
                this.toAddInfoVisit(item);
            }
        },
        toAddInfoVisit(item) {
            let { id: docScheduleId = '', fullStartTime: scheduleStartTime = '', fullEndTime: scheduleEndTime = '' } = item;
            if (!scheduleStartTime) docScheduleId = '';

            this.docScheduleId = docScheduleId;
            this.setParams({
                docScheduleId,
                scheduleStartTime,
                scheduleEndTime,
            }, true);
            if (this.isRequirePlan == 0) {
                this.setParams({
                    docScheduleId: '',
                    scheduleStartTime: '',
                    scheduleEndTime: '',
                }, true);
            }
        },
        toBasicHealthInfo() {
            if (!this.params.mpiId) return wxToast('请选择就诊人');
            let mpiId = this.params.mpiId;

            this.$router.navigate({
                path: '/package/main/doctorHome/basicHealthInfo',
                query: {
                    mpiId,
                },
            });
        },
        toWebView() {
            this.$router.navigate('/pages/webView/informedConsent');
        },
        submit() {
            setTimeout(() => {
                let { doctorOnlineExtraId, healthId, docScheduleId, diseaseSituation = {}, readed } = this.params;
                let { chiefComplaint = '' } = diseaseSituation;
                let arr1 = [
                    { if: this.isRequirePlan == 1 && !docScheduleId, hint: '请选择预约时间' },
                    { if: !healthId, hint: '请添加过敏史病史等' },
                    { if: !chiefComplaint, hint: '请输入病情描述' },
                    { if: chiefComplaint.length < 5, hint: '病情描述最少输入5个字' },
                    { if: !readed, hint: '请阅读并确认《知情同意书》' },
                ];
                let arr2 = [
                    { if: !doctorOnlineExtraId, hint: '请选择医生' },
                    { if: this.isRequirePlan == 1 && !docScheduleId, hint: '请选择预约时间' },
                    { if: !healthId, hint: '请添加过敏史病史等' },
                    { if: !chiefComplaint, hint: '请输入病情描述' },
                    { if: chiefComplaint.length < 5, hint: '病情描述最少输入5个字' },
                    { if: !readed, hint: '请阅读并确认《知情同意书》' },
                ];
                let arr = this.type != 'homeVisit' ? arr1 : arr2;

                wxToasts(arr, () => {
                    let data = copyJson(this.params);
                    let fileIds = this.fileIdsArr.join('|');

                    submitRevisitDispense({ data: JSON.stringify(data), fileIds }, null, (res) => {
                        if (res.body) {
                            let { code } = res;
                            let { orderDetailId: revisitId, orderNo, msg } = res.body;
                            let pathJson = {
                                '200': '/package/main/payment/payment',
                                '100': '/package/main/imOrderDetail/imOrderDetail',
                                '101': '/package/main/imOrderDetail/imOrderDetail',
                            };
                            let path = pathJson[code];
                            let query = {
                                revisitId,
                            };

                            wxToast(msg);
                            if (code == '200') {
                                query.orderNo = orderNo;
                            }
                            if (code == '100' || code == '101') {
                                setTimeout(() => {
                                    this.$router.redirect({
                                        path,
                                        query,
                                    });
                                }, 1000);
                            } else if (code == '200') {
                                this.$router.redirect({
                                    path,
                                    query,
                                });
                            }
                        }
                    });
                });
            }, 300);
        },
    },

    components: {
        selectSourceNumber,
    },
}

</script>
<style lang="scss" scoped>
@import '~css/public.scss';

.addInfoVisit {
    &.no-scroll {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
    }
    @include styleInit;
    /deep/ & {
        min-height: 100vh;
        background-color: $bg;
        .infoWrap {
            .infoList {
                @include infoList('../../../');
            }
        }
        .illnessInfo {
            padding: 0 $padding1;
            background-color: #fff;
            li {
                .title {
                    padding: 20rpx 0;
                    line-height: 40rpx;
                    .em {
                        padding-left: 10rpx;
                        font-size: 20rpx;
                        color: #666;
                    }
                }
                .textareaWrap {
                    padding: 15rpx $padding1;
                    border-radius: 4rpx;
                    background-color: $bg;
                    .textarea {
                        width: 100%;
                        height: 144rpx;
                        line-height: 48rpx;
                        &.gray {
                            line-height: 36rpx;
                            color: #999;
                        }
                    }
                }
                &.required {
                    >span {
                        padding-left: 20rpx;
                        &:before {
                            content: "*";
                            font-size: 24rpx;
                            color: #ff0000;
                            position: absolute;
                            left: 0;
                            top: 0;
                        }
                    }
                }
            }
        }
        .readingConfirm {
            display: flex;
            align-items: center;
            padding: $padding1;
            line-height: 30rpx;
            background-color: #fff;
            .span {
                color: #666;
            }
            .em {
                color: $main;
            }
        }
        .buttonWrap {
            @include buttonWrap;
        }
    }
}

</style>

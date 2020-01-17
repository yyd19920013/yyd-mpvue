<template>
    <div class="myCaseHistory">
        <div class="title">
            <div class="titleWrap">
                <span class="span">我的病历</span>
                <span class="em tap" @click="toAddMedicaRecords">+添加就诊记录</span>
            </div>
        </div>
        <template v-if="loaded">
            <ul v-if="resultCaseHistoryList.length" class="caseHistoryList">
                <li v-for="(item,index) in resultCaseHistoryList" :key="index" @click="selectCaseHistory(item,index)">
                    <div class="wrap">
                        <h3>
                            <span>{{item.doctorName}}</span>
                            <span>{{item.doctorLevelText}}</span>
                            <span>{{item.orgFullName}}</span>
                        </h3>
                        <h4>
                            <span>{{item.standardDeptName}}</span>
                            <span>{{item.diagnoseName}}</span>
                        </h4>
                        <h5>
                            <span>线下就诊</span>
                            <span>{{item.visitDateTime}}</span>
                        </h5>
                    </div>
                </li>
            </ul>
            <div v-else class="defaultImageWrap">
                <listEmpty message="暂未查询到该就诊人的线下就诊记录。请切换就诊人，或手动维护就诊记录。" :networkError="networkError" @clickButton="findDiagnosisRecordsFn" />
            </div>
        </template>
        <!-- <div class="moreCaseHistory">
            <span class="check tap">查看更多病历</span>
        </div> -->
    </div>
</template>
<script>
import listEmpty from 'components/listEmpty';
import { date, dateFormat0 } from 'js/yydjs';
import { findDiagnosisRecords } from 'services';

export default {
    data() {
        return {
            caseHistoryList: [],
            loaded: false,
            networkError: false,
        };
    },

    computed: {
        resultCaseHistoryList() {
            let result = this.caseHistoryList.map((item) => {
                item.visitDateTime = dateFormat0(item.visitDateTime, 'yyyy-MM-dd');
                return item;
            });

            return result;
        },
    },

    onShow() {
        this.findDiagnosisRecordsFn();
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
        findDiagnosisRecordsFn() {
            let { orgId, mpiId, standardDeptId } = this.$router.query;

            findDiagnosisRecords([orgId, mpiId, standardDeptId], (res) => {
                if (res.body) {
                    this.caseHistoryList = res.body;
                    this.loaded = true;
                }
            }, (err) => {
                this.loaded = true;
                this.networkError = true;
            });
        },
        toAddMedicaRecords() {
            let query = this.$router.query;

            this.$router.redirect({
                path: '/package/main/myCaseHistory/addMedicaRecords',
                query,
            });
        },
        selectCaseHistory(item, index) {
            let { orgFullName, visitId, orgId, localOrgId = '', deptRegId, localDeptRegId, deptRegName, visitDateTime, diagnoseCode = '', diagnoseName = '', patientId, patientIdHis = '', doctorName: visitDoctorName = '', clinicId = '', sourceVisitId = '', standardDeptId, standardDeptName } = item;
            let query = Object.assign({}, this.$router.query, { orgFullName, visitId, orgId, localOrgId, deptRegId, localDeptRegId, deptRegName, visitDateTime, diagnoseCode, diagnoseName, patientId, patientIdHis, clinicId, sourceVisitId, standardDeptId, standardDeptName, revisitDeptName: standardDeptName });

            this.$router.redirect({
                path: '/package/main/doctorHome/addInfoVisit',
                query,
            });
        },
    },

    components: {
        listEmpty,
    },
}

</script>
<style lang="scss" scoped>
@import '~css/public.scss';

.myCaseHistory {
    @include styleInit;
    /deep/ & {
        min-height: 100vh;
        padding: 0 40rpx;
        background-color: $bg;
        .title {
            padding-top: 40rpx;
            .titleWrap {
                display: flex;
                justify-content: space-between;
                padding-left: 40rpx;
                padding-bottom: 40rpx;
                line-height: 40rpx;
                border-left: 4rpx solid #d9dbdf;
                position: relative;
                &:before {
                    content: "";
                    width: 12rpx;
                    height: 12rpx;
                    border-radius: 50%;
                    background-color: #d9dbdf;
                    position: absolute;
                    left: 0;
                    margin-left: -8rpx;
                    top: 0;
                }
                .span {
                    font-size: 32rpx;
                }
                .em {
                    color: $main;
                }
            }
        }
        .caseHistoryList {
            li {
                padding-left: 40rpx;
                border-left: 4rpx solid #d9dbdf;
                padding-bottom: 30rpx;
                position: relative;
                &:before {
                    content: "";
                    width: 30rpx;
                    height: 30rpx;
                    border-radius: 50%;
                    background: url('../../../images/icon/ic_userfile_dot_L.png') no-repeat center center;
                    background-size: 30rpx;
                    position: absolute;
                    left: 0;
                    margin-left: -17rpx;
                    top: 0;
                }
                .wrap {
                    padding: 15rpx $padding1;
                    border-radius: $borderRadius1;
                    background-color: #fff;
                    span {
                        padding-right: 20rpx;
                    }
                    h3, h4, h5 {
                        line-height: 48rpx;
                    }
                    h4 {
                        font-size: 24rpx;
                        color: #999;
                    }
                    h5 {
                        font-size: 24rpx;
                        color: #666;
                    }
                }
            }
        }
        .defaultImageWrap {
            height: 600rpx;
            position: relative;
        }
        .moreCaseHistory {
            padding: 40rpx;
            text-align: center;
            .check {
                padding-right: 30rpx;
                background: url('../../../images/icon/ic_arrow_down_gray.png') no-repeat right center;
                background-size: 20rpx;
                color: #999;
            }
        }
    }
}

</style>

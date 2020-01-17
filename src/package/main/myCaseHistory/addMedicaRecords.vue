<template>
    <div class="addMedicaRecords">
        <ul class="infoList">
            <li>
                <div class="wrap">
                    <span>就诊时间</span>
                    <div v-if="params.visitDateTime" class="rightContent">
                        <pickerWrap :title="' '" :mode="'date'" :value="params.visitDateTime" :end="endTime" placeholder="请选择就诊时间" :change="dChangeFn" />
                        <span v-if="!params.visitDateTime" class="hint">请选择就诊时间</span>
                    </div>
                </div>
            </li>
            <li class="noArrow">
                <div class="wrap">
                    <span>就诊医院</span>
                    <div class="rightContent">
                        <input v-model.lazy="params.orgFullName" placeholder="请输入就诊医院" />
                    </div>
                </div>
            </li>
            <li :class="{noArrow:type!='homeVisit'}">
                <div class="wrap">
                    <span>就诊科室</span>
                    <div :class="{rightContent:true,tap:type=='homeVisit'}" @click="toDeptList">
                        <span v-if="params.deptRegId" class="text">{{params.deptRegName}}</span>
                        <span v-else class="hint">请选择就诊科室</span>
                    </div>
                </div>
            </li>
            <li>
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
            <li v-if="params.isConfirmed=='0'" class="tap">
                <div class="wrap">
                    <span>确诊诊断</span>
                    <div class="rightContent tap" @click="toSelectVisitRecord">
                        <span v-if="params.diagnoseCode" class="text">{{params.diagnoseName}}</span>
                        <span v-else class="hint">请选择确诊诊断</span>
                    </div>
                </div>
            </li>
        </ul>
        <div class="buttonWrap">
            <button type="button" @click="nextStep">下一步</button>
        </div>
    </div>
</template>
<script>
import vm from 'src/main';
import pickerWrap from 'components/pickerWrap';
import { wxToasts, dateFormat0 } from 'js/yydjs';

export default {
    data() {
        return {
            params: {
                orgFullName: '佛山南海区人民医院',
                deptRegId: '',
                deptRegName: '',
                revisitDeptName: '',
                standardDeptId: '',
                standardDeptName: '',
                visitDateTime: '',
                diagnoseCode: '',
                diagnoseName: '',
                isConfirmed: '1',
            },
            type: '',

            endTime: dateFormat0(new Date(), 'yyyy-MM-dd'),
        };
    },

    onLoad() {
        vm.$on('deptFilterClick', this.deptFilterClickFn);
        vm.$on('visitRecordListSelectVisitRecord', this.visitRecordListSelectVisitRecordFn);
    },

    onShow() {
        this.getQuery();
    },

    onHide() { //为保证每次离开都触发，需写在leaveFn
        this.leaveFn();
    },

    onUnload() { //为保证每次离开都触发，需写在leaveFn
        vm.$off('deptFilterClick', this.deptFilterClickFn);
        this.leaveFn();
    },

    methods: {
        leaveFn() { //onHide和onUnload只会触发一个，如果是onHide可能需要重置data属性

        },
        setParams(params = {}, isReplace = false) {
            for (let key in params) {
                if (!this.params[key] || isReplace) {
                    this.params[key] = params[key];
                }
            }
        },
        getQuery() {
            let { type, orgFullName, standardDeptId, revisitDeptName } = this.$router.query;

            this.type = type;
            this.setParams({
                orgFullName,
                deptRegId: standardDeptId,
                deptRegName: revisitDeptName,
                revisitDeptName,
                standardDeptId,
                standardDeptName: revisitDeptName,
                visitDateTime: dateFormat0(new Date(), 'yyyy-MM-dd'),
            });
        },
        deptFilterClickFn(params) {
            let { item1, index1, item2, index2 } = params;
            let { stardardDeptName: stardardDeptName1 } = item1;
            let { stardardDeptName: stardardDeptName2, stardardDeptId: standardDeptId } = item2;
            let stardardDeptName = stardardDeptName1 != stardardDeptName2 ? stardardDeptName1 + stardardDeptName2 : stardardDeptName1;

            this.setParams({
                deptRegId: standardDeptId,
                deptRegName: stardardDeptName2,
                revisitDeptName: stardardDeptName2,
                standardDeptId,
                standardDeptName: stardardDeptName2,
            }, true);
        },
        visitRecordListSelectVisitRecordFn(params) {
            let { item } = params;
            let { icdCode, icdName } = item;

            this.setParams({
                diagnoseCode: icdCode,
                diagnoseName: icdName,
            }, true);
        },
        dChangeFn(changeArray) {
            let res = changeArray(this, 'date');
            let { value } = res.detail;

            this.params.visitDateTime = value;
        },
        radioChange(ev) {
            let { value } = ev.mp.detail;

            this.params.isConfirmed = value;
        },
        toDeptList() {
            if (this.$router.query.type != 'homeVisit') return;
            this.$router.navigate('/package/main/deptList/deptList');
        },
        toSelectVisitRecord() {
            this.$router.navigate('/package/main/myCaseHistory/selectVisitRecord');
        },
        nextStep() {
            let { visitDateTime, orgFullName, deptRegId, isConfirmed, diagnoseCode } = this.params;
            if (isConfirmed == '1') {
                this.params.diagnoseCode = '';
                this.params.diagnoseName = '';
            }
            let arr = [
                { if: !visitDateTime, hint: '请选择就诊时间' },
                { if: !orgFullName, hint: '请输入就诊医院' },
                { if: !deptRegId, hint: '请选择就诊科室' },
                { if: isConfirmed == '0' && !diagnoseCode, hint: '请选择确诊诊断' },
            ];

            wxToasts(arr, () => {
                setTimeout(() => {
                    let { orgFullName, deptRegId, deptRegName, visitDateTime, diagnoseCode, diagnoseName, revisitDeptName, standardDeptId, standardDeptName } = this.params;
                    let query = Object.assign({}, this.$router.query, { orgFullName, deptRegId, deptRegName, visitDateTime, diagnoseCode, diagnoseName, revisitDeptName, standardDeptId, standardDeptName });

                    this.$router.redirect({
                        path: '/package/main/doctorHome/addInfoVisit',
                        query,
                    });
                }, 300);
            });
        },
    },

    components: {
        pickerWrap,
    },
}

</script>
<style lang="scss" scoped>
@import '~css/public.scss';

.addMedicaRecords {
    @include styleInit;
    /deep/ & {
        min-height: 100vh;
        background-color: $bg;
        .infoList {
            @include infoList1('../../../');
        }
        .buttonWrap {
            @include buttonWrap;
        }
    }
}

</style>

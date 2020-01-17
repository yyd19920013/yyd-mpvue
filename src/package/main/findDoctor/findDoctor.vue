<template>
    <div :class="{findDoctor:true,filterWrapNoArrow1:standardDeptId}">
        <filterWrap :dataList="dataList" @componentClick="componentClickFn" />
        <sortFilter :show.sync="showSortFilter" @componentClick="sortFilterClickFn" />
        <typeLevelFilter :show.sync="showTypeLevelFilter" :type="type" :itemCode="itemCode" @componentClick="typeLevelFilterClickFn" />
        <doctorList :type="type" @componentClick="doctorListClickFn" />
    </div>
</template>
<script>
import vm from 'src/main';
import filterWrap from 'components/filterWrap';
import sortFilter from 'components/sortFilter';
import typeLevelFilter from 'components/typeLevelFilter';
import doctorList from 'components/doctorList';
import { copyJson } from 'js/yydjs';

export default {
    data() {
        return {
            dataList: ['科室', '综合排序', '筛选'],
            showSortFilter: false,
            showTypeLevelFilter: false,
            showSourceNumber: false,
            itemCode: '',
            params: {
                standardDeptId: '',
                onlineType: '', // 01  图文问诊 02 视频问诊 04复诊配药
                doctorLevel: '',
                sortType: '', // 排序类型  默认按职称排序，  1为接诊量
            },
            type: '',
            standardDeptId: '',
        };
    },

    onLoad() {
        vm.$on('deptFilterClick', this.deptFilterClickFn);
        vm.$on('selectSourceNumberSelectTime', this.selectSourceNumberSelectTime);
    },

    onShow() {
        vm.$emit('doctorListSetInnerParams', this.params);
        this.delayGetQuery();
    },

    onHide() { //为保证每次离开都触发，需写在leaveFn
        this.leaveFn();
    },

    onUnload() { //为保证每次离开都触发，需写在leaveFn
        vm.$off('deptFilterClick', this.deptFilterClickFn);
        vm.$off('selectSourceNumberSelectTime', this.selectSourceNumberSelectTime);
        this.leaveFn();
    },

    methods: {
        leaveFn() { //onHide和onUnload只会触发一个，如果是onHide可能需要重置data属性

        },
        delayGetQuery() {
            let { type, itemCode, standardDeptId, standardDeptName } = this.$router.query;

            setTimeout(() => {
                this.type = type;
                this.itemCode = itemCode;
                if (standardDeptId) {
                    let dataList = copyJson(this.dataList);

                    this.standardDeptId = standardDeptId;
                    this.params.standardDeptId = standardDeptId;
                    dataList[0] = standardDeptName;
                    this.dataList = dataList;
                    this.updateList();
                }
            }, 600);
        },
        updateList() {
            vm.$emit('doctorListSetInnerParams', this.params);
            vm.$emit('doctorListGetFilterList');
        },
        componentClickFn(params) {
            let { item, index } = params;
            let { showSortFilter, showTypeLevelFilter } = this;
            console.log(11111, item, index);
            this.showSortFilter = false;
            this.showTypeLevelFilter = false;
            switch (index) {
                case 0:
                    let { standardDeptId } = this.$router.query;

                    if (standardDeptId) return;
                    this.$router.navigate('/package/main/deptList/deptList');
                    break;
                case 1:
                    this.showSortFilter = !showSortFilter;
                    break;
                case 2:
                    this.showTypeLevelFilter = !showTypeLevelFilter;
                    break;
            }
        },
        deptFilterClickFn(params) {
            let { item1, index1, item2, index2 } = params;
            let { stardardDeptName: stardardDeptName1 } = item1;
            let { stardardDeptName: stardardDeptName2, stardardDeptId: standardDeptId } = item2;
            let stardardDeptName = stardardDeptName1 != stardardDeptName2 ? stardardDeptName1 + stardardDeptName2 : stardardDeptName1;
            let dataList = [].concat(this.dataList);

            dataList[0] = stardardDeptName2;
            this.dataList = dataList;
            this.params.standardDeptId = standardDeptId;
            console.log(11111, params);
        },
        sortFilterClickFn(params) {
            let { item, index } = params;
            let { name, sortType } = item;
            let dataList = [].concat(this.dataList);

            dataList[1] = name;
            this.dataList = dataList;
            this.params.sortType = sortType;
            this.updateList();
            console.log(22222, params);
        },
        typeLevelFilterClickFn(params) {
            let { item1, index1, item2, index2 } = params;
            let { name: name1, onlineType } = item1;
            let { name: name2, doctorLevel } = item2;
            let name = name1 != name2 ? name1 + name2 : name1;
            let dataList = [].concat(this.dataList);

            dataList[2] = name;
            this.dataList = dataList;
            this.params.onlineType = onlineType;
            this.params.doctorLevel = doctorLevel;
            this.updateList();
            console.log(33333, params);
        },
        doctorListClickFn(params) {
            let { type } = this;

            if (type == 'homeConsult') {
                let { item, index } = params;
                let { id, doctorName, doctorId, deptName, deptId, orgId } = item;
                let query = Object.assign({}, this.$router.query, {
                    id,
                    doctorName,
                    doctorId,
                    deptName,
                    deptId,
                    orgId,
                });

                this.$router.navigate({
                    path: '/package/main/doctorHome/addInfo',
                    query,
                });
            } else if (type == 'homeVisit') {
                let { item: detail, index } = params;
                let { id, doctorOnlineItems = {} } = detail;
                let serviceItem = doctorOnlineItems.filter((item) => item.itemCode == '04')[0] || {};
                let emitParams = Object.assign({}, params, {
                    detail,
                    serviceItem,
                });

                console.log(44444444, emitParams);
                vm.$emit('findDoctorSelectTime', emitParams);
                this.$router.back(1);
            }
        },
    },

    components: {
        filterWrap,
        sortFilter,
        typeLevelFilter,
        doctorList,
    },
}

</script>
<style lang="scss" scoped>
@import '~css/public.scss';

.findDoctor {
    @include styleInit;
    /deep/ & {
        &.filterWrapNoArrow1 {
            .dataList {
                li {
                    &:first-of-type {
                        .imgWrap {
                            display: none;
                        }
                    }
                }
            }
        }
        .doctorList {
            width: 100%;
            height: 100vh;
            position: absolute;
            left: 0;
            top: 0;
            border-top: 100rpx solid transparent;
            overflow: hidden;
        }
    }
}

</style>

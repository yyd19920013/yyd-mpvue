<template>
    <div class="basicHealthInfo">
        <template v-if="resultDicList.length">
            <ul class="healthInfoList">
                <li v-for="(item,index) in resultDicList" :key="index">
                    <div class="title">
                        {{titleList[index].title}}
                    </div>
                    <div class="labelList">
                        <span v-for="(item1,index1) in item" :key="index1" :class="{active:item1.isChecked}" @click="clickFn(index,item1,index1)">{{item1.text}}</span>
                    </div>
                    <div v-if="!(item[0].key=='99'&&item[0].isChecked)" class="textareaWrap">
                        <textarea :disabled="item[0].key=='99'&&item[0].isChecked" v-model.lazy="params[titleList[index].input]" :placeholder="titleList[index].placeholder"></textarea>
                    </div>
                </li>
            </ul>
            <div class="buttonWrap">
                <button type="button" @click="submitFn">保存</button>
            </div>
        </template>
    </div>
</template>
<script>
import vm from 'src/main';
import { wxToast, wxToasts } from 'js/yydjs';
import { findDic, saveHealthinfoAndSpecial, getHealthinfoAndSpecialByMpiId } from 'services';

export default {
    data() {
        return {
            dicList: [],
            params: {
                id: '', //id 修改的时候传
                foodAllergy: '', //食物/接触物过敏的对应文本
                medicalAllergy: '', //药物过敏的对应文本
                familyDiseaseHistory: '', //家族病史的对应文本
                operationOrTrauma: '', //手术或外伤的对应文本
                foodAllergyCodes: '', //食物/接触物过敏 多个|隔开  对应字典
                medicalAllergyCodes: '', //食物/接触物过敏 多个|隔开 对应字典
                familyDiseaseHistoryCodes: '', //食物/接触物过敏 多个|隔开 对应字典
                operationOrTraumaCodes: '', //食物/接触物过敏 多个|隔开 对应字典
                foodAllergyInput: '', //食物/接触物过敏的补充
                medicalAllergyInput: '', //药物过敏的补充
                familyDiseaseHistoryInput: '', //家族病史的补充
                operationOrTraumaInput: '', //手术或外伤的补充
                mpiId: '' //在hcn租户（即大c端）使用  outId 和mpiId传一个就行
            },
            params1: {
                mpiId: '',
                jhbHaved: 0, //既往是否患过结核病：0否 1是
                drugAccordingRule: 0, //是否按规定服药：0否 1是
                jhbPatientContracted: 0, //是否与结核病患者有密切接触：0否 1是
                ygHaved: 0, //是否患有乙肝：0否 1是
            },
            arrCodes: [
                [],
                [],
                [],
                [],
            ],

            titleList: [{
                    title: '药物过敏',
                    placeholder: '可输入补充你的药物过敏',
                    input: 'medicalAllergyInput',
                },
                {
                    title: '食物/接触物过敏',
                    placeholder: '可输入补充你的食物或接触物过敏',
                    input: 'foodAllergyInput',
                },
                {
                    title: '家族病史',
                    placeholder: '可输入补充你的家族病史',
                    input: 'familyDiseaseHistoryInput',
                },
                {
                    title: '手术或外伤',
                    placeholder: '可输入补充你的手术或外伤',
                    input: 'operationOrTraumaInput',
                },
            ],
        };
    },

    computed: {
        resultDicList() {
            let { arrCodes } = this;
            let result = this.dicList.map((item, index) => {
                let { items } = item;
                let arr = arrCodes[index];

                items = items.map((item1, index1) => {
                    let { key } = item1;

                    item1.isChecked = !!~arr.indexOf(key);
                    return item1;
                });
                return items;
            });

            return result;
        },
        dicJson() {
            let { resultDicList } = this;
            let resultList = [];
            let resultJson = {};

            for (let item of resultDicList) {
                resultList = [].concat(resultList, item);
            }
            for (let item of resultList) {
                let { key, text } = item;

                resultJson[key] = text;
            }
            return resultJson;
        },
    },

    onShow() {
        this.findDicFn();
        this.getHealthinfoAndSpecialByMpiIdFn();
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
        getCodeToTextStr(codes = [], input) {
            let { dicJson } = this;
            let result = [];

            result = codes.map((item) => dicJson[item]);
            if (input) result.push(input);
            return result.join('|');
        },
        findDicFn() {
            let params = ['cfs.dic.ih_medicalAllergy', 'cfs.dic.ih_foodAllergy', 'cfs.dic.ih_familyDiseaseHistory', 'cfs.dic.ih_operationOrTrauma'];

            findDic([params], (res) => {
                if (res.body) {
                    this.dicList = res.body;
                }
            });
        },
        getHealthinfoAndSpecialByMpiIdFn() {
            let { mpiId } = this.$router.query;

            getHealthinfoAndSpecialByMpiId([mpiId], (res) => {
                if (res.body) {
                    let { healthinfo = {} } = res.body;
                    let { medicalAllergyCodes = '', foodAllergyCodes = '', familyDiseaseHistoryCodes = '', operationOrTraumaCodes = '', foodAllergyInput = '', medicalAllergyInput = '', familyDiseaseHistoryInput = '', operationOrTraumaInput = '' } = healthinfo;
                    let arrCodes = [];

                    arrCodes[0] = medicalAllergyCodes ? medicalAllergyCodes.split('|') : [];
                    arrCodes[1] = foodAllergyCodes ? foodAllergyCodes.split('|') : [];
                    arrCodes[2] = familyDiseaseHistoryCodes ? familyDiseaseHistoryCodes.split('|') : [];
                    arrCodes[3] = operationOrTraumaCodes ? operationOrTraumaCodes.split('|') : [];
                    this.arrCodes = arrCodes;
                    console.log(1111111111111, this.arrCodes);
                    healthinfo.medicalAllergyInput = medicalAllergyInput;
                    healthinfo.foodAllergyInput = foodAllergyInput;
                    healthinfo.familyDiseaseHistoryInput = familyDiseaseHistoryInput;
                    healthinfo.operationOrTraumaInput = operationOrTraumaInput;
                    this.params = healthinfo;
                }
            });
        },
        clickFn(index, item1, index1) {
            let { key } = item1;
            let posIndex1 = this.arrCodes[index].indexOf(key);

            if (~posIndex1) {
                this.arrCodes[index].splice(posIndex1, 1);
            } else {
                this.arrCodes[index].push(key);
            }
            let posIndex2 = this.arrCodes[index].indexOf('99');

            if (~posIndex2) {
                let inputName = this.titleList[index].input;

                this.arrCodes[index].splice(0, this.arrCodes[index].length);
                this.arrCodes[index].push('99');
                this.params[inputName] = '';
            }
        },
        submitFn() {
            setTimeout(() => {
                let { mpiId } = this.$router.query;
                let { arrCodes } = this;
                let { foodAllergyInput, medicalAllergyInput, familyDiseaseHistoryInput, operationOrTraumaInput } = this.params;

                this.params.mpiId = mpiId;
                this.params.medicalAllergyCodes = arrCodes[0].join('|');
                this.params.foodAllergyCodes = arrCodes[1].join('|');
                this.params.familyDiseaseHistoryCodes = arrCodes[2].join('|');
                this.params.operationOrTraumaCodes = arrCodes[3].join('|');

                this.params.medicalAllergy = this.getCodeToTextStr(arrCodes[0], medicalAllergyInput);
                this.params.foodAllergy = this.getCodeToTextStr(arrCodes[1], foodAllergyInput);
                this.params.familyDiseaseHistory = this.getCodeToTextStr(arrCodes[2], familyDiseaseHistoryInput);
                this.params.operationOrTrauma = this.getCodeToTextStr(arrCodes[3], operationOrTraumaInput);
                this.params1.mpiId = mpiId;
                console.log(1111111111, arrCodes, this.params);
                let arr = [
                    { if: !this.params.medicalAllergy, hint: '请完善药物过敏信息' },
                    { if: !this.params.foodAllergy, hint: '请完善食物/接触物过敏信息' },
                    { if: !this.params.familyDiseaseHistory, hint: '请完善家族病史信息' },
                    { if: !this.params.operationOrTrauma, hint: '请完善手术或外伤信息' },
                ];

                wxToasts(arr, () => {
                    saveHealthinfoAndSpecial([this.params, this.params1], (res) => {
                        if (res.body) {
                            let healthId = res.body;
                            let { foodAllergy, medicalAllergy, familyDiseaseHistory, operationOrTrauma } = this.params;
                            let healthInfo = [];

                            if (medicalAllergy) healthInfo.push(medicalAllergy);
                            if (foodAllergy) healthInfo.push(foodAllergy);
                            if (familyDiseaseHistory) healthInfo.push(familyDiseaseHistory);
                            if (operationOrTrauma) healthInfo.push(operationOrTrauma);
                            console.log('32222', healthInfo);
                            healthInfo = healthInfo.join(';');
                            wxToast('保存健康信息成功');
                            vm.$emit('basicHealthInfoSubmit', {
                                healthId,
                                healthInfo,
                            });
                            this.$router.back(1);
                        }
                    });
                });
            }, 300);
        },
    },

    components: {

    },
}

</script>
<style lang="scss" scoped>
@import '~css/public.scss';

.basicHealthInfo {
    @include styleInit;
    /deep/ & {
        background-color: $bg;
        .healthInfoList {
            li {
                padding: 15rpx $padding1;
                margin-bottom: 20rpx;
                background-color: #fff;
                .title {
                    line-height: 60rpx;
                }
                .labelList {
                    @include labelList;
                }
                .textareaWrap {
                    height: 120rpx;
                    padding: 15rpx;
                    border: $border1;
                    textarea {
                        height: 100%;
                    }
                }
            }
        }
        .buttonWrap {
            @include buttonWrap;
        }
    }
}

</style>

<template>
    <div class="home">
        <swiperWrap
            :dataList="[
                {
                    src:'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
                    link:'../user/user',
                },
                {
                    src:'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
                    link:'../user/user',
                },
                {
                    src:'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
                    link:'../user/user',
                },
            ]"
        >
            <div>111111111111111</div>
        </swiperWrap>

        <pickerWrap
            :mode="'selector'"
            :range="['美国','中国','巴西','日本']"
            :value="index1"
            :change="changeFn1"
        />

        <pickerWrap
            :mode="'selector'"
            :range="[{id:0,name:'美国'},{id:1,name:'中国'},{id:2,name:'巴西'},{id:3,name:'日本'}]"
            :value="index11"
            :change="changeFn11"
        />

        <pickerWrap
            :mode="'multiSelector'"
            :range="[['无脊柱动物','脊柱动物'],['扁性动物','线形动物','环节动物','软体动物','节肢动物'],['猪肉绦虫','吸血虫']]"
            :value="arrIndex2"
            :change="changeFn2"
        />

        <pickerWrap
            :mode="'multiSelector'"
            :range="gangedArr"
            :value="gangedArrIndex"
            :ganged="true"
            :change="gChangeFn"
            :cancel="gCancelFn"
            :columnchange="gColumnchangeFn"
        />

        <pickerWrap
            :mode="'time'"
            :value="time"
            :change="tChangeFn"
        />

        <pickerWrap
            :mode="'date'"
            :value="date"
            :change="dChangeFn"
        />

        <pickerWrap
            :mode="'region'"
            :value="region"
            :change="rChangeFn"
        />

        <div @click="clickFn">跳转</div>
    </div>
</template>

<script>
import swiperWrap from 'components/swiperWrap';
import pickerWrap from 'components/pickerWrap';
import {wxGetLocation,resetData,copyJson,wxToast} from 'js/yydjs';
import {testAxios} from 'services';

const resetDataFn=resetData({
    dataList:[],
    index1:0,
    index11:0,
    arrIndex2:[],
    arrIndex22:[],
    gangedArr:[],
    gangedArrIndex:[],
    time:'',
    date:'',
    region:[],
});

export default{
    data(){
        return resetDataFn.data;
    },

    onHide(){
        //重置data
        resetDataFn.reset(this);
    },

    onShow(){
        testAxios([],(res)=>{
            console.log(res);
        });

        let gangedArr=[];
        this.mockGangedArr(null,(res)=>{
            gangedArr.push(res);
            this.mockGangedArr(gangedArr[0][0].id,(res1)=>{
                gangedArr.push(res1);
                this.mockGangedArr(gangedArr[1][0].id,(res2)=>{
                    gangedArr.push(res2);
                    this.gangedArr=gangedArr;
                });
            });
        });

        wxGetLocation({
            success(res,detail){
                console.log(res,detail);
            },
        });

        wxToast('提示');
    },

    methods:{
        clickFn(){
            wx.navigateTo({
                url:'../test/test',
            });
        },
        changeFn1(changeValue){
            let res=changeValue(this,'index1');

            console.log(res);
        },
        changeFn11(changeValue){
            let res=changeValue(this,'index11');

            console.log(res);
        },
        changeFn2(changeValue){
            let res=changeValue(this,'arrIndex2');

            console.log(res);
        },
        changeFn22(changeValue){
            let res=changeValue(this,'arrIndex22');

            console.log(res);
        },
        mockGangedArr(id,endFn){
            let arr=[];

            switch(id){
                case '1':
                        arr=[{id:'1-1',name:'扁性动物'},{id:'1-2',name:'线性动物'}];
                    break;
                case '1-1':
                        arr=[{id:'1-1-1',name:'猪肉绦虫'},{id:'1-1-2',name:'吸血虫'},{id:'1-1-3',name:'尸蟞'}];
                    break;
                case '1-2':
                        arr=[{id:'1-2-1',name:'蛔虫'},{id:'1-2-2',name:'线虫'}];
                    break;
                case '2':
                        arr=[{id:'2-1',name:'鱼'},{id:'2-2',name:'两栖动物'}];
                    break;
                case '2-1':
                        arr=[{id:'2-1-1',name:'鲫鱼'},{id:'2-1-2',name:'带鱼'}];
                    break;
                case '2-2':
                        arr=[{id:'2-2-1',name:'青蛙'},{id:'2-2-2',name:'娃娃鱼'}];
                    break;
                default:
                        arr=[{id:'1',name:'无脊柱动物'},{id:'2',name:'脊柱动物'}];
            }

            setTimeout(()=>{
                endFn&&endFn(arr);
            },100);
        },
        gChangeFn(changeValue){
            let res=changeValue(this,'gangedArrIndex','gangedArr');

            console.log(res);
        },
        gCancelFn(cancelValue){
            cancelValue(this,'gangedArrIndex','gangedArr');
        },
        gColumnchangeFn(changeArray){
            changeArray(this,'gangedArrIndex','gangedArr',3,this.mockGangedArr);
        },
        tChangeFn(changeArray){
            let res=changeArray(this,'time');

            console.log(res);
        },
        dChangeFn(changeArray){
            let res=changeArray(this,'date');

            console.log(res);
        },
        rChangeFn(changeArray){
            let res=changeArray(this,'region');

            console.log(res);
        },
    },

    components:{
        swiperWrap,
        pickerWrap,
    },
}
</script>

<style lang="scss" scoped>
    .home{

    }
</style>

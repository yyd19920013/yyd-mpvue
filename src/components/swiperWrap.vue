<template>
    <div class="swiperWrap">
        <swiper
            class="swiper"
            :indicator-dots="showDot"
            :indicator-color="dotColor"
            :indicator-active-color="dotActiveColor"
            :autoplay="auto"
            :interval="interval"
            :duration="duration"
            :style="{
                width:cWidth,
                height:height+'rpx',
            }"
        >
            <block
                v-for="(item,index) in dataList"
                :key="index"
            >
                <swiper-item>
                    <img
                        class="img"
                        @click="clickImg(item,index)"
                        :style="{
                            width:cWidth,
                            height:height+'rpx',
                            backgroundImage:'url('+item.src+')',
                        }"
                    />
                </swiper-item>
            </block>
        </swiper>
    </div>
</template>

<script>
import {resetData} from 'js/yydjs';

const resetDataFn=resetData({

});

export default{
    data(){
        return resetDataFn.data;
    },

    computed:{
        cWidth(){
            return this.width?`${this.width}rpx;`:'';
        },
    },

    /*
        例子：
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
        />
    */

    props:{
        dataList:{//必填
            type:Array,
            required:true,
            default:()=>[],
        },
        click:()=>{},//点击图片触发的函数
        showDot:{//是否显示圆点
            type:Boolean,
            default:true,
        },
        dotColor:{//圆点的颜色
            type:String,
            default:'rgba(255,255,255,0.3)',
        },
        dotActiveColor:{//圆点选中时候的颜色
            type:String,
            default:'rgba(255,255,255,1)',
        },
        auto:{//是否自动播放
            type:Boolean,
            default:true,
        },
        interval:{//自动播放间隔时间
            type:Number,
            default:3000,
        },
        duration:{//滚动持续时间
            type:Number,
            default:500,
        },
        width:{//轮播图宽度
            type:Number,
            default:0,
        },
        height:{//轮播图高度
            type:Number,
            default:150,
        },
    },

    onHide(){
        //重置data
        resetDataFn.reset(this);
    },

    onLoad(){

    },

    methods:{
        clickImg(item,index){
            if(item.link){
                wx.navigateTo({
                    url:item.link,
                });
            }

            this.click&&this.click(item,index);
        },
    },
}
</script>

<style lang="scss" scoped>
    .swiperWrap{
        .swiper,.img{
            width: 100%;
        }
        .img{
            background: url('') no-repeat center top;
            background-size: cover;
        }
    }
</style>

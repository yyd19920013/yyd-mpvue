<template>
    <header class="nimHeader">
        <div class="nimHeaderWrap">
            <a class="arrow" @click="closePage">
            </a>
            <h2 class="title overflow">{{title}}</h2>
        </div>
    </header>
</template>
<script>
import { resetData } from 'js/yydjs';

const resetDataFn = resetData({ //需要重置的data属性
    isEnter: false,
});
export default {
    data() {
        return Object.assign({}, resetDataFn.data, {

        });
    },

    /*
        <nimHeader
            :controlPageName="'nimLogin'"
            :title="'登录'"
        />
    */

    props: {
        controlPageName: {
            required: true,
            type: String,
            default: '',
        },
        title: {
            type: String,
            default: '标题',
        },
    },

    onLoad() { //为保证每次进入都触发，需写在enterFn
        this.enterFn();
    },

    onShow() { //为保证每次进入都触发，需写在enterFn
        this.enterFn();
    },

    onHide() { //为保证每次离开都触发，需写在leaveFn
        this.leaveFn();
    },

    onUnload() { //为保证每次离开都触发，需写在leaveFn
        this.leaveFn();
    },

    methods: {
        enterFn() { //onLoad和onShow可能会一起触发，所以需要防止重复触发
            if (this.isEnter) return;
            this.isEnter = true;
        },
        leaveFn() { //onHide和onUnload只会触发一个，如果是onHide可能需要重置data属性
            resetDataFn.reset(this);
        },
        closePage() {
            let { controlPageName } = this;

            if (controlPageName) {
                wx.controlPage(controlPageName, false);
            }
        },
    },
}

</script>
<style lang="scss" scoped>
@import '~css/public.scss';

.nimHeader {
    width: 100%;
    height: 40px;
    line-height: 40px;
    border-bottom: 1px solid #ddd;
    background-color: #fff;
    position: fixed;
    left: 0;
    top: 0;
    z-index: 1000;
    .nimHeaderWrap {
        width: 100%;
        height: 100%;
        line-height: 40px;
        background-color: #fff;
        position: absolute;
        .arrow {
            width: 50px;
            padding: 5px 0;
            padding-left: 20px;
            height: 100%;
            position: absolute;
            left: 0;
            top: 0;
            z-index: 10;
            &:before {
                display: inline-block;
                content: "";
                width: 20px;
                height: 20px;
                border: 2px solid #999;
                border-right: none;
                border-bottom: none;
                transform: rotate3d(0, 0, 1, -45deg) scale(.8, .8);
            }
        }
        .title {
            padding: 0 50px;
            height: 100%;
            text-align: center;
        }
    }
}

</style>

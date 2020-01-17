<template>
    <div class="allEntrance">
        <div class="checkboxWrap">
            <h3>
                <checkbox-group @change="checkedChange">
                    <label>
                        <checkbox class="checkbox" value="auto" :checked="auto" />
                        <span>2秒后是否自动跳转浏览的历史页面</span>
                    </label>
                </checkbox-group>
            </h3>
            <h4>当前{{auto?'是':'不是'}}自动跳转</h4>
        </div>
        <div class="pageList">
            <span :class="{active:activeIndex==index}" v-for="(item,index) in pageList" :key="index" @click="clickFn(item,index)">{{item.config.navigationBarTitleText}}</span>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            timer: null,

            pageList: mpvueRouter,
            activeIndex: -1,
            auto: true,
        };
    },

    onLoad() {
        //this.$router.redirect('/package/main/imOrderDetail/imOrderDetail');
    },

    onShow() {
        //跳转存储中的路由
        this.navigateToStoreRouter();
    },

    onHide() { //为保证每次离开都触发，需写在leaveFn
        this.leaveFn();
    },

    onUnload() { //为保证每次离开都触发，需写在leaveFn
        clearTimeout(this.timer);
        this.leaveFn();
    },

    methods: {
        leaveFn() { //onHide和onUnload只会触发一个，如果是onHide可能需要重置data属性

        },
        checkedChange(ev) {
            let { value } = ev.mp.detail;

            this.auto = ~value.indexOf('auto') ? true : false;
            if (this.auto) {
                this.navigateToStoreRouter();
            } else {
                clearTimeout(this.timer);
            }
        },
        navigateTo(path) {
            if (!path) return;
            let switchArr = ['/pages/home/index', '/pages/user/index'];
            let api = ~switchArr.indexOf(path) ? 'switch' : 'navigate';

            this.$router[api](path);
        },
        clickFn(item, index) {
            let { path } = item;

            path = `/${path}`;
            this.activeIndex = index;
            wx.setStorageSync('activeRouter', {
                path,
                index,
            });
            this.navigateTo(path);
        },
        navigateToStoreRouter() {
            if (!this.auto) return;
            let router = wx.getStorageSync('activeRouter') || {};
            let { path, index } = router;

            console.log(router);
            // path = '/package/main/payment/payment?orderNo=1912270100000072';
            this.activeIndex = index;
            clearTimeout(this.timer);
            this.timer = setTimeout(() => {
                this.navigateTo(path);
            }, 2000);
        },
    },

    components: {

    },
}

</script>
<style lang="scss" scoped>
@import '~css/public.scss';

.allEntrance {
    @include styleInit;
    /deep/ & {
        .checkboxWrap {
            padding: 30rpx 0;
            line-height: 60rpx;
            text-align: center;
        }
        .pageList {
            @include labelList;
            padding: 60rpx;
        }
    }
}

</style>

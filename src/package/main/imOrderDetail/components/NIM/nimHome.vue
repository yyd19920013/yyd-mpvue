<template>
    <div class="nimHome">
        <div class="tab">
            <ol class="tabWrap">
                <li v-for="(item,index) in ['消息','联系人']" :key="index" :class="{
                        active:tabIndex==index,
                    }" @click="tabControl(index)">
                    {{item}}
                </li>
            </ol>
            <a class="logout" @click="logout">登出</a>
        </div>
        <div class="nimMessageListWrap wrapContainer" v-show="pageControl.nimMessageList">
            <nimMessageList />
        </div>
        <div class="nimAddressListWrap wrapContainer" v-show="pageControl.nimAddressList">
            <nimAddressList />
        </div>
        <div class="nimChatWrap wrapContainer" v-show="pageControl.nimChat">
            <nimChat />
        </div>
        <div class="nimSearchFriendWrap wrapContainer" v-show="pageControl.nimSearchFriend">
            <nimSearchFriend />
        </div>
        <div class="nimCreateTeamWrap wrapContainer" v-show="pageControl.nimCreateTeam">
            <nimCreateTeam />
        </div>
        <div class="nimLoginWrap wrapContainer" v-show="pageControl.nimLogin">
            <nimLogin />
        </div>
        <nimVideoCall />
    </div>
</template>
<script>
import nimLogin from './nimLogin';
import nimMessageList from './nimMessageList';
import nimAddressList from './nimAddressList';
import nimChat from './nimChat';
import nimSearchFriend from './nimSearchFriend';
import nimCreateTeam from './nimCreateTeam';
import nimVideoCall from './nimVideoCall';
import nimInit from './nimInit';
import vm from 'src/main';
import { resetData, lStore, wxToast } from 'js/yydjs';

const resetDataFn = resetData({ //需要重置的data属性
    isEnter: false,
});

export default {
    data() {
        let pageControl = lStore.get('pageControl');

        if (!pageControl) {
            pageControl = {};
            pageControl.nimLogin = false;
            pageControl.nimMessageList = true;
            pageControl.nimAddressList = false;
            pageControl.nimChat = false;
            pageControl.nimSearchFriend = false;
            pageControl.nimCreateTeam = false;
        }

        return Object.assign({}, resetDataFn.data, {
            pageControl: {
                nimLogin: pageControl.nimLogin,
                nimMessageList: pageControl.nimMessageList,
                nimAddressList: pageControl.nimAddressList,
                nimChat: pageControl.nimChat,
                nimSearchFriend: pageControl.nimSearchFriend,
                nimCreateTeam: pageControl.nimCreateTeam,
            },
            tabIndex: pageControl.nimMessageList ? 0 : 1,
        });
    },

    /*

    */

    props: {

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

            //挂载控制页面关闭的方法在wx下
            wx.controlPage = this.controlPage;

            //判断im是否需要登录
            this.judgeLogin();
        },
        leaveFn() { //onHide和onUnload只会触发一个，如果是onHide可能需要重置data属性
            resetDataFn.reset(this);
        },
        savePageStatus() {
            lStore.set('pageControl', this.pageControl);
        },
        controlPage(controlName, show) {
            this.pageControl[controlName] = show;

            if (lStore.get('nimAccount') && lStore.get('nimToken')) {
                vm.$emit('componentsUpdate', controlName);

                //保存页面显示的状态
                this.savePageStatus();
            }
        },
        judgeLogin() {
            console.log(lStore.get('nimAccount'));
            if (!lStore.get('nimAccount') || !lStore.get('nimToken')) {
                wxToast('请先登录');
                wx.controlPage('nimLogin', true);
            } else {
                nimInit();
            }
        },
        tabControl(index) {
            this.tabIndex = index;

            switch (index) {
                case 0:
                    wx.controlPage('nimAddressList', false);
                    wx.controlPage('nimMessageList', true);
                    break;
                case 1:
                    wx.controlPage('nimMessageList', false);
                    wx.controlPage('nimAddressList', true);
                    break;
            }
        },
        logout() {
            lStore.remove('nimAccount');
            lStore.remove('nimToken');
            wxToast('登出成功');
            wx.controlPage('nimLogin', 'nimLoginWrap', true);
        },
    },

    components: {
        nimLogin,
        nimMessageList,
        nimAddressList,
        nimChat,
        nimSearchFriend,
        nimCreateTeam,
        nimVideoCall,
    },
}

</script>
<style lang="scss">
@import '~css/public.scss';

.nimHome {
    height: 100vh;
    border-top: 40px solid transparent;
    background-color: #fff;
    position: relative;
    overflow: hidden;
    .scrollContainer {
        width: 100%;
        height: 100%;
        background-color: #fff;
        position: absolute;
        left: 0;
        top: 0;
        overflow: hidden;
    }
    .wrapContainer {
        width: 100%;
        height: 100%;
        background-color: #fff;
        position: absolute;
        left: 0;
        top: 0;
        &.nimLoginWrap {
            position: fixed;
            z-index: 100;
        }
    }
    .content {
        padding: 0 20px;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
    }

    .tab {
        display: flex;
        width: 100%;
        height: 40px;
        line-height: 40px;
        background-color: #fff;
        border-bottom: 1px solid #ddd;
        text-align: center;
        position: fixed;
        left: 0;
        top: 0;
        z-index: 100;
        .tabWrap {
            flex: 1;
            li {
                float: left;
                width: 50%;
                border-right: 1px solid #ddd;
                &:last-of-type {
                    border-right: none;
                }
                &.active {
                    background-color: #33adff;
                    color: #fff;
                }
            }
        }
        .logout {
            width: 80px;
            border-left: 1px solid #ddd;
        }
    }
}

</style>

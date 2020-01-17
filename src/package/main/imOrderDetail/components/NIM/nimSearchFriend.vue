<template>
    <div class="nimSearchFriend">
        <nimHeader :controlPageName="'nimSearchFriend'" :title="'搜索好友'" />
        <div class="tab">
            <ol class="tabWrap">
                <li v-for="(item,index) in ['找人','找群']" :key="index" :class="{
                        active:tabIndex==index,
                    }" @click="tabControl(index)">
                    {{item}}
                </li>
            </ol>
        </div>
        <section class="content scrollContainer">
            <div class="searchWrap">
                <input v-model.lazy="searchValue" type="text" :placeholder="tabIndex==0?'账号':'群号'" />
                <button type="button" @click="searchFn">
                    搜索
                </button>
            </div>
            <ul class="resultList">
                <li v-for="(item,index) in resultList" :key="index">
                    <div class="left">
                        <h3>{{item.account}}</h3>
                        <h4>{{item.nick}} 性别：{{item.gender}}</h4>
                    </div>
                    <a class="applyFriend" @click="applyFriend(item.account)">
                        加好友
                    </a>
                </li>
            </ul>
            <div v-show="showNoData" class="noData">
                暂无数据
            </div>
        </section>
    </div>
</template>
<script>
import vm from 'src/main';
import nimHeader from './nimHeader';
import { resetData, wxToast } from 'js/yydjs';

const resetDataFn = resetData({ //需要重置的data属性
    isEnter: false,
});

export default {
    data() {
        return {
            tabIndex: 0,
            searchValue: '',
            resultList: [],
            showNoData: false,
        }
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

            vm.$on('componentsUpdate', this.componentsUpdate);
        },
        leaveFn() { //onHide和onUnload只会触发一个，如果是onHide可能需要重置data属性
            resetDataFn.reset(this);

            vm.$off('componentsUpdate', this.componentsUpdate);
        },
        componentsUpdate(controlName) {
            if (controlName != 'nimSearchFriend') return;
            this.tabIndex = 0;
            this.searchValue = '';
            this.resultList = [];
            this.showNoData = false;
        },
        tabControl(index) {
            this.tabIndex = index;
        },
        searchFn() {
            let { tabIndex, searchValue } = this;

            this.showNoData = false;
            wx.nim[tabIndex == 0 ? 'getUsers' : 'getTeam']({
                [tabIndex == 0 ? 'accounts' : 'teamId']: tabIndex == 0 ? [searchValue] : searchValue,
                done: (error, users) => {
                    this.searchValue = '';
                    if (!error) {
                        this.resultList = users;
                        if (this.resultList == 0) {
                            this.showNoData = true;
                        }
                    } else {
                        wxToast(error);
                    }
                },
            });
        },
        applyFriend(account) {
            wx.nim.applyFriend({
                account,
                ps: '加个好友行吗？',
                done: (error, obj) => {
                    if (!error) {
                        wxToast('申请加好友成功');
                    } else {
                        wxToast(error);
                    }
                },
            });
        },
    },

    components: {
        nimHeader,
    },
}

</script>
<style lang="scss" scoped>
@import '~css/public.scss';

.nimSearchFriend {
    .tab {
        height: 40px;
        .tabWrap {
            width: 100%;
            height: 40px;
            line-height: 40px;
            border-bottom: 1px solid #ddd;
            text-align: center;
            position: absolute;
            left: 0;
            top: 40px;
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
    }
    .content {
        top: 80px;
        border-bottom: 80px solid transparent;
        .searchWrap {
            margin-top: 50px;
            padding-right: 50px;
            height: 30px;
            position: relative;
            input {
                width: 100%;
                height: 100%;
            }
            button {
                width: 60px;
                height: 28px;
                line-height: 28px;
                position: absolute;
                right: 0;
                top: 0;
                z-index: 10;
                font-size: 12px;
            }
        }
        .resultList {
            padding-top: 20px;
            li {
                padding: 10px 0;
                padding-right: 60px;
                border-bottom: 1px solid #ddd;
                line-height: 20px;
                position: relative;
                &:last-of-type {
                    border-bottom: none;
                }
                .left {
                    h4 {
                        color: #999;
                    }
                }
                .applyFriend {
                    width: 60px;
                    height: 100%;
                    line-height: 60px;
                    text-align: center;
                    color: #ff0000;
                    position: absolute;
                    right: 0;
                    top: 0;
                }
            }
        }
        .noData {
            height: 30px;
            line-height: 30px;
            text-align: center;
        }
    }
}

</style>

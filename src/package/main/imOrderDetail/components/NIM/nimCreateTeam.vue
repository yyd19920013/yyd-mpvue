<template>
    <div class="nimCreateTeam">
        <nimHeader :controlPageName="'nimCreateTeam'" :title="'创建群'" />
        <div class="tab">
            <ol class="tabWrap">
                <li v-for="(item,index) in ['普通群','高级群']" :key="index" :class="{
                        active:tabIndex==index,
                    }" @click="tabControl(index)">
                    {{item}}
                </li>
            </ol>
        </div>
        <section class="content scrollContainer">
            <ul class="createInfo">
                <li>
                    <span>群名称</span>
                    <div class="right">
                        <input v-model.lazy="name" type="text" placeholder="请输入群名称" />
                    </div>
                </li>
                <li v-show="tabIndex==1">
                    <span>群简介</span>
                    <div class="right">
                        <input v-model.lazy="intro" type="text" placeholder="请输入群简介" />
                    </div>
                </li>
                <li v-show="tabIndex==1">
                    <span>群公告</span>
                    <div class="right">
                        <input v-model.lazy="announcement" type="text" placeholder="请输入群公告" />
                    </div>
                </li>
            </ul>
            <ul class="friendsList">
                <li v-for="(item,index) in friendsList" :key="index">
                    <input v-model.lazy="accounts" :id="createId(index)" :value="item.account" type="checkbox" />
                    <span>{{item.account}}</span>
                    <label :for="createId(index)"></label>
                </li>
            </ul>
            <div v-show="showNoData" class="noData">
                暂无数据
            </div>
            <button class="createTeam" type="button" @click="createTeam">
                创建群
            </button>
        </section>
    </div>
</template>
<script>
import nimHeader from './nimHeader';
import vm from 'src/main';
import { resetData } from 'js/yydjs';

const resetDataFn = resetData({ //需要重置的data属性
    isEnter: false,
});

export default {
    data() {
        return Object.assign({}, resetDataFn.data, {
            tabIndex: 0,
            friendsList: [],
            showNoData: false,
            name: '',
            intro: '',
            announcement: '',
            accounts: [],
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

    onHide() {
        vm.$off('componentsUpdate', this.componentsUpdate);
        vm.$off('nimOnFriendsAll', this.getFriendsList);
    },

    methods: {
        enterFn() { //onLoad和onShow可能会一起触发，所以需要防止重复触发
            if (this.isEnter) return;
            this.isEnter = true;

            vm.$on('componentsUpdate', this.componentsUpdate);
            vm.$on('nimOnFriendsAll', this.getFriendsList);
        },
        leaveFn() { //onHide和onUnload只会触发一个，如果是onHide可能需要重置data属性
            resetDataFn.reset(this);
        },
        componentsUpdate(controlName) {
            if (controlName != 'nimCreateTeam') return;
            let { friends } = window.nimData;

            this.tabIndex = 0;
            this.showNoData = false;
            this.name = '';
            this.intro = '';
            this.announcement = '';
            this.friendsList = friends;
            this.accounts = [];
        },
        createId(index) {
            return `nimCreateTeam${index}`;
        },
        tabControl(index) {
            this.tabIndex = index;
        },
        getFriendsList(res) {
            this.friendsList = res;
            if (res.length == 0) {
                this.showNoData = true;
            }
        },
        createTeam() {
            let { tabIndex, accounts, name, intro, announcement } = this;

            wx.nim.createTeam({
                type: tabIndex == 0 ? 'normal' : 'advanced',
                name,
                avatar: 'avatar',
                accounts,
                intro,
                announcement,
                ps: `我建了一个${tabIndex==0?'普通群':'高级群'}`,
                done: (error, obj) => {
                    if (!error) {
                        window.nimData.teams.push(obj.team);
                        alert('创建群成功');
                        vm.$emit('componentsUpdate', 'nimAddressList');
                    } else {
                        alert(error);
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

.nimCreateTeam {
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
        .createInfo {
            padding-top: 50px;
            li {
                height: 30px;
                line-height: 30px;
                margin-bottom: 10px;
                span {
                    float: left;
                    width: 50px;
                }
                .right {
                    overflow: hidden;
                    padding-left: 10px;
                    input {
                        width: 100%;
                        height: 100%;
                    }
                }
            }
        }
        .friendsList {
            padding-top: 20px;
            li {
                padding: 10px 0;
                border-bottom: 1px solid #ddd;
                line-height: 20px;
                position: relative;
                overflow: hidden;
                span {
                    float: right;
                }
                label {
                    width: 100%;
                    height: 100%;
                    position: absolute;
                    left: 0;
                    top: 0;
                    z-index: 10;
                }
            }
        }
        .noData {
            height: 30px;
            line-height: 30px;
            text-align: center;
        }
        .createTeam {
            margin-top: 50px;
            width: 100%;
            height: 40px;
        }
    }
}

</style>

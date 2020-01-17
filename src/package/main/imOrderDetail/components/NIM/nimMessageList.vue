<template>
    <div class="nimMessageList">
        <div class="content scrollContainer">
            <ul class="messageList">
                <li v-if="item.lastMsg.from!=item.lastMsg.to" v-for="(item,index) in sessionList" :key="index">
                    <div class="left" @click="toChat(item.scene,item.lastMsg.target)">
                        <h3>
                            <span>{{item.lastMsg.target}}</span>
                            <em>{{dateFormat0(item.lastMsg.time,'yyyy-MM-dd hh:mm')}}</em>
                        </h3>
                        <h4>
                            <span v-if="item.lastMsg.type=='text'" class="overflow">
                                {{item.lastMsg.text}}
                            </span>
                            <span v-if="item.lastMsg.type=='custom'" class="overflow">
                                [自定义消息]
                            </span>
                            <span v-if="item.lastMsg.type=='file'" class="overflow">
                                [文件]
                            </span>
                            <em v-show="item.unread>0">{{item.unread}}</em>
                        </h4>
                    </div>
                    <a class="delete" @click="deleteSession(item.scene,item.lastMsg.target)">
                        删除
                    </a>
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
import vm from 'src/main';
import { resetData, dateFormat0, lStore } from 'js/yydjs';

const resetDataFn = resetData({ //需要重置的data属性
    isEnter: false,
});

export default {
    data() {
        return {
            sessionList: [],
            dateFormat0,
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

            vm.$on('nimOnSessionsAll', this.getSessionList);
        },
        leaveFn() { //onHide和onUnload只会触发一个，如果是onHide可能需要重置data属性
            resetDataFn.reset(this);

            vm.$off('nimOnSessionsAll', this.getSessionList);
        },
        getSessionList(res) {
            this.sessionList = res;
        },
        toChat(scene, to) {
            lStore.set('nimChat', {
                scene,
                to,
            });
            wx.controlPage('nimChat', true);
        },
        deleteSession(scene, to) {
            wx.nim.deleteSession({
                scene,
                to,
                done(error, obj) {
                    if (!error) {
                        alert('删除会话成功');
                    } else {
                        alert(error);
                    }
                },
            });
        },
    },
}

</script>
<style lang="scss" scoped>
@import '~css/public.scss';

.nimMessageList {
    .content {
        padding: 0;
        .messageList {
            li {
                padding: 10px 20px;
                line-height: 20px;
                border-bottom: 1px solid #ddd;
                position: relative;
                .left {
                    padding-right: 50px;
                    h3 {
                        overflow: hidden;
                        em {
                            float: right;
                            color: #999;
                            font-size: 12px;
                        }
                    }
                    h4 {
                        padding-right: 30px;
                        position: relative;
                        span {
                            display: block;
                        }
                        em {
                            width: 20px;
                            height: 20px;
                            line-height: 20px;
                            text-align: center;
                            border-radius: 50%;
                            background-color: #ff0000;
                            color: #fff;
                            font-size: 12px;
                            position: absolute;
                            right: 0;
                            top: 0;
                        }
                    }
                }
                .delete {
                    width: 60px;
                    height: 100%;
                    line-height: 60px;
                    border-left: 1px solid #ddd;
                    text-align: center;
                    color: #ff0000;
                    position: absolute;
                    right: 0;
                    top: 0;
                }
            }
        }
    }
}

</style>

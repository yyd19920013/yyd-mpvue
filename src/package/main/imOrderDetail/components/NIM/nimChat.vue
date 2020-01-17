<template>
    <div class="nimChat">
        <nimHeader :controlPageName="'nimChat'" :title="nimChat.to" />
        <section class="content scrollContainer">
            <scroll-view class="messageList" ref="messageList" id="messageList" :scroll-y="true" :scroll-top="scrollTop" @scroll="scrollLoad">
                <div :class="{
                        loadingWrap:true,
                        loading,
                        finished,
                    }">
                    <h3>
                        <span>正在加载中</span>
                    </h3>
                    <h4>
                        <span>加载完毕</span>
                    </h4>
                </div>
                <ul>
                    <li v-for="(item,index) in currentMsgList" :key="index">
                        <div class="title">
                            {{dateFormat0(item.time,'yyyy-MM-dd hh:mm')}}
                        </div>
                        <div class="main">
                            <div :class="{
                                    msgWrap:true,
                                    other:nimAccount!=item.from,
                                }">
                                <div class="nickName">
                                    {{item.fromNick}}
                                </div>
                                <div v-if="item.type=='text'" class="msg">
                                    {{item.text}}
                                </div>
                                <div v-if="item.type=='custom'" class="custom">
                                    <div v-if="item.content.type=='order'" class="order">
                                        <a :href="item.content.link">
                                            <div class="title">
                                                {{item.content.title}}
                                            </div>
                                            <div class="main">
                                                {{item.content.main}}
                                            </div>
                                        </a>
                                    </div>
                                </div>
                                <div class="file">
                                    <image v-if="item.type=='image'" :src="item.file.url" mode="widthFix" />
                                    <audio v-if="item.type=='audio'" :src="item.file.url" controls></audio>
                                    <video v-if="item.type=='video'" :src="item.file.url" controls></video>
                                    <div v-if="item.type=='file'" download="true" class="download" @click="downloadFn(item.file.url)">
                                        <h3>{{item.file.name}}</h3>
                                    </div>
                                </div>
                                <div v-if="item.attach">
                                    {{netcallMsgJson[item.attach.type]}}
                                </div>
                            </div>
                        </div>
                    </li>
                </ul>
            </scroll-view>
        </section>
        <footer class="footer">
            <div class="footerWrap">
                <div class="left">
                    <input v-model.lazy="msg" placeholder="输入要发送的内容" type="text" />
                </div>
                <button type="button" @click="sendText">
                    发送
                </button>
            </div>
        </footer>
        <footer class="footer1">
            <div class="footerWrap1">
                <button type="button" @click="sendCustomMsg">
                    发送自定义
                </button>
                <button type="button" @click="sendFile('image')">
                    发送图片
                </button>
                <button type="button" @click="sendFile('audio')">
                    发送音频
                </button>
                <button type="button" @click="sendFile('video')">
                    发送视频
                </button>
                <button type="button" @click="sendFile('file')">
                    发送文件
                </button>
                <button type="button" @click="call">
                    呼叫
                </button>
                <button type="button" @click="hangup">
                    拒绝
                </button>
                <button type="button" @click="response">
                    接听
                </button>
            </div>
        </footer>
    </div>
</template>
<script>
import vm from 'src/main';
import nimHeader from './nimHeader';
import nimInit, { safeParse } from './nimInit';
import { resetData, lStore, copyJson, dateFormat0, fileType, wxToast } from 'js/yydjs';

const resetDataFn = resetData({ //需要重置的data属性
    isEnter: false,
});

export default {
    data() {
        return {
            nimChat: lStore.get('nimChat') || {},
            nimAccount: lStore.get('nimAccount') || '',
            limit: 20,
            loaded: false,
            loading: false,
            finished: false,
            firstLoad: false,
            isScrollBottom: true,
            beginTime: 0,
            endTime: 0,
            lastMsgId: '0',
            countMsg: [],
            idClientList: [],
            oldMsgList: [],
            msgList: [],
            msg: '',
            scrollTimer: null,
            scrollTop: 0,
            oldHeight: 0,
            dateFormat0,
            lStore,
            netcallMsgJson: {
                netcallBill: '通话已结束',
                netcallRejected: '呼叫被拒绝',
                cancelNetcallBeforeAccept: '通话已取消',
            },
        }
    },

    computed: {
        currentMsgList() {
            let result = [];
            let { oldMsgList, msgList } = this;
            let allMsgList = [].concat(oldMsgList, msgList);

            this.scrollBottom();
            result = allMsgList;
            console.log(copyJson(result));
            return result;
        },
    },

    /*

    */

    props: {

    },

    onLoad() { //为保证每次进入都触发，需写在enterFn
        vm.$on('componentsUpdate', this.componentsUpdate);
        vm.$on('nimOnConnect', this.getHistoryMsgs);
        vm.$on('nimOnMsg', this.getMsgs);
        vm.$on('nimVideoCallSuccess', this.nimVideoCallSuccess);
        this.enterFn();
    },

    onShow() { //为保证每次进入都触发，需写在enterFn
        this.enterFn();
    },

    onHide() { //为保证每次离开都触发，需写在leaveFn
        this.leaveFn();
    },

    onHide() { //为保证每次离开都触发，需写在leaveFn
        this.leaveFn();
    },

    onUnload() { //为保证每次离开都触发，需写在leaveFn
        vm.$off('componentsUpdate', this.componentsUpdate);
        vm.$off('nimOnConnect', this.getHistoryMsgs);
        vm.$off('nimOnMsg', this.getMsgs);
        vm.$off('nimVideoCallSuccess', this.nimVideoCallSuccess);
        this.leaveFn();
    },

    methods: {
        enterFn() { //onLoad和onShow可能会一起触发，所以需要防止重复触发
            if (this.isEnter) return;
            this.isEnter = true;

            this.nimChat = lStore.get('nimChat') || {};
            this.nimAccount = lStore.get('nimAccount') || '';
        },
        leaveFn() { //onHide和onUnload只会触发一个，如果是onHide可能需要重置data属性
            resetDataFn.reset(this);
        },
        componentsUpdate(controlName) {
            if (controlName != 'nimChat') return;
            this.nimChat = lStore.get('nimChat') || {};
            this.loaded = false;
            this.loading = false;
            this.finished = false;
            this.firstLoad = false;
            this.isScrollBottom = true;
            this.idClientList = [];
            this.oldMsgList = [];
            this.msgList = [];
            this.msg = '';
            this.getHistoryMsgs();
            this.scrollBottom();
        },
        nimVideoCallSuccess(obj) {
            wx.showNimVideoCall(true);
        },
        call() {
            console.log(wx.nimVideoCall);
            if (wx.nimVideoCall) {
                wx.nimVideoCall.call();
            }
        },
        response() {
            console.log(wx.nimVideoCall);
            if (wx.nimVideoCall) {
                wx.nimVideoCall.response();
            }
        },
        hangup() {
            console.log(wx.nimVideoCall);
            if (wx.nimVideoCall) {
                wx.nimVideoCall.hangup();
            }
        },
        scrollBottom() {
            clearTimeout(this.scrollTimer);
            this.scrollTimer = setTimeout(() => {
                let { scene, to } = this.nimChat;
                let query = wx.createSelectorQuery();

                query.select('#messageList').scrollOffset();
                query.exec((res) => {
                    let { scrollHeight } = res[0] || {};
                    let diffHeight = scrollHeight - this.oldHeight;

                    if (this.isScrollBottom) {
                        this.scrollTop = scrollHeight - 1;
                        this.scrollTop = scrollHeight;
                    } else {
                        this.scrollTop = diffHeight - 1;
                        this.scrollTop = diffHeight;
                    }
                });
                //wx.nim.resetSessionUnread(scene + '-' + to);
            }, 100);
        },
        scrollLoad(ev) {
            let { loaded, loading, finished, oldMsgList, countMsg } = this;
            let { scrollTop } = ev.mp.detail;

            if (scrollTop < 50 && loaded && !finished && !loading) {
                this.loading = true;
                this.getHistoryMsgs();
            }
        },
        getHistoryMsgs() {
            let createDt = new Date() - 1000 * 60 * 60 * 24 * 365;

            if (!this.nimChat || !this.nimChat.to || !createDt) return;
            let { scene, to } = this.nimChat;
            let { beginTime, endTime, lastMsgId, limit } = this;

            this.loaded = false;
            wx.nim.getHistoryMsgs({
                scene,
                to,
                beginTime,
                endTime,
                lastMsgId,
                limit,
                asc: true,
                done: (error, msg) => {
                    if (!error) {
                        let msgs = copyJson(msg.msgs) || [];
                        let { time } = msgs[0] || {};
                        let { idServer } = msgs[msgs.length - 1] || {};
                        let query = wx.createSelectorQuery();

                        query.select('#messageList').scrollOffset();
                        query.exec((res) => {
                            let { scrollHeight } = res[0] || {};

                            this.oldHeight = scrollHeight;
                        });

                        this.endTime = time;
                        this.lastMsgId = idServer;

                        msgs = msgs.map((item, index) => {
                            let { content, custom, pushPayload } = item;

                            item.content = safeParse(content);
                            item.custom = safeParse(custom);
                            item.pushPayload = safeParse(pushPayload);
                            return item;
                        });
                        msgs = msgs.filter((item) => {
                            let { idClient, custom = {} } = item;

                            if (!~this.idClientList.indexOf(idClient)) {
                                this.idClientList.push(idClient);
                                return true;
                            }
                        });

                        this.isScrollBottom = false;
                        this.countMsg = [].concat(msgs, this.countMsg);

                        if (!msg.msgs.length) {
                            this.finished = true;
                        }

                        //满足条件则继续拉数据
                        if (!this.finished && this.countMsg.length < this.limit) {
                            this.getHistoryMsgs();
                        } else {
                            this.oldMsgList = [].concat(this.countMsg, this.oldMsgList);
                            this.countMsg = [];

                            setTimeout(() => {
                                this.loading = false;
                                this.loaded = true;
                                if (!this.firstLoad) {
                                    this.firstLoad = true;
                                    this.isScrollBottom = true;
                                    this.scrollBottom();
                                }
                            }, 300);
                        }

                        //console.log(copyJson(msgs));
                    }
                },
            });
        },
        getMsgs(res) {
            setTimeout(() => {
                //console.log(copyJson(res));
                let { scene, to } = this.nimChat;

                if (!scene || !to) return;
                this.isScrollBottom = true;
                for (let attr in res) {
                    let { idClient } = res[attr];

                    if (!~this.idClientList.indexOf(idClient)) {
                        this.idClientList.push(idClient);
                        this.msgList = [].concat(this.msgList, res[attr]);
                    }
                }
            }, 300);
        },
        sendText() {
            if (!this.msg) return wxToast('发送内容不能为空，请重新输入');
            let { scene, to } = this.nimChat;

            this.isScrollBottom = true;
            wx.nim.sendText({
                scene,
                to,
                text: this.msg,
                done: (error, msg) => {
                    if (!error) {
                        let { content, custom, pushPayload } = msg;

                        this.msg = '';
                        msg.content = safeParse(content);
                        msg.custom = safeParse(custom);
                        msg.pushPayload = safeParse(pushPayload);
                        this.msgList = [].concat(this.msgList, [msg]);
                    }
                },
            });
        },
        sendCustomMsg() {
            let { scene, to } = this.nimChat;

            this.isScrollBottom = true;
            wx.nim.sendCustomMsg({
                scene,
                to,
                content: JSON.stringify({
                    type: 'order',
                    title: '药品订单',
                    main: '这是一条自定义消息',
                    link: '//www.baidu.com',
                }),
                done: (error, msg) => {
                    if (!error) {
                        let { content, custom, pushPayload } = msg;

                        this.msg = '';
                        msg.content = safeParse(content);
                        msg.custom = safeParse(custom);
                        msg.pushPayload = safeParse(pushPayload);
                        this.msgList = [].concat(this.msgList, [msg]);
                    }
                },
            });
        },
        sendFile(type, filePath) {
            let { scene, to } = this.nimChat;
            let custom = this.getCustom();
            let pushPayload = this.getCustom();
            const previewFileFn = (wxFilePath) => {
                this.isScrollBottom = true;
                wx.nim.previewFile({
                    type,
                    wxFilePath,
                    uploadprogress: (obj) => {
                        console.log('文件总大小: ' + obj.total + 'bytes');
                        console.log('已经上传的大小: ' + obj.loaded + 'bytes');
                        console.log('上传进度: ' + obj.percentage);
                        console.log('上传进度文本: ' + obj.percentageText);
                    },
                    done: (error, file) => {
                        if (!error) {
                            let type = fileType(file.ext);

                            wx.nim.sendFile({
                                scene,
                                to,
                                type,
                                wxFilePath,
                                custom,
                                pushPayload,
                                done: (error1, msg1) => {
                                    if (!error) {
                                        let { content, custom, pushPayload } = msg1;

                                        msg1.content = safeParse(content);
                                        msg1.custom = safeParse(custom);
                                        msg1.pushPayload = safeParse(pushPayload);
                                        this.msgList = [].concat(this.msgList, [msg1]);
                                    }
                                },
                            });
                        } else {
                            wxToast(error);
                        }
                    }
                });
            };

            switch (type) {
                case 'image':
                    wx.chooseImage({
                        success: (res) => {
                            let { tempFiles } = res;

                            for (let item of tempFiles) {
                                let { path } = item || {};

                                previewFileFn(path);
                            }
                        },
                    });
                    break;
                case 'audio':
                    filePath && previewFileFn(filePath);
                    break;
                case 'video':
                    wx.chooseVideo({
                        sourceType: ['album', 'camera'],
                        maxDuration: 60,
                        camera: 'back',
                        success: (res) => {
                            let { tempFilePath } = res;

                            previewFileFn(tempFilePath);
                        },
                    });
                    break;
            }
        },
        downloadFn(url = '') {
            console.log(url);
            wx.downloadFile({
                url,
                success(res) {
                    console.log('下载成功', res);
                }
            })
        },
    },

    components: {
        nimHeader,
    },
}

</script>
<style lang="scss" scoped>
@import '~css/public.scss';

.nimChat {
    & /deep/ {
        .content {
            border-top: 40px solid transparent;
            border-bottom: 150px solid transparent;
            .messageList {
                height: 100%;
                // overflow: hidden;
                // overflow-y: auto;
                .loadingWrap {
                    height: 40px;
                    line-height: 40px;
                    text-align: center;
                    color: #999;
                    overflow: hidden;
                    display: none;
                    h3 {
                        span {
                            display: inline-block;
                            padding-right: 20px;
                            background: url('../../images/loading.gif') no-repeat right center;
                            background-size: 14px;
                        }
                    }
                    h3, h4 {
                        display: none;
                    }
                    &.loading {
                        display: block;
                        h3 {
                            display: block;
                        }
                    }
                    &.finished {
                        display: block;
                        h4 {
                            display: block;
                        }
                    }
                }
                ul {
                    li {
                        padding: 20px 0;
                        >.title {
                            line-height: 30px;
                            text-align: center;
                            font-size: 12px;
                            color: #999;
                        }
                        >.main {
                            overflow: hidden;
                            .msgWrap {
                                float: right;
                                width: 70%;
                                text-align: right;
                                .nickName {
                                    color: #00ffff;
                                    float: right;
                                    border: 1px solid #00ffff;
                                }
                                .msg {
                                    float: right;
                                    margin: 0 10px;
                                }
                                .custom {
                                    .order {
                                        float: right;
                                        margin: 0 10px;
                                        border: 1px solid #ddd;
                                        border-radius: 5px;
                                        text-align: left;
                                        .title {
                                            padding: 5px 10px;
                                            line-height: 20px;
                                            border-bottom: 1px solid #ddd;
                                        }
                                        .main {
                                            padding: 10px;
                                            font-size: 12px;
                                        }
                                    }
                                }
                                .file {
                                    image, audio, video {
                                        max-width: 100%;
                                    }
                                    .download {
                                        h3 {
                                            @include multiLine2;
                                        }
                                    }
                                }
                                &.other {
                                    float: left;
                                    text-align: left;
                                    .nickName {
                                        color: #ff0000;
                                        float: left;
                                        border: 1px solid #ff0000;
                                    }
                                    .msg, .order {
                                        float: left;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        .footer {
            height: 50px;
            .footerWrap {
                width: 100%;
                padding: 10px 20px;
                height: 50px;
                border-top: 1px solid #ddd;
                background-color: #fff;
                position: absolute;
                left: 0;
                bottom: 100px;
                z-index: 1000;
                .left {
                    width: 100%;
                    height: 100%;
                    padding-right: 70px;
                    input {
                        width: 100%;
                        height: 100%;
                        border-radius: 5px;
                    }
                }
                button {
                    width: 60px;
                    margin: 10px 20px;
                    height: 30px;
                    position: absolute;
                    right: 0;
                    top: 0;
                    font-size: 12px;
                }
            }
        }
        .footer1 {
            height: 100px;
            .footerWrap1 {
                width: 100%;
                padding: 10px 20px;
                height: 100px;
                border-top: 1px solid #ddd;
                background-color: #fff;
                position: absolute;
                left: 0;
                bottom: 0;
                z-index: 1000;
                button {
                    float: left;
                    margin-right: 10px;
                    margin-bottom: 10px;
                    height: 20px;
                    line-height: 20px;
                    position: relative;
                    font-size: 12px;
                    .file {
                        width: 100%;
                        height: 100%;
                        position: absolute;
                        left: 0;
                        top: 0;
                        z-index: 10;
                        opacity: 0;
                    }
                }
            }
        }
    }
}

</style>

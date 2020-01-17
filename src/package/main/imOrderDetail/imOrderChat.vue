<template>
    <div class="imOrderChat">
        <section class="content scrollContainer">
            <scroll-view :class="{messageListWrap:true,active:showMore}" ref="messageListWrap" id="messageListWrap" :scroll-y="true" :scroll-top="scrollTop" @scroll="scrollLoad" @click="showMore=false">
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
                <ul class="messageList">
                    <li v-if="item.isMsgFilter" v-for="(item,index) in currentMsgList" :key="index" :class="{
                                    myself:item.isMySelf,
                                }">
                        <div v-if="index==0||index>0&&item.time-currentMsgList[index-1].time>1*1000*60||item.content&&item.content.type=='7'" class="time">
                            <span class="timeWrap">
                                {{item.formatTime}}
                            </span>
                        </div>
                        <div class="messageWrap">
                            <div v-if="item.isOuterMsgFilter" class="outerCustom">
                                <div v-if="item.content.type=='7'" class="consultFinish hint">
                                    <span>{{item.content.data.value}}</span>
                                </div>
                                <div v-if="item.content.type=='12'&&item.content.data.show!=1" class="warmPrompt hint">
                                    <span>{{item.content.data.msg}}</span>
                                </div>
                                <div v-if="item.content.type=='13'&&item.content.data.show!=1" class="returnDiagnosis hint">
                                    <span>{{item.content.data.msg}}</span>
                                </div>
                            </div>
                            <div v-else class="personage">
                                <imgWrap className="avatar" :auto="false" :src="item.avatarUrl" />
                                <div class="message">
                                    <div v-if="item.type=='text'" class="msg">
                                        <span>{{item.text}}</span>
                                    </div>
                                    <div v-else-if="item.type=='custom'" class="innerCustom">
                                        <div v-if="item.content.type=='8'" class="patientBrief">
                                            <h3></h3>
                                            <h3>病情信息：</h3>
                                            <h3>病情描述：{{item.content.data.chiefComplaint}}</h3>
                                            <template v-if="item.content.data.pics.length">
                                                <h3>病情图片：</h3>
                                                <van-uploader :file-list="item.content.data.picList" class="vanUploader" />
                                                <image v-for="(item1,index1) in item.content.data.picList" :key="index1" class="hideImage" :src="item1" @load="scrollBottom" />
                                            </template>
                                        </div>
                                        <div v-else-if="item.content.type=='9'" class="record" @click="toHistoricalRecords(item.content.data)">
                                            <div class="title">
                                                <div class="wrap">
                                                    <span class="span">{{item.content.data.formatVisitDateTime}}</span>
                                                    <span>就诊记录</span>
                                                </div>
                                            </div>
                                            <div class="main">
                                                <div class="rightContent">
                                                    <h3>{{item.content.data.orgFullName}} {{item.content.data.deptName}}</h3>
                                                    <h4>确诊诊断：{{item.content.data.diagnoseName}}</h4>
                                                </div>
                                            </div>
                                        </div>
                                        <div v-else-if="item.content.type=='10'" class="prescription" @click="prescribing(item.content.data)">
                                            <div class="title">
                                                <div class="wrap">
                                                    <span class="span">电子处方</span>
                                                    <span class="em">{{item.content.data.formatInvalidDate}}到期</span>
                                                </div>
                                            </div>
                                            <div class="main">
                                                <div class="img"></div>
                                                <div class="rightContent">
                                                    <h3>{{item.content.data.personName}}</h3>
                                                    <h4>{{item.content.data.formatPrescriptionCheckDt}}</h4>
                                                </div>
                                            </div>
                                        </div>
                                        <div v-else-if="item.content.type=='11'" class="videoDuration">
                                            <h3 v-if="item.content.data.state==0">未接听</h3>
                                            <h4 v-else>{{item.content.data.formatDuration}}</h4>
                                        </div>
                                        <div v-else-if="item.content.type=='14'&&item.content.data.show!=1" class="reception">
                                            <span>{{item.content.data.msg}}</span>
                                        </div>
                                        <div v-else-if="item.content.type=='15'" class="prescriptionHint">
                                            <span>{{item.content.data.msg}}</span>
                                        </div>
                                    </div>
                                    <div v-else-if="item.attach&&(item.attach.type=='netcallRejected'||item.attach.type=='cancelNetcallBeforeAccept')" class="attach">
                                        <span>{{item.attach.type=='netcallRejected'?'未接听':'已取消'}}</span>
                                    </div>
                                    <div v-else class="file">
                                        <div v-if="item.type=='image'" class="imageWrap" :style="{width:item.imageFile.width+'px'}">
                                            <van-uploader :file-list="item.imageFiles" image-fit="widthFix" class="vanUploader" />
                                            <image class="hideImage" :src="item.imageFile.url" @load="scrollBottom" />
                                        </div>
                                        <div v-else-if="item.type=='audio'||item.file.ext=='silk'" :id="item.file.md5" class="audioWrap" @click="playAudio(item,index)">
                                            <span :class="{trumpet:true,active:trumpetActiveArr[index]}">{{item.file.dur/1000<<1>>1}}"</span>
                                        </div>
                                        <video v-else-if="item.type=='video'" :src="item.file.url" controls></video>
                                        <div v-else-if="item.type=='file'" download="true" class="download" @click="downloadFn(item.file.url)">
                                            <h3>{{item.file.name}}</h3>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </li>
                </ul>
            </scroll-view>
        </section>
        <footer v-if="(orderDetail.conStatus=='50'||orderDetail.conStatus=='51'||orderDetail.conStatus=='52')||(orderDetail.orderStatus=='01'||orderDetail.orderStatus=='02')" class="footer">
            <div class="footerWrap">
                <div :class="{inputWrap:true,active:msgText,border:showMore}">
                    <div :class="{tap:true,voice:!isRecord,keboard:isRecord}" @click="changeInputMode"></div>
                    <div v-if="!isRecord" class="input">
                        <input v-model.lazy="msg" :focus="inputFocus" type="text" @comfirm="sendText" @input="inputTextFn($event)" />
                    </div>
                    <div v-else :class="{holdTalk:true,tap:true,active:isHold}" @touchstart="startRecordFn" @touchend="stopRecordFn" @touchmove="cancelRangeFn($event)">
                        {{!isHold?'按住 说话':'松开 结束'}}
                    </div>
                    <div class="rightContent">
                        <div class="showMore tap" @click="showMore=!showMore"></div>
                        <button type="button" @click="sendText">发送</button>
                    </div>
                </div>
                <ol :class="{handleWrap:true,active:showMore}">
                    <li class="sendImage tap" @click="sendFile('image')">
                        <div class="handle image">
                            图片
                        </div>
                    </li>
                    <li class="sendImage tap" @click="sendFile('video')">
                        <div class="handle video">
                            视频
                        </div>
                    </li>
                </ol>
            </div>
        </footer>
        <div :class="{recordMask:true,active:isHold}">
            <imgWrap className="microphone" src="icon/img_microphone.png" />
            <div class="recordTime">
                {{resultRecordTime}}
            </div>
            <div class="hint">
                {{!isCancel?'上滑取消发送':'松开手指，取消发送'}}
            </div>
        </div>
        <!-- <div v-if="!firstLoadDone" class="firstLoadMask"></div> -->
    </div>
</template>
<script>
import vm from 'src/main';
import nimInit, { safeParse } from './components/NIM/nimInit';
import imgWrap from './components/imgWrap';
import { resetData, lStore, copyJson, normalDate, dateFormat0, secondFormat0, fileType, wxToast, toTwo } from './js/yydjs';
import { viewImage, profile, orderImHistory } from './services';

const resetDataFn = resetData({ //需要重置的data属性
    isEnter: false,
    consultFinish: false,
});

export default {
    data() {
        let systemInfo = wx.getSystemInfoSync();
        let { windowHeight } = systemInfo;

        return Object.assign({}, resetDataFn.data, {
            showMore: false,
            nimChat: lStore.get('nimChat') || {},
            nimAccount: lStore.get('nimAccount') || '',
            recorderManager: null, // 微信录音管理对象
            limit: 20,
            loaded: false,
            loading: false,
            finished: false,
            firstLoad: false,
            firstLoadDone: false,
            isScrollBottom: true,
            beginTime: 0,
            endTime: 0,
            lastMsgId: '0',
            countMsg: [],
            idClientList: [],
            oldMsgList: [],
            msgList: [],
            msg: '',
            msgText: '',
            inputFocus: false,
            isRecord: false,
            isHold: false,
            isCancel: false,
            scrollTimer: null,
            scrollTop: 0,
            oldHeight: 0,
            recordTime: 0,
            resultRecordTime: '00:00',
            startRecordTimer: null,
            stopRecordTimer: null,
            audioContext: null,
            playAudioCtx: {},
            netcallMsgJson: {
                netcallBill: '通话已结束',
                netcallRejected: '呼叫被拒绝',
                cancelNetcallBeforeAccept: '通话已取消',
            },
            trumpetActiveArr: [],
            params: {
                buzId: '', // orderDetailId
                buzType: '', // 30图文 40视频 70复诊
                pageNo: 1,
                pageSize: 20,
            },
            windowHeight,
            dateFormat0,
            lStore,
            viewImage,
        });
    },

    computed: {
        myselfAvatar() {
            let { avatar } = lStore.get('mpiInfo') || {};
            let { avatarUrl } = lStore.get('wxuserInfo') || {};
            avatar = avatar ? viewImage + avatar : avatarUrl;
            let result = avatar ? avatar : 'img_head_doctor.png';

            return result;
        },
        doctorAvatar() {
            let { doctorAvatar } = this.orderDetail;
            let result = doctorAvatar ? viewImage + doctorAvatar : 'img_head_user.png';

            return result;
        },
        currentMsgList() {
            let result = [];
            let { oldMsgList, msgList, myselfAvatar, doctorAvatar } = this;
            let { revisitId, orderDetailId } = this.orderDetail;
            let buzId = revisitId || orderDetailId;
            let consultFinish = false;
            let allMsgList = [].concat(oldMsgList, msgList);

            // console.log(copyJson(oldMsgList));
            allMsgList = allMsgList.filter((item, index) => {
                let { custom = {} } = item;
                let { buzId: currentBuzId = '' } = custom;

                return currentBuzId == buzId;
            });
            allMsgList = allMsgList.map((item) => {
                let { time, content = {}, file = {}, type: fileType } = item;
                let { data = {}, type } = content;
                let { duration, visitDateTime, invalidDate, prescriptionCheckDt, pics } = data;

                item.isMsgFilter = this.msgFilter(item);
                item.isOuterMsgFilter = this.outerMsgFilter(item);
                item.formatTime = dateFormat0(time, 'yyyy-MM-dd hh:mm');
                item.isMySelf = lStore.get('nimAccount') == item.from;
                item.avatarUrl = item.isMySelf ? myselfAvatar : doctorAvatar;
                if (duration) {
                    item.content.data.formatDuration = this.getDuration(duration);
                }
                if (visitDateTime) {
                    item.content.data.formatVisitDateTime = dateFormat0(visitDateTime, 'yyyy-MM-dd');
                }
                if (invalidDate) {
                    item.content.data.formatInvalidDate = dateFormat0(invalidDate, 'yyyy-MM-dd');
                }
                if (prescriptionCheckDt) {
                    item.content.data.formatPrescriptionCheckDt = dateFormat0(prescriptionCheckDt, 'yyyy年MM月dd日');
                }
                if (content.type == 8) {
                    item.content.data.picList = pics.map((item, index) => ({
                        url: item,
                        name: '图片',
                        isImage: true,
                    }));
                }
                if (fileType == 'image') {
                    let { url, name, w: width } = file;
                    let imageFile = {
                        url,
                        name,
                        width,
                        isImage: true,
                    };

                    item.imageFiles = [imageFile];
                    item.imageFile = imageFile;
                }
                return item;
            });
            for (let item of result) {
                let { content = {} } = item;
                let { data = {} } = content;
                let { value = '' } = data;
                let arr = ['服务已开始，本次服务可持续24小时', '咨询已开始，本次咨询可持续24小时'];
                let textFinished = !~arr.indexOf(value);

                if (content.type == '7' && (data.finished == '1' || textFinished)) {
                    consultFinish = true;
                    break;
                }
            }

            this.consultFinish = consultFinish;
            this.scrollBottom();
            result = copyJson(allMsgList);
            console.log(result);
            console.log(this.isScrollBottom);
            return result;
        },
    },

    /*

    */

    props: {
        itemCode: { //项目代码
            type: String,
            default: '',
        },
        orderDetail: { //订单详情
            type: Object,
            default () {
                return {};
            },
        },
    },

    watch: {
        showMore(newVal, oldVal) {
            if (newVal) {
                this.isScrollBottom = true;
                this.scrollBottom();
            }
        },
    },

    onLoad() { //为保证每次进入都触发，需写在enterFn
        vm.$on('componentsUpdate', this.componentsUpdate);
        vm.$on('nimOnMsg', this.getMsgs);
        vm.$on('nimVideoCallSuccess', this.nimVideoCallSuccess);
        this.enterFn();
        this.setAudioContext();
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
        vm.$off('nimOnMsg', this.getMsgs);
        vm.$off('nimVideoCallSuccess', this.nimVideoCallSuccess);
        clearInterval(this.startRecordTimer);
        clearTimeout(this.stopRecordTimer);
        this.leaveFn();
        lStore.remove('isConnected');
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
            if (controlName != 'imOrderChat') return;
            this.nimChat = lStore.get('nimChat') || {};
            this.recorderManager = null;
            this.loaded = false;
            this.loading = false;
            this.finished = false;
            this.firstLoad = false;
            this.firstLoadDone = false;
            this.isScrollBottom = true;
            this.beginTime = 0;
            this.endTime = 0;
            this.lastMsgId = '0';
            this.countMsg = [];
            this.idClientList = [];
            this.oldMsgList = [];
            this.msgList = [];
            this.msg = '';
            this.msgText = '';
            this.inputFocus = false;
            this.scrollTop = 0;
            this.oldHeight = 0;
            this.recordTime = 0;
            this.resultRecordTime = '00:00';
            this.startRecordTimer = null;
            this.stopRecordTimer = null;
            this.params = {
                buzId: '',
                buzType: '',
                pageNo: 1,
                pageSize: 20,
            };
            this.getHistoryFn();
            this.scrollBottom();
        },
        getCustom() {
            let { itemCode, nimChat = {}, orderDetail = {} } = this;
            let { scene, to } = nimChat;
            let mpiInfo = lStore.get('mpiInfo') || {};
            let { personName: fromUserName } = mpiInfo;
            let { revisitId, orderDetailId, doctorName: toUserName, doctorAccId: toUser } = orderDetail;
            let buzTypeJson = {
                '01': 30,
                '02': 40,
                '04': 70,
            };
            let buzId = revisitId || orderDetailId;
            let buzType = buzTypeJson[itemCode];
            let fromUserType = 'patient';
            let result = {
                buzId,
                buzType,
                fromUserName,
                toUserName,
                fromUserType,
                toUser,
                profile,
            };

            return JSON.stringify(result);
        },
        msgFilter(item) {
            let { type, content = {} } = item;
            let { type: type1, data = {} } = content;
            let { show } = data;
            let excludeArr = ['12', '16', '17', '18'];

            return type != 'custom' || type == 'custom' && !~excludeArr.indexOf(type1) || type == 'custom' && type1 == '12' && show != 1;
        },
        outerMsgFilter(item) {
            let { type, content = {} } = item;
            let { type: type1, data = {} } = content;
            let includeArr = ['7', '12', '13'];

            return type == 'custom' && ~includeArr.indexOf(type1);
        },
        getDuration(duration) {
            let minute = Math.floor(duration / 60);
            let second = duration % 60;

            return `${toTwo(minute)}:${toTwo(second)}`;
        },
        toHistoricalRecords(data) {
            //患者端不跳转
            console.log('toHistoricalRecords', data);
        },
        prescribing(data) {
            let { orderNo, recipeId } = data;

            this.$router.navigate({
                path: '/package/order/recipeOrder/RecipeList',
                query: {
                    orderNo,
                    recipeId,
                },
            });
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
        scrollBottom(noDelay = false) {
            const scrollFn = () => {
                let { scene, to } = this.nimChat;
                let query = wx.createSelectorQuery();

                query.select('#messageListWrap').scrollOffset();
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
            };

            clearTimeout(this.scrollTimer);
            if (!noDelay) {
                this.scrollTimer = setTimeout(() => {
                    scrollFn();
                }, 100);
            } else {
                scrollFn();
            }
        },
        scrollLoad(ev) {
            let { loaded, loading, finished, firstLoad, oldMsgList, countMsg } = this;
            let { scrollTop } = ev.mp.detail;

            if (scrollTop < 50 && loaded && !finished && !loading && firstLoad) {
                this.loading = true;
                this.getHistoryFn();
            }
        },
        getHistoryFn() {
            let { conStatus, orderStatus } = this.orderDetail;
            let conStatusArr = ['12', '15', '45', '53', '57'];
            let orderStatusArr = ['05', '03'];
            let condition = ~conStatusArr.indexOf(conStatus) || ~orderStatusArr.indexOf(orderStatus);

            console.log(conStatus, orderStatus);
            if (condition) {
                console.log('从接口获取');
                this.orderImHistoryFn();
            } else {
                console.log('从云信获取');
                this.getHistoryMsgs();
            }
        },
        getDataFinish() {
            setTimeout(() => {
                this.loading = false;
                this.loaded = true;
                if (!this.firstLoad) {
                    this.firstLoad = true;
                    this.isScrollBottom = true;
                    this.scrollBottom();
                    setTimeout(() => {
                        this.firstLoadDone = true;
                    }, 1000);
                } else {
                    this.scrollBottom();
                }
            }, 300);
        },
        setOldHeight() {
            let query = wx.createSelectorQuery();

            query.select('#messageListWrap').scrollOffset();
            query.exec((res) => {
                let { scrollHeight } = res[0] || {};

                this.oldHeight = scrollHeight;
            });
        },
        getMapHistoryMsg(dataList = []) {
            let result = dataList.filter((item) => item.type != 'IMVIDEO').map((item) => {
                let { myselfAvatar, doctorAvatar } = this;
                let { body: content = {}, data: custom = {}, type, msgidClient: idClient, msgidServer: idServer, msgTime: time, fromUserName, fromUser, toUser, toUserName, duration } = item;
                let body = item.body;
                type = type.toLowerCase();
                type = type == 'picture' ? 'image' : type;
                let fileArr = ['image', 'audio', 'video'];
                let file = {};
                let text = '';

                try {
                    content = JSON.parse(content);
                } catch (e) {}
                try {
                    custom = JSON.parse(custom);
                } catch (e) {}

                if (~fileArr.indexOf(type)) {
                    file = content;
                } else if (type == 'netcall_vedio') {
                    type = 'custom';
                    content = { data: {} };
                    content.type = '11';
                    content.data.state = duration == 0 ? 0 : 1;
                    content.data.duration = duration;
                } else if (type == 'text') {
                    text = body;
                }

                return {
                    content,
                    custom,
                    file,
                    pushPayload: custom,
                    type,
                    idClient,
                    idServer,
                    time,
                    text,
                    from: fromUser,
                    fromNick: fromUserName,
                    to: toUser,
                };
            });

            result.reverse();
            return result;
        },
        orderImHistoryFn() {
            let { itemCode, orderDetail = {} } = this;
            let { revisitId, orderDetailId } = orderDetail;
            let buzTypeJson = {
                '01': 30,
                '02': 40,
                '04': 70,
            };
            let buzId = revisitId || orderDetailId;
            let buzType = buzTypeJson[itemCode];

            this.params.buzId = buzId;
            this.params.buzType = buzType;
            this.loaded = false;
            this.isScrollBottom = false;
            this.setOldHeight();
            orderImHistory([this.params], (res) => {
                if (res.body) {
                    let { data = [] } = res.body;
                    let historyMsg = this.getMapHistoryMsg(data);

                    if (!data.length) {
                        this.finished = true;
                    }
                    if (historyMsg.length) {
                        this.oldMsgList = [].concat(historyMsg, this.oldMsgList);
                        this.getDataFinish();
                    }
                }
            });
            this.params.pageNo++;
        },
        getHistoryMsgs() {
            if (!this.nimChat || !this.nimChat.to) return;
            let { scene, to } = this.nimChat;
            let { createDt, createAt } = this.orderDetail;
            let createTime = createDt || createAt;
            createTime = +normalDate(createTime) - 1000 * 60 * 5;
            createTime = createTime > 0 ? createTime : 0;
            if (!this.beginTime) this.beginTime = createTime;
            let { beginTime, endTime, lastMsgId, limit } = this;

            this.loaded = false;
            this.setOldHeight();
            wx.nim.getHistoryMsgs({
                scene,
                to,
                beginTime,
                endTime,
                lastMsgId,
                limit: limit,
                asc: true,
                done: (error, msg) => {
                    if (!error) {
                        let msgs = copyJson(msg.msgs) || [];
                        let { time } = msgs[0] || {};
                        let { idServer } = msgs[msgs.length - 1] || {};
                        let { revisitId, orderDetailId } = this.orderDetail;
                        let buzId = revisitId || orderDetailId;

                        this.endTime = time;
                        this.lastMsgId = idServer;
                        msgs = msgs.filter((item, index) => {
                            let { custom } = item;
                            custom = safeParse(custom);
                            let { buzId: currentBuzId = '' } = custom || {};

                            return currentBuzId == buzId;
                        });
                        msgs = msgs.map((item, index) => {
                            let { content, custom, pushPayload } = item;

                            item.content = safeParse(content);
                            item.custom = safeParse(custom);
                            item.pushPayload = safeParse(pushPayload);
                            return item;
                        });
                        msgs = msgs.filter((item) => {
                            let { idClient, custom = {} } = item;
                            let { buzId } = custom;

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
                            if (this.countMsg.length) {
                                this.oldMsgList = [].concat(this.countMsg, this.oldMsgList);
                                this.countMsg = [];
                                this.getDataFinish();
                            }
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
                    let item = res[attr];
                    let { idClient } = item;


                    if (!~this.idClientList.indexOf(idClient)) {
                        let needRefreshCodes = ['7', '11', '13', '14'];
                        let { content = {} } = item;
                        let { type } = content;

                        if (~needRefreshCodes.indexOf(type)) {
                            vm.$emit('orderDetailNeedRefresh');
                        }
                        this.idClientList.push(idClient);
                        this.msgList = [].concat(this.msgList, item);
                    }
                }
            }, 300);
        },
        inputTextFn(ev) {
            let { value } = ev.mp.detail;

            this.msgText = value;
        },
        sendText() {
            this.inputFocus = true;
            if (!this.msgText) return wxToast('发送内容不能为空，请重新输入');
            let { scene, to } = this.nimChat;
            let { msgText: text } = this;
            let custom = this.getCustom();
            let pushPayload = this.getCustom();

            this.isScrollBottom = true;
            wx.nim.sendText({
                scene,
                to,
                text,
                custom,
                pushPayload,
                done: (error, msg) => {
                    if (!error) {
                        let { content, custom, pushPayload } = msg;

                        this.msg = '';
                        this.msgText = '';
                        msg.content = safeParse(content);
                        msg.custom = safeParse(custom);
                        msg.pushPayload = safeParse(pushPayload);
                        if (!error) {
                            this.msgList = [].concat(this.msgList, [msg]);
                        }
                    }
                },
            });
        },
        sendFile(type, filePath) {
            let { scene, to } = this.nimChat;
            let custom = this.getCustom();
            let pushPayload = this.getCustom();
            const previewFileFn = (wxFilePath) => {
                wxToast('发送中...');
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
                            console.log(2222, file);
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

                                        wxToast('发送成功');
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
        changeInputMode() {
            this.isRecord = !this.isRecord;
            this.showMore = false;
        },
        recordFinish(tempFilePath) {
            let { recordTime, isCancel } = this;

            if (recordTime < 1) {
                wxToast('说话时间太短');
            } else if (!isCancel) {
                this.sendFile('audio', tempFilePath);
            }
        },
        startRecordFn() {
            console.log('start');
            let recorderManager = this.recorderManager || wx.getRecorderManager();
            let options = {
                duration: 60000,
                format: 'mp3'
            };

            this.isHold = true;
            recorderManager.start(options);
            this.recorderManager = recorderManager;
            recorderManager.onStop((res) => {
                let { tempFilePath } = res;

                this.recordFinish(tempFilePath);
            })
            clearInterval(this.startRecordTimer);
            clearTimeout(this.stopRecordTimer);
            this.startRecordTimer = setInterval(() => {
                this.recordTime++;
                this.resultRecordTime = secondFormat0(this.recordTime, 'mm:ss');
                //console.log(this.recordTime, this.resultRecordTime);
            }, 1000);
            this.stopRecordTimer = setTimeout(() => {
                wx.stopRecord(); // 结束录音
            }, 60000);
        },
        stopRecordFn() {
            console.log('stop');
            this.isHold = false;
            this.recorderManager.stop();
            clearInterval(this.startRecordTimer);
            clearTimeout(this.stopRecordTimer);
            setTimeout(() => {
                this.recordTime = 0;
                this.resultRecordTime = '00:00';
                this.isCancel = false;
            }, 300);
        },
        cancelRangeFn(ev) {
            let { windowHeight } = this;
            let { pageY } = ev;
            let dis = windowHeight - pageY;

            this.isCancel = dis > 100;
        },
        playAudio(item, index) {
            let { url, mp3Url } = item.file;
            let audioContext = wx.createInnerAudioContext();

            if (item.ext === 'mp3') { // 小程序发送的
                audioContext.src = url;
            } else {
                audioContext.src = mp3Url;
            }
            audioContext.play();
            audioContext.onPlay(() => {
                this.trumpetActiveArr = [];
                this.trumpetActiveArr[index] = true;
            });
            audioContext.onEnded(() => {
                this.trumpetActiveArr = [];
            });
            audioContext.onError((res) => {
                wxToast(res.errCode);
            });
        },
        setAudioContext() {
            this.audioContext = wx.createInnerAudioContext();
        },
        downloadFn(url = '') {
            console.log(url);
            wx.downloadFile({
                url,
                success(res) {
                    console.log('下载成功', res);
                },
            });
        },
    },

    components: {
        imgWrap,
    },
}

</script>
<style lang="scss" scoped>
@import '~css/public.scss';

.imOrderChat {
    & /deep/ {
        .content {
            width: 100%;
            height: 100vh;
            border-top: 88rpx solid transparent;
            border-bottom: 100rpx solid transparent;
            background-color: $bg;
            position: absolute;
            left: 0;
            top: 0;
            .vanUploader {
                .van-uploader__preview-image {
                    width: 120rpx;
                }
                .van-uploader__preview-delete, .van-uploader__upload {
                    display: none;
                }
            }
            .hideImage {
                display: none;
            }
            .messageListWrap {
                height: 100%;
                &.active {
                    border-bottom: 248rpx solid transparent;
                }
                .loadingWrap {
                    height: $height1;
                    line-height: $height1;
                    text-align: center;
                    color: #999;
                    overflow: hidden;
                    visibility: hidden;
                    h3 {
                        span {
                            display: inline-block;
                            padding-right: 40rpx;
                            background: url('../../../images/loading.gif') no-repeat right center;
                            background-size: 28rpx;
                        }
                    }
                    h3, h4 {
                        display: none;
                    }
                    &.loading {
                        visibility: visible;
                        h3 {
                            display: block;
                        }
                    }
                    &.finished {
                        visibility: hidden;
                        h4 {
                            display: block;
                        }
                    }
                }
                .messageList {
                    padding: 0 20rpx;
                    >li {
                        .time {
                            margin: 20rpx 0;
                            text-align: center;
                            .timeWrap {
                                padding: 0 20rpx;
                                height: 40rpx;
                                line-height: 40rpx;
                                font-size: 24rpx;
                                background-color: #dcdcdc;
                                color: #fff;
                                border-radius: 20rpx;
                            }
                        }
                        .messageWrap {
                            margin: 30rpx 0;
                            overflow: hidden;
                            .hint {
                                border-left: 80rpx solid transparent;
                                border-right: 80rpx solid transparent;
                                margin: 20rpx 0;
                                text-align: center;
                                >span {
                                    display: inline-block;
                                    padding: 10rpx 20rpx;
                                    line-height: 40rpx;
                                    text-align: left;
                                    font-size: 24rpx;
                                    background-color: #dcdcdc;
                                    color: #999;
                                    border-radius: $borderRadius1;
                                }
                                &.consultFinish {
                                    margin: 0;
                                    position: relative;
                                    &:before {
                                        content: "";
                                        width: 100%;
                                        height: 2rpx;
                                        background-color: #ccc;
                                        position: absolute;
                                        left: 0;
                                        top: 50%;
                                        margin-top: -1rpx;
                                    }
                                    >span {
                                        background-color: $bg;
                                        position: relative;
                                        z-index: 10;
                                    }
                                }
                            }
                            .outerCustom {}
                            .avatar, .message {
                                float: left;
                            }
                            .avatar {
                                width: 80rpx;
                                height: 80rpx;
                                border-radius: 50%;
                            }
                            .message {
                                max-width: 70%;
                                min-height: 80rpx;
                                padding: 14rpx 30rpx;
                                margin: 0 20rpx;
                                line-height: 48rpx;
                                border: $border1;
                                border-radius: 20rpx;
                                background-color: #fff;
                                // overflow: hidden;
                                position: relative;
                                &:before {
                                    content: "";
                                    width: 0;
                                    height: 0;
                                    border: 20rpx solid transparent;
                                    border-top-color: #fff;
                                    position: absolute;
                                    left: -20rpx;
                                    top: 20rpx;
                                }
                                .file {
                                    .img, audio, video {
                                        max-width: 400rpx !important;
                                    }
                                    .imageWrap {
                                        max-width: 400rpx !important;
                                        .vanUploader {
                                            .van-uploader, .van-uploader__wrapper, .van-uploader__preview, .van-uploader__preview-image {
                                                margin: 0;
                                                width: 100%;
                                                height: 100%;
                                            }
                                        }
                                    }
                                }
                                .attach {
                                    padding-left: 40rpx;
                                    // background: url('../../../assets/img/icon_vieo.png') no-repeat left center;
                                    background-size: 24rpx;
                                }
                                .download {
                                    display: block;
                                    width: 200rpx;
                                    padding: 0 20rpx;
                                    padding-top: 160rpx;
                                    line-height: 40rpx;
                                    text-align: center;
                                    background: #fff url('../../../images/icon/ic_login_yanzhengma.png') no-repeat top center;
                                    background-size: 160rpx;
                                    color: #000;
                                    border-radius: 10rpx;
                                    h3 {
                                        @include multiLine2;
                                        padding-top: 20rpx;
                                    }
                                }
                                .innerCustom {
                                    .patientBrief {
                                        width: 460rpx;
                                    }
                                    .record, .prescription {
                                        width: 400rpx;
                                        color: #333;
                                        border-radius: 20rpx;
                                        cursor: pointer;
                                        .title {
                                            .wrap {
                                                display: block;
                                                line-height: 60rpx;
                                                // background: url('../../../images/icon/ic_file_more.png') no-repeat right center;
                                                // background-size: 16rpx;
                                                color: #fff;
                                                border-bottom: $border1;
                                            }
                                        }
                                        .main {
                                            display: flex;
                                            padding-top: 20rpx;
                                            .img {
                                                width: 80rpx;
                                                height: 80rpx;
                                                background: url('../../../images/icon/ic_notice_chufang.png') no-repeat right center;
                                                background-size: cover;
                                            }
                                            .rightContent {
                                                flex: 1;
                                                line-height: 40rpx;
                                                font-size: 24rpx;
                                                color: #fff;
                                            }
                                        }
                                    }
                                    .prescription {
                                        .title {
                                            .wrap {
                                                background-image: url('../../../images/icon/ic_file_white.png');
                                                color: #333;
                                                .span {
                                                    padding-right: 10rpx;
                                                }
                                                .em {
                                                    color: $orange;
                                                    font-size: 24rpx;
                                                }
                                            }
                                        }
                                        .main {
                                            .rightContent {
                                                padding-left: 20rpx;
                                                h3 {
                                                    color: #666;
                                                }
                                                h4 {
                                                    color: #999;
                                                }
                                            }
                                        }
                                    }
                                    .videoDuration {
                                        padding-left: 50rpx;
                                        background: url('../../../images/icon/icon_vieo.png') no-repeat left center;
                                        background-size: 30rpx;
                                    }
                                }
                            }
                        }
                        @keyframes playLeft {
                            0% {
                                background-image: url('../../../images/yuyin/yuyin_2_left@3x.png');
                            }
                            25% {
                                background-image: url('../../../images/yuyin/yuyin_3_left@3x.png');
                            }
                            50% {
                                background-image: url('../../../images/yuyin/yuyin_1_left@3x.png');
                            }
                            100% {
                                background-image: url('../../../images/yuyin/yuyin_2_left@3x.png');
                            }
                        }
                        @keyframes playRight {
                            0% {
                                background-image: url('../../../images/yuyin/yuyin_2@3x.png');
                            }
                            25% {
                                background-image: url('../../../images/yuyin/yuyin_3@3x.png');
                            }
                            50% {
                                background-image: url('../../../images/yuyin/yuyin_1@3x.png');
                            }
                            100% {
                                background-image: url('../../../images/yuyin/yuyin_2@3x.png');
                            }
                        }
                        .audioWrap {
                            .trumpet {
                                padding-left: 60rpx;
                                background: url('../../../images/yuyin/yuyin_1_left@3x.png') no-repeat left center;
                                background-size: 40rpx;
                                &.active {
                                    animation: playLeft 1s ease-in infinite;
                                }
                            }
                        }
                        &.myself {
                            .messageWrap {
                                .avatar, .message {
                                    float: right;
                                }
                                .message {
                                    background-color: $main;
                                    color: #fff;
                                    border-color: transparent;
                                    border-radius: 20rpx;
                                    &:before {
                                        border-top-color: $main;
                                        left: auto;
                                        right: -20rpx;
                                    }
                                }
                            }
                            .audioWrap {
                                .trumpet {
                                    padding: 0;
                                    padding-right: 60rpx;
                                    background: url('../../../images/yuyin/yuyin_1@3x.png') no-repeat right center;
                                    background-size: 40rpx;
                                    &.active {
                                        animation: playRight 1s ease-in infinite;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        .footer {
            height: 100rpx;
            .footerWrap {
                width: 100%;
                position: fixed;
                left: 0;
                bottom: 0;
                z-index: 1000;
                background-color: #fff;
                .inputWrap {
                    display: flex;
                    align-items: center;
                    height: 100rpx;
                    border-bottom: 1px solid transparent;
                    position: relative;
                    .input {
                        flex: 1;
                        height: 60rpx;
                        border: 1px solid #ccc;
                        border-radius: $borderRadius1;
                        transition: width .1s 0s ease-out;
                        position: relative;
                        input {
                            width: 100%;
                            padding: 0 20rpx;
                            height: 100rpx;
                            position: absolute;
                            top: -20rpx;
                            left: 0;
                        }
                    }
                    .holdTalk {
                        flex: 1;
                        height: 60rpx;
                        line-height: 58rpx;
                        text-align: center;
                        border: 1px solid #ccc;
                        border-radius: $borderRadius1;
                        transition: width .3s 0s ease-out;
                        color: #666;
                        position: relative;
                        &:before {
                            content: "";
                            width: 1000rpx;
                            height: 200rpx;
                            background-color: transparent;
                            position: absolute;
                            left: 50%;
                            margin-left: -500rpx;
                            top: -200rpx;
                            display: none;
                        }
                        &.active {
                            background-color: $bg;
                            &:before {
                                display: block;
                            }
                        }
                    }
                    .voice, .keboard, .rightContent {
                        width: 130rpx;
                        height: 100%;
                    }
                    .voice, .keboard {
                        background: no-repeat center center;
                        background-size: 60rpx;
                        background-image: url('../../../images/icon/ic_consult_voice.png');
                    }
                    .keboard {
                        background-image: url('../../../images/icon/ic_consult_keyboard.png');
                    }
                    .rightContent {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        .showMore {
                            width: 130rpx;
                            height: 100%;
                            background: no-repeat center center;
                            background-size: 60rpx;
                            background-image: url('../../../images/icon/ic_im_more.png');
                            transition: width .3s ease-out;
                        }
                        button {
                            width: 0rpx;
                            padding: 0;
                            height: 60rpx;
                            line-height: 60rpx;
                            background-color: $main;
                            color: #fff;
                            border-radius: $borderRadius1;
                            font-size: 24rpx;
                            transition: width .3s ease-out;
                        }
                    }
                    &.active {
                        .showMore {
                            width: 0;
                        }
                        .rightContent {
                            width: 130rpx;
                            button {
                                width: 100rpx;
                            }
                        }
                    }
                    &.border {
                        .footerWrap {
                            .inputWrap {
                                border-color: #e4e4e4;
                            }
                        }
                    }
                }
            }
            .handleWrap {
                padding: 0;
                height: 0;
                overflow: hidden;
                transition: padding .3s ease-out;
                li {
                    float: left;
                    width: 25%;
                    padding: 0 20rpx;
                    .handle {
                        width: 100%;
                        padding-top: 110rpx;
                        line-height: 20rpx;
                        text-align: center;
                        font-size: 24rpx;
                        background: no-repeat center top;
                        background-size: 100rpx;
                        color: #999;
                        &.image {
                            background-image: url('../../../images/icon/img_picture.png');
                        }
                        &.video {
                            background-image: url('../../../images/icon/img_photo.png');
                        }
                    }
                }
                &.active {
                    padding: 60rpx 0;
                    height: auto;
                }
            }
        }
        .recordMask {
            display: none;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            width: 300rpx;
            height: 300rpx;
            background-color: #5f5f5f;
            border-radius: 20rpx;
            position: fixed;
            left: 0;
            top: 0;
            right: 0;
            bottom: 0;
            z-index: 1000;
            margin: auto;
            &.active {
                display: flex;
            }
            .microphone {
                width: 60px;
            }
            .recordTime {
                padding-top: 20rpx;
                line-height: 60rpx;
                text-align: center;
                font-size: 40rpx;
                color: #fff;
            }
            .hint {
                width: 100%;
                line-height: 40rpx;
                text-align: center;
                color: #fff;
                font-size: 20rpx;
                position: absolute;
                left: 0;
                bottom: 0;
            }
        }
        .firstLoadMask {
            width: 100%;
            height: 100%;
            position: fixed;
            left: 0;
            top: 0;
            z-index: 99999;
        }
    }
}

</style>

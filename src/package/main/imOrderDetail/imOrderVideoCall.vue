<template>
    <div :class="{
            imOrderVideoCall:true,
            active:showNimVideoCall,
            minSize,
        }">
        <div :class="container1" @click="changeView(isViewChanged)">
            <live-player v-if="userJson.other.url" id="yunxinplayer" :src="userJson.other.url" mode="RTC" class="player" :orientation="orientation" min-cache="0.2" max-cache="0.8" @statechange="stateChangeHandler" :object-fit="objectFit" autoplay :debug="debug">
            </live-player>
        </div>
        <div :class="container2" @click="changeView(!isViewChanged)">
            <live-pusher v-if="userJson.self.url" id="yunxinpusher" :url="userJson.self.url" mode="RTC" class="camera" :aspect="aspect" @statechange="stateChangeHandler" @netstatus="netChangeHandler" background-mute="true" :enable-camera="enableCamera" :muted="muted" :beauty="beauty" :min-bitrate="minBitrate" :max-bitrate="maxBitrate" :debug="debug" autopush="true"></live-pusher>
        </div>
        <div class="mask">
            <div v-if="!isAccepted" class="docutorInfo">
                <imgWrap className="avatar" :auto="false" :src="orderDetail.avatar?viewImage+orderDetail.avatar:(orderDetail.icon?orderDetail.icon:'img_head_doctor.png')" />
                <div class="rightContent">
                    <h3>{{orderDetail.doctorName?orderDetail.doctorName:'医生'}}</h3>
                    <h4>请求视频聊天...</h4>
                </div>
            </div>
            <div v-else class="resizeView" @click="viewSizeToMin"></div>
            <div class="handle">
                <ol v-if="!isAccepted" class="handleWrap">
                    <li class="refuse" @click="reject">
                        <div class="wrap tap">
                            拒绝
                        </div>
                    </li>
                    <li class="response" @click="response">
                        <div class="wrap tap">
                            接听
                        </div>
                    </li>
                </ol>
                <div v-else>
                    <div class="timewait">
                        <h3>{{orderDetail.doctorName?orderDetail.doctorName:'医生'}}</h3>
                        <h4>{{duration}}</h4>
                    </div>
                    <ol class="handleWrap">
                        <li :class="{closeCamera:true,active:enableCamera}" data-mode="1" @click="switchMeetingModeHandler">
                            <div class="wrap tap">
                                {{enableCamera?'关闭':'开启'}}摄像头
                            </div>
                        </li>
                        <li class="hangup" @click="hangup">
                            <div class="wrap tap">
                                挂断
                            </div>
                        </li>
                        <li class="changeCamera" @click="switchCameraHandler">
                            <div class="wrap tap">
                                切换摄像头
                            </div>
                        </li>
                    </ol>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import vm from 'src/main';
import nimInit from './components/NIM/nimInit';
import nimNetcallInit from './components/NIM/nimNetcallInit';
import imgWrap from './components/imgWrap';
import { resetData, lStore, Type, wxToast, toTwo } from './js/yydjs';
import { viewImage, profile, getUinfo } from './services';

const resetDataFn = resetData({ //需要重置的data属性
    isEnter: false,
});
let needRePublish = false;
let needRePlay = false;
let callingBackToLast = false;

export default {
    data() {
        let systemInfo = wx.getSystemInfoSync();
        let videoContainerSize = {
            width: systemInfo.windowWidth,
            height: systemInfo.windowHeight,
        }

        return Object.assign({}, resetDataFn.data, {
            nimChat: lStore.get('nimChat') || {},
            showNimVideoCall: false,
            isViewChanged: false,
            minSize: false,
            viewImage,

            onTheCall: false, //正在通话中标记
            isCalling: false, // 主叫中
            beCalling: false, // 被叫中
            isAccepted: false, //接听了
            callingPosition: {}, // 呼叫中的位置
            enableCamera: true, // 开启摄像头标记
            muted: false, // 静音标记
            userlist: [], // 所有用户列表
            loginUser: {}, // {uid,account,cid}
            infoOfBeCalled: {}, // 被叫时传递过来的：主叫信息 {caller,cid,type}
            netcallTime: 0, // 通话时长
            duration: '', // 格式化后的时间
            selfPosition: {}, // 自己的位置
            otherPosition: {}, // 对端的位置大小
            callTypeIconKind: 'video', // 当前的通话类型，音频通话为audio，视频通话为video
            // 音视频流重连标记
            streamNeedReconnect: false,
            streamStoped: false,
            livePlayerContext: null, // 组件操作上下文
            livePusherContext: null, // 组件操作上下文
            detached: false,
            pushConfig: {
                enable: true,
                needBadge: true,
                needPushNick: true,
                pushContent: '',
                custom: '',
                pushPayload: '',
                sound: '',
                forceKeepCalling: 0,
            },
            sessionConfig: {
                videoQuality: '',
                videoFrameRate: '',
                videoBitrate: 0,
                recordVideo: true,
                recordAudio: true,
                recordType: 1,
                highAudio: false,
                bypassRtmp: false,
                rtmpUrl: '',
                rtmpRecord: false,
                splitMode: '',
            },
            videoContainerSize,

            //yunxin-player
            debug: false,
            /**
             * 加载状态：loading、ready、error
             */
            status: 'loading',
            /**
             * 画面方向，可选值有 vertical，horizontal
             */
            orientation: 'vertical',
            objectFit: 'fillCrop',
            uid: '',
            url: '',

            //yunxinpusher
            minBitrate: 200,
            maxBitrate: 500,
            beauty: 0,
            aspect: '3:4',
        });
    },

    computed: {
        userJson() {
            let { userlist } = this;
            let myAccount = lStore.get('nimAccount');
            let result = { self: {}, other: {} };

            for (let item of userlist) {
                let { account } = item;
                let name = account == myAccount ? 'self' : 'other';

                result[name] = item;
            }
            // console.log('用户地址', userlist, result);
            return result;
        },
        container1() {
            let { isViewChanged } = this;

            return !isViewChanged ? 'remoteContainer' : 'container';
        },
        container2() {
            let { isViewChanged } = this;

            return isViewChanged ? 'remoteContainer' : 'container';
        },
    },

    /*

    */

    props: {
        orderDetail: { //订单详情
            type: Object,
            default () {
                return {};
            },
        },
    },

    onLoad() { //为保证每次进入都触发，需写在enterFn
        vm.$on('componentsUpdate', this.componentsUpdate);
        vm.$on('nimOnsyncdone', this.nimNetcallInitFn);
        this.bindNetcallEvent();
        this.enterFn();
        this.getBeCallingData();

    },

    onShow() { //为保证每次进入都触发，需写在enterFn
        this.enterFn();
    },

    onHide() { //为保证每次离开都触发，需写在leaveFn
        this.leaveFn();
    },

    onUnload() { //为保证每次离开都触发，需写在leaveFn
        vm.$off('componentsUpdate', this.componentsUpdate);
        vm.$off('nimOnsyncdone', this.nimNetcallInitFn);
        this.unbindNetcallEvent();
        this.hangup();
        this.leaveFn();
    },

    methods: {
        enterFn() { //onLoad和onShow可能会一起触发，所以需要防止重复触发
            if (this.isEnter) return;
            this.isEnter = true;
        },
        leaveFn() { //onHide和onUnload只会触发一个，如果是onHide可能需要重置data属性
            wx.bindNetcallEvent && wx.bindNetcallEvent();
            resetDataFn.reset(this);

            if (this.onTheCall || this.isCalling) {
                this.hangup(true)
            }
            wx.createLivePlayerContext(`yunxinplayer`, this).stop()
            this.detached = true
        },
        getUinfoFn(accid) {
            getUinfo([accid], (res) => {
                if (res.body) {
                    let { icon, name: doctorName } = res.body;

                    this.orderDetail.icon = icon;
                    this.orderDetail.doctorName = doctorName;
                }
            });
        },
        getBeCallingData() {
            let beCallingData = lStore.get('beCallingData');
            let { caller } = beCallingData || {};

            if (beCallingData) {
                this.onBeCallingFn(beCallingData);
                this.getUinfoFn(caller);
            }
        },
        changeView(canChange) {
            if (this.minSize) {
                this.viewSizeToMax();
            } else if (canChange) {
                this.isViewChanged = !this.isViewChanged;
            }
        },
        viewSizeToMax() {
            if (this.minSize) this.minSize = false;
        },
        viewSizeToMin() {
            if (!this.minSize) this.minSize = true;
        },

        componentsUpdate(controlName) {
            if (controlName != 'imOrderChat') return;
            this.nimChat = lStore.get('nimChat') || {};
            this.showNimVideoCall = false;
            this.isViewChanged = false;
            this.minSize = false;
            this.onTheCall = false;
            this.isCalling = false;
            this.beCalling = false;
            this.isAccepted = false;
            this.callingPosition = {};
            this.enableCamera = true;
            this.muted = false;
            this.userlist = [];
            this.loginUser = {};
            this.infoOfBeCalled = {};
            this.netcallTime = 0;
            this.duration = '';
            this.selfPosition = {};
            this.otherPosition = {};
            this.streamNeedReconnect = false;
            this.streamStoped = false;
            this.livePlayerContext = null;
            this.livePusherContext = null;
            this.detached = false;
            this.status = 'loading';
            this.orientation = 'vertical';
            this.objectFit = 'fillCrop';
            this.uid = '';
            this.url = '';
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
        controlNimVideoCall(show) {
            this.showNimVideoCall = show;
        },

        nimNetcallInitFn() {
            console.log('初始化', wx.nim);
            if (!wx.nim) return;
            this.nimChat = lStore.get('nimChat') || {};
            //vm.$on('nimOnConnect',this.netcallInit);

            wx.nimVideoCall = this;
            wx.showNimVideoCall = () => {
                this.controlNimVideoCall(true);
            };
            wx.closeNimVideoCall = () => {
                this.controlNimVideoCall(false);
            };
            this._initialPosition();
            nimNetcallInit();
            this.videoQuality = wx.Netcall.CHAT_VIDEO_QUALITY_HIGH;
            this.videoFrameRate = wx.Netcall.CHAT_VIDEO_FRAME_RATE_15;
            this.splitMode = wx.Netcall.LAYOUT_SPLITLATTICETILE;
        },
        call() {
            let { to } = this.nimChat;
            let { pushConfig, sessionConfig } = this;

            pushConfig.custom = this.getCustom();
            pushConfig.pushPayload = this.getCustom();
            this.showNimVideoCall = true;
            wx.isPushBeCallPage = false
            wx.setKeepScreenOn({
                keepScreenOn: true
            })
            this.isCalling = true
            this.callingPosition = {
                x: 0,
                y: 0,
                width: this.videoContainerSize.width,
                height: this.videoContainerSize.height,
                pushConfig,
                sessionConfig,
            }
            wx.netcall.call({
                type: 2, // 通话类型：1音频，2视频
                callee: to, // 被叫
                forceKeepCalling: true, // 持续呼叫
            }).catch((error) => {
                const duration = 2000
                wxToast(`呼叫失败，请重试，${duration}ms后返回`, duration)
                this.hangupAfter(duration)
            })
            clearTimeout(this.callTimerId)
            this.callTimerId = setTimeout(() => {
                const duration = 2000
                wxToast(`无人接听，${duration}ms后自动返回`, duration)
                this.hangupAfter(duration)
            }, 30 * 1000)
        },
        /**
         * 接听通话
         */
        response(e) {
            if (this.isAccepted) return;
            this.isAccepted = true;
            let { sessionConfig } = this;

            // 显示通信画面
            // this.setDatas
            wx.netcall.response({
                caller: this.infoOfBeCalled.caller,
                accepted: true,
                type: this.infoOfBeCalled.type,
                cid: this.infoOfBeCalled.cid,
                sessionConfig,
            }).then(() => {
                // 开启音视频逻辑
                console.log('接听。。。')
                wx.netcall.startRtc({ mode: 0 }).then((data) => {
                    this._clearCallTimer()
                    this.beCalling = false
                    this.isCalling = false
                    this.loginUser = data
                    this.streamNeedReconnect = true
                    this.livePusherContext = wx.createLivePusherContext()
                })
            }).catch((error) => {
                console.error(error)
                const duration = 2000
                wxToast(`接听失败，请重试，${duration}ms后返回`, duration)
                this.hangupAfter(0)
            })
        },
        /**
         * 拒绝通话
         */
        reject(e) {
            this._clearCallTimer()
            wx.netcall.response({
                caller: this.infoOfBeCalled.caller,
                accepted: false,
                type: this.infoOfBeCalled.type,
                cid: this.infoOfBeCalled.cid
            }).then(() => {
                this._resetData()
                this.hangupAfter(0)
            }).catch((error) => {
                console.error(error)
            })
        },
        /**
         * 挂断通话
         */
        hangup(notBack = false) {
            wx.bindNetcallEvent && wx.bindNetcallEvent();
            this.showNimVideoCall = false;
            this.isAccepted = false;
            if (lStore.get('beCallingData')) {
                this.$router.back(1);
            }
            lStore.remove('beCallingData');
            return Promise.resolve().then(() => {
                if (wx.netcall) {
                    console.log('start hangup')
                    wx.netcall.hangup()
                }
                return Promise.resolve()
            }).then(() => {
                // 停止推拉流
                this._resetData()
                console.log('通话被挂断。。。')
                this.stopStream(0)
                if (notBack !== true) {
                    this._judgeNavigateBack(0)
                }
                this._clearCallTimer()
                this._clearNetcallTimeTimer()
                // 避免频繁操作
                clearTimeout(wx.videoCallTimer)
                wx.videoCallTimer = setTimeout(() => {
                    wx.waitingUseVideoCall = false
                }, 2000)
                wx.waitingUseVideoCall = true
                this.componentsUpdate('imOrderChat');
            })
        },
        hangupAfter(duration = 0) {
            clearTimeout(this.hangupTimer)
            this.hangupTimer = setTimeout(() => {
                this.hangup()
            }, duration)
        },
        _initialPosition() {
            let containerSize = this.videoContainerSize // 外部容器大小
            let selfPosition = {
                x: containerSize.width - 100 - 30,
                y: 30,
                width: 100,
                height: 150
            }
            let otherPosition = {
                x: 0,
                y: 0,
                width: containerSize.width,
                height: containerSize.height
            }
            this.selfPosition = selfPosition
            this.otherPosition = otherPosition
        },
        _mergeUserList(oldList, newList) {
            console.log('老的数据')
            console.log(oldList)
            console.log('新的数据')
            console.log(newList)
            let resultList = Object.assign([], oldList)
            resultList.map(user => {
                newList.map(newUser => {
                    if (newUser.uid == user.uid || newUser.account == user.account) {
                        Object.assign(user, newUser)
                    }
                })
            })
            console.log('处理后的数据')
            console.log(resultList)
            return resultList
        },

        bindNetcallEvent() {
            console.log('绑定事件');
            vm.$on('syncDone', this.onSyncDoneFn);
            vm.$on('callAccepted', this.onCallAcceptedFn);
            vm.$on('callRejected', this.onCallRejectedFn);
            vm.$on('clientLeave', this.onClientLeaveFn);
            vm.$on('clientJoin', this.onClientJoinFn);
            vm.$on('beCalling', this.onBeCallingFn);
            vm.$on('hangup', this.onHangupFn);
            vm.$on('control', this.onControlFn);
            // 信令准备重连
            vm.$on('willreconnect', this.onWillreconnectFn);
        },
        unbindNetcallEvent() {
            console.log('移除事件');
            vm.$off('syncDone', this.onSyncDoneFn);
            vm.$off('callAccepted', this.onCallAcceptedFn);
            vm.$off('callRejected', this.onCallRejectedFn);
            vm.$off('clientLeave', this.onClientLeaveFn);
            vm.$off('clientJoin', this.onClientJoinFn);
            vm.$off('beCalling', this.onBeCallingFn);
            vm.$off('hangup', this.onHangupFn);
            vm.$off('control', this.onControlFn);
            // 信令准备重连
            vm.$off('willreconnect', this.onWillreconnectFn);
        },
        onSyncDoneFn(data) {
            console.log('同步完成')
            console.log(data)
            // this._mergeUserList(this.userlist, data.userlist)
            let userlist = Object.assign([], data.userlist)
            if (userlist.length == 1) {
                userlist.push({})
                userlist.reverse()
            }
            console.error(userlist)
            if (this.userlist.length == 2) {
                this.streamNeedReconnect = true
                this.userlist = []
                console.log('再次重连媒体流了')
                setTimeout(() => {
                    this.onTheCall = true // 正在通话中标记
                    this.userlist = userlist
                }, 70)
                console.log('媒体流重新建立中，请稍后')
                this.reconnectStreamAfter(100)
                return
            }
            this.onTheCall = true // 正在通话中标记
            this.userlist = userlist
            this.streamNeedReconnect = true
            this.reconnectStreamAfter()
            // 设置通话定时计时器
            this._clearCallTimer()
            if (!this.netcallTimeTimer) {
                this.netcallTimeTimer = setInterval(() => {
                    let { hour, minute, second } = this._formateDuration(this.netcallTime + 1)

                    this.netcallTime = this.netcallTime + 1
                    this.duration = `${hour}:${minute}:${second}`
                }, 1000)
            }
        },
        onCallAcceptedFn(data) {
            console.log('对方接听了', data)
            clearTimeout(this.hangupTimer)
            // 开启音视频逻辑
            wx.netcall.startRtc({ mode: 0 })
                .then((data) => {
                    console.log(`开启音视频成功`)
                    console.log(data)
                    this.livePusherContext = wx.createLivePusherContext()
                    this.loginUser = data
                    this.isCalling = false
                    this.streamNeedReconnect = true
                })
        },
        onCallRejectedFn(data) {
            console.log('对方拒绝了')
            console.log(data)
            clearTimeout(this.hangupTimer)
            this.onTheCall = false
            const duration = 2000
            wxToast(`对方拒绝，${duration}ms后返回`, duration)
            this.hangupAfter(duration)
        },
        onClientLeaveFn(data) {
            console.log('有人离开了：')
            console.log(this.userlist)
            console.log(data)
        },
        onClientJoinFn(data) {
            console.log('有人加入了')
            this._personJoin(data)
            console.log(this.userlist)
        },
        onBeCallingFn(data) {
            this.infoOfBeCalled = data
            console.log('被叫了')
            console.log(data)
            if (this.onTheCall || this.isCalling || this.infoOfBeCalled.cid != data.cid) {
                // 如果通话中，则拒绝
                wx.netcall.response({
                    accepted: false,
                    caller: data.caller,
                    type: data.type,
                    cid: data.cid
                });
            } else {
                this.showNimVideoCall = true;
            }
        },
        onHangupFn(data) {
            let { to } = this.nimChat;
            console.log('对端挂断了')
            console.log(data)
            console.log(this.loginUser)
            // 接通过程
            if (data.cid != this.loginUser.cid && this.onTheCall) {
                console.warn('接通过程,非本通通话，抛弃')
                return
            }
            // 被叫过程
            if (this.beCalling && this.infoOfBeCalled.cid != data.cid) {
                console.warn('被叫过程,非本通通话，抛弃')
                return
            }
            // 主叫过程
            if (this.isCalling && data.account != this.to) {
                console.warn('主叫过程,非本通通话，抛弃')
                return
            }
            this._clearCallTimer()

            const duration = 2000
            wxToast(`对方已经挂断`, duration)
            this.hangupAfter(0)
        },
        onControlFn(data) {
            console.log('control')
            console.log(data)
            this.controlHandler(data)
        },
        onWillreconnectFn() {
            this.stopStream()
        },

        // 校验是否需要返回上一层，
        _judgeNavigateBack(delayTime = 0) {
            let pages = getCurrentPages()
            let currentPage = pages[pages.length - 1]
            if (currentPage.route.includes('videoCall') === true) {
                setTimeout(() => {
                    wx.navigateBack(1)
                }, delayTime)
            }
        },
        _personJoin(data) {
            let userlist = Object.assign([], this.userlist)
            let uids = userlist.map(user => user.uid) || []
            if (uids.includes(data.uid) === false) {
                // 非自己
                if (this.loginUser.uid !== data.uid) {
                    let { uid, url } = data;

                    Object.assign((userlist[0] || {}), data)
                    console.log('非自己', this.loginUser, data);
                    this.uid = uid;
                    this.url = url;
                    this.livePlayerStart();
                }
                console.error(userlist)
                this.userlist = userlist
            }
        },
        /**
         * 返回指定uid组件的拉流操作上下文
         */
        _getPlayerComponent(uid) {
            const yunxinPlayer = this.selectComponent(`#yunxinplayer`)
            return yunxinPlayer
        },
        /**
         * 返回推流组件的操作上下文
         */
        _getPusherComponent() {
            const yunxinPusher = this.selectComponent(`#yunxinpusher`)
            return yunxinPusher
        },
        controlHandler(_data) {
            switch (_data.command) {
                // 主动请求从音频切换到视频
                case wx.netcall.NETCALL_CONTROL_COMMAND_SWITCH_AUDIO_TO_VIDEO:
                    console.log('请求从音频切换到视频')
                    wx.showModal({
                        title: '切换通话模式',
                        content: '对方请求从音频切换到音视频',
                        confirmText: '允许',
                        cancelText: '拒绝',
                        success: function (res) {
                            let { confirm, cancel } = res
                            if (confirm) { // 单击了允许
                                this.agreeSwitchAudioToVideo()
                            }
                            if (cancel) { // 单击了取消
                                this.rejectSwitchAudioToVideo()
                            }
                        }
                    })
                    break
                    // 对方同意从音频切换到视频
                case wx.netcall.NETCALL_CONTROL_COMMAND_SWITCH_AUDIO_TO_VIDEO_AGREE:
                    console.log('对方同意从音频切换到视频')
                    // 切换音频到视频
                    this.switchToVideoCall()
                    break
                    // 对方拒绝从音频切换到视频
                case wx.netcall.NETCALL_CONTROL_COMMAND_SWITCH_AUDIO_TO_VIDEO_REJECT:
                    wxToast('对方拒绝音频切换到音视频')
                    break
                    // 从视频切换到音频
                case wx.netcall.NETCALL_CONTROL_COMMAND_SWITCH_VIDEO_TO_AUDIO:
                    console.log('从视频切换到音频')
                    // 切换视频到音频
                    this.switchToVoiceCall()
                    break
            }
        },
        // 拒绝 音频 -> 视频
        rejectSwitchAudioToVideo() {
            wxToast('拒绝切换到视频模式')
            wx.netcall.control({
                command: wx.netcall.NETCALL_CONTROL_COMMAND_SWITCH_AUDIO_TO_VIDEO_REJECT
            })
        },
        // 同意 音频 -> 视频
        agreeSwitchAudioToVideo() {
            wxToast('切换到视频模式')
            // 发送指令
            wx.netcall.control({
                command: wx.netcall.NETCALL_CONTROL_COMMAND_SWITCH_AUDIO_TO_VIDEO_AGREE
            })
            this.switchToVideoCall()
        },
        /**
         * 切换至音频通话单击事件
         */
        switchToVoiceCallHandler() {
            if (this.callTypeIconKind === 'video') {
                // 当前是视频，准备切换至音频
                wx.netcall.control({
                    cid: this.loginUser.cid,
                    command: wx.netcall.NETCALL_CONTROL_COMMAND_SWITCH_VIDEO_TO_AUDIO
                })
                this.switchToVoiceCall()
            } else {
                // 当前是音频准备切换至音视频
                wx.netcall.control({
                    cid: this.loginUser.cid,
                    command: wx.netcall.NETCALL_CONTROL_COMMAND_SWITCH_AUDIO_TO_VIDEO
                })
            }
        },
        switchToVoiceCall() {
            const self = this
            // 切换本地状态
            this.enableCamera = false
            this.mute = this.mute
            // muted=false // 主动关闭麦克风的，麦克风还是关闭的
            this.callTypeIconKind = 'audio'
            wx.netcall.switchMode(wx.netcall.NETCALL_MODE_ONLY_AUDIO)
                .then(() => {
                    console.log('切换模式至 -> ', wx.netcall.NETCALL_MODE_ONLY_AUDIO)
                    this.stopStream(0).then(() => {
                        this.reconnectStreamAfter(100)
                    })
                })
                .catch((err) => {
                    console.error(err)
                })
        },
        /**
         * 切换至视频通话
         */
        switchToVideoCall() {
            const self = this
            // 切换本地状态
            this.enableCamera = true
            this.mute = this.mute
            // this.muted=false // 主动关闭麦克风的，麦克风还是关闭的
            this.callTypeIconKind = 'video'
            wxToast('切换至视频模式')
            wx.netcall.switchMode(wx.netcall.NETCALL_MODE_AUDIO_VIDEO)
                .then(() => {
                    console.log('切换模式至 -> ', wx.netcall.NETCALL_MODE_AUDIO_VIDEO)
                    this.stopStream(0).then(() => {
                        this.reconnectStreamAfter(100)
                    })
                })
                .catch((err) => {
                    console.error(err)
                })
        },
        /**
         * 切换摄像头回调
         */
        switchCameraHandler() {
            this.livePusherContext.switchCamera()
        },
        /**
         * 开关摄像头、麦克风回调
         * 0音视频，1纯音频，2纯视频，3静默
         */
        switchMeetingModeHandler(e) {
            let mode = e.currentTarget.dataset.mode
            let enableCamera = this.enableCamera
            let muted = this.muted
            if (mode == 1) { // 单击了关闭摄像头 => 纯音频
                enableCamera = !enableCamera
                if (enableCamera) { // 摄像头开启 => 关闭摄像头
                    if (muted) {
                        mode = 2
                    } else {
                        mode = 0
                    }
                } else { // 摄像头关闭 => 开启摄像头
                    if (muted) {
                        mode = 3
                    } else {
                        mode = 1
                    }
                }

                if (enableCamera) {
                    wxToast('摄像头已打开')
                } else {
                    wxToast('摄像头已关闭')
                }
            } else if (mode == 2) { // 单击了关闭麦克风 => 纯视频
                muted = !muted
                if (muted) { // 静音：false => true
                    if (enableCamera) {
                        mode = 2
                    } else {
                        mode = 3
                    }
                } else { // true => false
                    if (enableCamera) {
                        mode = 0
                    } else {
                        mode = 1
                    }
                }
                if (muted) {
                    wxToast('麦克风已关闭')
                } else {
                    wxToast('麦克风已打开')
                }
            }
            // 切换本地状态
            this.enableCamera = enableCamera
            this.muted = muted
            if (mode == 1) {
                this.stopStream(0).then(() => {
                    this.reconnectStreamAfter(100)
                })
            }
            wx.netcall.switchMode(mode).then(() => {
                console.log('切换模式至 -> ', mode)
            }).catch((err) => {
                console.error(err)
            })
        },
        switchAudioInputHandler() {
            let muted = this.muted
            this.muted = !muted
        },
        switchVideoInputHandler() {
            let enableCamera = this.enableCamera
            this.enableCamera = !enableCamera
        },
        /**
         * 清除呼叫定时器
         */
        _clearCallTimer() {
            if (this.callTimerId) {
                clearTimeout(this.callTimerId)
                this.callTimerId = null
            }
        },
        /**
         * 清除通话计时定时器
         */
        _clearNetcallTimeTimer() {
            if (this.netcallTimeTimer) {
                clearTimeout(this.netcallTimeTimer)
                this.netcallTimeTimer = null
            }
        },
        onPusherFailed() {
            needRePublish = true
        },
        onPullFailed() {
            needRePlay = true
        },
        _resetData() {
            clearTimeout(this.hangupTimer)
            clearTimeout(this.callTimerId)
            this._resetStreamState()
            this.beCalling = false
            this.isCalling = false
            this.onTheCall = false // 通话中的标记复位
            this.isAccepted = false
            this.userlist = []
        },
        _resetStreamState() {
            clearTimeout(this.stopStreamTimer)
            this.streamNeedReconnect = false
            this.streamStoped = false
        },
        stopStream(duration = 1000) {
            if (this.stopStreamTimer) {
                clearTimeout(this.stopStreamTimer)
            }
            if (this.streamStoped) {
                return Promise.resolve()
            }
            console.log('停止推流')
            return new Promise((resolve, reject) => {
                this.stopStreamTimer = setTimeout(() => {
                    if (!this.livePusherContext) {
                        return
                    }
                    if (!this.livePlayerMap) {
                        this.livePlayerMap = {}
                    }
                    this.userlist.map(user => {
                        const uid = `${user.uid}`
                        if (user.uid != this.loginUser.uid) {
                            console.log(`停止拉流 ${uid}`)
                            if (!this.livePlayerMap[uid]) {
                                this.livePlayerMap[uid] = wx.createLivePlayerContext(`yunxinplayer`, this)
                            }
                            this.livePlayerMap[uid].stop()
                        }
                    })
                    this.livePusherContext.stop({
                        complete: () => {
                            console.log('推流已停止')
                            this.streamStoped = true
                            resolve()
                        }
                    })
                }, duration)
            })
        },
        reconnectStream() {
            if (this.streamNeedReconnect) {
                clearTimeout(this.stopStreamTimer)
                console.log('开始推流')
                this.livePusherContext.start({
                    success: () => {
                        this.streamStoped = false
                    },
                    complete: () => {
                        if (!this.livePlayerMap) {
                            this.livePlayerMap = {}
                        }
                        this.userlist.map(user => {
                            const uid = `${user.uid}`
                            if (user.uid != this.loginUser.uid) {
                                console.log(`重新播放 ${uid}`)
                                if (!this.livePlayerMap[uid]) {
                                    this.livePlayerMap[uid] = wx.createLivePlayerContext(`yunxinplayer`, this)
                                }
                                console.error(this.livePlayerMap[uid])
                                console.log('开始重连拉流')
                                this.livePlayerMap[uid].play()
                            }
                        })
                    }
                })
            }
        },
        reconnectStreamAfter(duration = 0) {
            clearTimeout(this.reconnectStreamTimer)
            this.reconnectStreamTimer = setTimeout(() => {
                this.reconnectStream()
            }, duration)
        },
        /**
         * 格式化需要时间
         */
        _formateDuration(time) {
            let hour = parseInt(time / 3600)
            let minute = parseInt((time - hour * 3600) / 60)
            let second = time % 60
            return {
                hour: toTwo(hour),
                minute: toTwo(minute),
                second: toTwo(second)
            }
        },
        cameraOpenErrorHandler(e) {
            console.error(e)
        },

        //云信player
        /**
         * 开始拉流播放
         */
        livePlayerStart() {
            const uid = this.uid

            if (!this.livePlayerContext) {
                this.livePlayerContext = wx.createLivePlayerContext(`yunxinplayer`, this)
            }
            if (!this.url) {
                return
            }
            if (this.status === 'ready') {
                console.log(`player ${uid} already started`)
                return
            }
            if (this.detached) {
                console.log(`try to start player while component already detached`)
                return
            }
            this.livePlayerContext.play()
        },
        /**
         * 停止拉流播放
         */
        livePlayerStop() {
            console.log(`stopping player ${this.uid}`)
            wx.createLivePlayerContext(`yunxinplayer`, this).stop()
        },
        /**
         * 切换画面方向
         * true为 horizontal，false为 vertical
         */
        changeOrientation(isHorizontal) {
            let orientation = isHorizontal ? 'horizontal' : 'vertical'

            this.orientation = orientation;
        },
        /**
         * 切换填充模式
         * true为 fillCrop，false为 contain
         */
        changeObjectFit(isFillCrop) {
            let objectFit = isFillCrop ? 'fillCrop' : 'contain'

            this.objectFit = objectFit;
        },
        /**
         * 播放器状态更新回调
         */
        stateChangeHandler(e) {
            let { code, message } = e.mp.detail;
            console.log(e);
            console.warn(`yunxin-player code: ${code} - ${message}`)
            let uid = parseInt(e.target.id.split('-')[1])
            if (code === 2004) {
                console.log(`live-player ${uid} started playing`)
                if (this.status === 'loading') {

                    this.status = 'ready';
                }
            } else if (code === -2301) {
                console.log(`live-player ${uid} stopped`, 'error')
                this.status = 'error';
                this.triggerEvent('pullfailed');
            }
        },
        /**
         * 改变画面蒙面
         */
        changeStatus(status) {
            switch (status) {
                case 'leave':
                case 'notConnected':
                    {
                        break
                    }
                default:
                    {
                        status = this.status
                    }
            }
            // console.error(status)
            this.status = status;
        },
        /**
         * 开启调试
         */
        toggleDebug(isDebug) {
            this.debug = isDebug;
        },

        //云信pusher
        /**
         * 播放推流
         * 一般情况下不应手动调用，在推流组件预备好后会自动被调用
         */
        livePusherStart(options = {}) {
            if (!this.livePusherContext) {
                this.livePusherContext = wx.createLivePusherContext()
            }
            console.log(`starting yunxinpusher`);
            this.livePusherContext.start(options)
        },
        /**
         * 停止推流
         */
        livePusherStop(options = {}) {
            if (this.livePusherContext) {
                console.log(`stopping yunxinpusher`);
                this.livePusherContext.stop(options)
            }
        },
        /**
         * 切换前后摄像头
         */
        switchCamera() {
            this.livePusherContext.switchCamera()
        },
        /**
         * 快照
         */
        snapshot() {
            this.livePusherContext.snapshot()
        },

        /**
         * 推流状态变化事件回调
         */
        stateChangeHandler(e) {
            let { code, message } = e.mp.detail;
            console.log(e);
            console.warn(`yunxinpusher code: ${code} - ${message}`)
            if (code === -1307) { // 网络断连，且经多次重连抢救无效，更多重试请自行重启推
                console.log('yunxinpusher stopped', `code: ${code}`);
                this.status = "error";
                this.livePusherContext.stop({
                    complete: () => {
                        this.livePusherContext.start()
                    }
                })
                this.triggerEvent('pushfailed');
            } else if (code === 1008) { // 编码器启动
                console.log(`yunxinpusher started`, `code: ${code}`);
                if (this.status === "loading") {
                    this.status = "ready";
                }
            }
        },
        /**
         * 网络状态通知回调
         */
        netChangeHandler(e) {
            // console.log(`network: ${JSON.stringify(e.mp.detail)}`);
        },
        /**
         * 开启调试
         */
        toggleDebug(isDebug) {
            this.debug = isDebug;
        }
    },

    components: {
        imgWrap,
    },
}

</script>
<style lang="scss" scoped>
@import '~css/public.scss';

.imOrderVideoCall {
    width: 100%;
    height: 100%;
    position: absolute;
    right: 0;
    top: 0;
    z-index: 1000;
    display: none;
    transition: all .2s ease-out;
    &.active {
        display: block;
    }
    &.minSize {
        width: 160rpx;
        height: 184rpx;
        right: 40rpx;
        top: 40rpx;
        .mask, .container {
            display: none;
        }
    }
    & /deep/ {
        .remoteContainer {
            width: 100%;
            height: 100%;
            background-color: #000;
            position: absolute;
            left: 0;
            top: 0;
            div, .player, .camera {
                width: 100% !important;
                height: 100% !important;
                max-width: 100%;
                max-height: 100%;
            }
        }
        .container {
            width: 160rpx;
            height: 184rpx;
            background-color: #000;
            position: absolute;
            right: 40rpx;
            top: 40rpx;
            z-index: 100;
            div, .player, .camera {
                width: 100% !important;
                height: 100% !important;
                max-width: 100%;
                max-height: 100%;
            }
        }
        .mask {
            width: 100%;
            height: 100%;
            position: absolute;
            left: 0;
            top: 0;
            z-index: 10;
            .docutorInfo {
                display: flex;
                width: 100%;
                padding: 0 $padding1;
                padding-top: 100rpx;
                position: absolute;
                left: 0;
                top: 0;
                .avatar {
                    width: 100rpx;
                    height: 100rpx;
                    border-radius: 50%;
                }
                .rightContent {
                    flex: 1;
                    color: #fff;
                    padding-left: 20rpx;
                    line-height: 50rpx;
                    h4 {
                        font-size: 24rpx;
                    }
                }
            }
            .resizeView {
                width: 60rpx;
                height: 60rpx;
                background: url('../../../images/icon/ic_diminish.png') no-repeat center center;
                background-size: 100%;
                position: absolute;
                left: 80rpx;
                top: 80rpx;
            }
            .handle {
                width: 100%;
                padding-bottom: 100rpx;
                position: absolute;
                left: 0;
                bottom: 0;
                .timewait {
                    padding: 20rpx 0;
                    line-height: 50rpx;
                    text-align: center;
                    color: #fff;
                    h4 {
                        font-size: 24rpx;
                    }
                }
                .handleWrap {
                    display: flex;
                    li {
                        flex: 1;
                        display: flex;
                        justify-content: center;
                        .wrap {
                            width: 120rpx;
                            padding-top: 150rpx;
                            line-height: 30rpx;
                            text-align: center;
                            font-size: 24rpx;
                            background: no-repeat center top;
                            background-size: 120rpx;
                            color: #fff;
                        }
                        &.refuse {
                            .wrap {
                                background-image: url('../../../images/icon/ic_video_hangup.png');
                            }
                        }
                        &.response {
                            .wrap {
                                background-image: url('../../../images/icon/ic_video_answer.png');
                            }
                        }
                        &.closeCamera {
                            .wrap {
                                background-image: url('../../../images/icon/ic_video_open.png');
                            }
                            &.active {
                                .wrap {
                                    background-image: url('../../../images/icon/ic_video_close.png');
                                }
                            }
                        }
                        &.hangup {
                            .wrap {
                                background-image: url('../../../images/icon/ic_video_hangup.png');
                            }
                        }
                        &.changeCamera {
                            .wrap {
                                background-image: url('../../../images/icon/ic_video_change.png');
                            }
                        }
                    }
                }
            }
        }
    }
}

</style>

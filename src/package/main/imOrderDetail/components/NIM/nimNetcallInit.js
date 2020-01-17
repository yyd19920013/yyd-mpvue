import SDK from './SDKs/NIM_Web_SDK_weixin_v7.2.0';
import Netcall from './SDKs/NIM_Web_Netcall_weixin_v7.2.0';
import vm from 'src/main';
import { lStore, getCurrentPage } from 'js/yydjs';
import { asyServlet } from 'services';

wx.Netcall = Netcall;
let timerJson = {};
const nimNetcallInit = (readyFn) => {
    reconnection();

    function reconnection() {
        if (wx.netcall) {
            return;
            nimNetcallInitFn();
        } else {
            nimNetcallInitFn();
        }
    };

    function nimNetcallInitFn() {
        let state = {
            onTheCall: false, // 正在通话中
        }

        SDK.NIM.use(Netcall)
        Netcall.destroy()
        wx.netcall = Netcall.getInstance({
            debug: false,
            nim: wx.nim,
        })
        wx.bindNetcallEvent = bindNetcallEvent;
        readyFn && readyFn()
        bindNetcallEvent()

        function bindNetcallEvent() {
            if (!wx.netcall) return;
            const delayFn = (timerName, fn) => {
                clearTimeout(timerJson[timerName]);
                timerJson[timerName] = setTimeout(() => {
                    fn && fn();
                }, 100);
            };

            wx.netcall.once('syncDone', (data) => {
                delayFn('syncDone', () => {
                    console.log(new Date())
                    console.log('登录成功', data)
                    vm.$emit('syncDone', data)
                });
            })
            wx.netcall.once('clientLeave', (data) => {
                delayFn('clientLeave', () => {
                    console.log('有人离开了', data)
                    vm.$emit('clientLeave', data)
                });
            })
            wx.netcall.once('clientJoin', (data) => {
                delayFn('clientJoin', () => {
                    console.log(new Date())
                    // {account,cid,mode,uid,url}
                    console.log('有人加入了', data)
                    state.onTheCall = true // 标记正在通话
                    vm.$emit('clientJoin', data)
                });
            })
            wx.netcall.once('callRejected', (data) => {
                delayFn('callRejected', () => {
                    console.log('对方拒绝了', data)
                    vm.$emit('callRejected', data)
                });
            })
            wx.netcall.once('callAccepted', (data) => {
                delayFn('callAccepted', () => {
                    console.log('对方接听了', data)
                    vm.$emit('callAccepted', data)
                });
            })
            wx.netcall.once('beCalling', (data) => {
                delayFn('beCalling', () => {
                    // {caller,cid,type}
                    console.log('beCalling', data)
                    let currentPage = getCurrentPage();

                    if (!~currentPage.route.indexOf('imOrderDetail')) { // 不在订单详情页面
                        lStore.set('beCallingData', data);
                        wx.navigateTo({
                            url: '/package/main/imOrderDetail/imOrderDetail?showVideoCall=1',
                        });
                        wx.isPushBeCallPage = true;
                    }
                    console.log("$emit('beCalling')");
                    vm.$emit('beCalling', data);
                });
            })
            wx.netcall.once('callerAckSync', (data) => {
                delayFn('callerAckSync', () => {
                    // {timetag,type,fromClientType:number,cid,accepted}
                    console.log('callerAckSync: 其他端已经处理了', data)
                    wx.showToast({
                        title: '已在其他端处理！',
                        duration: 2000,
                        icon: 'none',
                        success: function () {
                            setTimeout(() => {
                                let pages = getCurrentPages()
                                let currentPage = pages[pages.length - 1]
                                if (currentPage.route.includes('imOrderDetail') || currentPage.route.includes('videoCallMeeting')) {
                                    wx.navigateBack(1)
                                }
                            }, 2000)
                        }
                    })
                });
            })
            wx.netcall.once('hangup', (data) => {
                delayFn('hangup', () => {
                    console.log('hangup', data)
                    state.onTheCall = false // 标记正在通话
                    vm.$emit('hangup', data)
                });
            })
            wx.netcall.once('control', (data) => {
                delayFn('control', () => {
                    console.log('control', data)
                    // {cid,account,command}
                    vm.$emit('control', data)
                });
            })
            wx.netcall.once('joinChannel', (data) => {
                delayFn('joinChannel', () => {
                    // {uid,account,cid}
                    console.log('joinChannel', data)
                    vm.$emit('joinChannel', data)
                });
            })
            wx.netcall.once('clientUpdate', (data) => {
                delayFn('clientUpdate', () => {
                    console.log('有人更新了', data)
                });
            })
            wx.netcall.once('error', (error) => {
                delayFn('error', () => {
                    console.error('出错了', error)
                });
            })
            wx.netcall.once('open', (data) => {
                delayFn('open', () => {
                    console.log('socket建立成功', data)
                });
            })
            wx.netcall.once('willreconnect', (data) => {
                delayFn('willreconnect', () => {
                    // 直播通道准备重连
                    vm.$emit('willreconnect', data)
                });
            })
            wx.netcall.once('sendCommandOverTime', (data) => {
                delayFn('sendCommandOverTime', () => {
                    console.log('发送命令超时', data)
                });
            })
            wx.netcall.once('liveRoomClose', (data) => {
                delayFn('liveRoomClose', () => {
                    console.log('互动直播房间解散了', data)
                });
            })
            wx.netcall.once('sessionDuration', (data) => {
                delayFn('sessionDuration', () => {
                    console.log('===结束通话(ms)：', data)
                });
            })
        }
    };
};

export default nimNetcallInit;

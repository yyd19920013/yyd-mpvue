import SDK from './SDKs/NIM_Web_SDK_weixin_v7.2.0';
import vm from 'src/main';
import { lStore, copyJson } from 'js/yydjs';

wx.nimData = {};

/*
    使用此SDKs之前需要在webpack.base.conf.js文件中的babel-loader中忽略NIM_Web_为前缀的js文件
    {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /NIM_Web_*.*\.js/,
        include: [resolve('src'), resolve('test')]
    },
*/

const nimInit = (account, token, doneFn) => {
    reconnection();

    function reconnection() {
        if (wx.nim) {
            lStore.set('isConnected', true);
            return doneFn && doneFn();
            wx.nim.destroy({
                done: function (err) {
                    wx.nim = nimInitFn(account, token);
                }
            });
        } else {
            wx.nim = nimInitFn(account, token);
        }
    };

    function onTeamMembers(obj) {
        var teamId = obj.teamId;
        var members = obj.members;

        wx.nimData.teamMembers = wx.nimData.teamMembers || {};
        wx.nimData.teamMembers[teamId] = wx.nim.mergeTeamMembers(wx.nimData.teamMembers[teamId], members);
        wx.nimData.teamMembers[teamId] = wx.nim.cutTeamMembers(wx.nimData.teamMembers[teamId], members.invalid);
    };

    function pushMsg(msgs) {
        if (!Array.isArray(msgs)) {
            msgs = [msgs];
        }

        for (var i = 0; i < msgs.length; i++) {
            msgs[i].content = safeParse(msgs[i].content);
            msgs[i].custom = safeParse(msgs[i].custom);
            msgs[i].pushPayload = safeParse(msgs[i].pushPayload);
        }

        var sessionId = msgs[0].sessionId;

        wx.nimData.msgs = wx.nimData.msgs || {};
        wx.nimData.msgs[sessionId] = wx.nim.mergeMsgs(wx.nimData.msgs[sessionId], msgs);
    };

    function pushSysMsgs(sysMsgs) {
        wx.nimData.sysMsgs = wx.nim.mergeSysMsgs(wx.nimData.sysMsgs, sysMsgs);
    };

    function nimInitFn(account, token) {
        var appKeyArr = [
            'd6d808f3f7906a037b35e79395c6c4e0', //自己
            '2969cb2602b021155eaee040df91367d', //深圳慢病1
            '8c923f3881671ad71edd808a744e3c83', //深圳慢病2
            '1e19aaed924ad8c73bce7e473c17e3fc', //中山1
            'f57cac8272760564da89adb84b3e5a62', //佛山小程序
        ];
        var appKey = appKeyArr[4];
        var account = account || lStore.get('nimAccount');
        var token = token || lStore.get('nimToken');

        return SDK.NIM.getInstance({
            //基本配置
            debug: false, //是否打开调试模式
            appKey: appKey, //在云信管理后台查看应用的appKey
            account: account, //登录账户
            token: token, //登录账户令牌
            db: false, //是否使用数据库
            syncSessionUnread: true, //是否同步会话的未读数，默认不同步
            syncRobots: true, //是否同步机器人
            autoMarkRead: false, //是否自动标记消息为已收到，默认为true，关闭之后收不到session

            //连接与重连
            onconnect(res) { //连接建立后的回调, 会传入一个对象, 包含登录的信息
                console.log('onconnect', res);
                vm.$emit('nimOnConnect', res);
            },
            onerror(error) { //发生错误的回调, 会传入错误对象
                console.log('onerror', error);
                vm.$emit('nimOnError', error);
            },
            onwillreconnect(res) { //即将重连的回调
                console.log('onwillreconnect', res);
                vm.$emit('nimOnWillReconnect', res);
            },
            ondisconnect(error) { //断开连接后的回调
                console.log('ondisconnect', error);
                /*
                    code: 出错时的错误码, 可能为空
                    302: 账号或者密码错误, 请跳转到登录页面并提示错误
                    417: 重复登录, 已经在其它端登录了, 请跳转到登录页面并提示错误
                    'kicked': 被踢
                    当code为'kicked'的时候, 此对象会有以下字段
                    reason: 被踢的原因
                    samePlatformKick: 不允许同一个帐号在多个地方同时登录
                    serverKick: 被服务器踢了
                    otherPlatformKick: 被其它端踢了
                */
                let { code, message } = error;

                if (code == 'kicked') {
                    setTimeout(function () {
                        if (wx.netcall) {
                            wx.Netcall.destroy();
                        }
                        if (wx.nim) {
                            wx.nim.destroy({
                                done: function (err) {
                                    wx.clearStorageSync();
                                    wx.hideLoading();
                                    wx.showModal({
                                        title: '提示',
                                        content: `IM已断开，请重新登录。原因：${message}`,
                                        showCancel: false,
                                        confirmText: '确定',
                                        confirmColor: '#33adff',
                                        success: function (res) {
                                            if (res.confirm) {
                                                wx.netcall = null;
                                                wx.nim = null;
                                                wx.navigateTo({
                                                    url: '/pages/login/login',
                                                });
                                            }
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
                vm.$emit('nimOnDisconnect', error);
            },

            //多端登录
            onloginportschange(loginPorts) { //多端登录状态变化的回调,会收到登录端列表,以下情况会收到此回调，登录时其它端在线，登录后其它端上线或者下线
                vm.$emit('nimOnLoginPortsChange', loginPorts);
            },


            //用户关系
            onblacklist(blacklist) { //同步黑名单的回调, 会传入黑名单列表blacklist
                wx.nimData.blacklist = wx.nim.mergeRelations(wx.nimData.blacklist, blacklist);
                wx.nimData.blacklist = wx.nim.cutRelations(wx.nimData.blacklist, blacklist.invalid);

                vm.$emit('nimOnBlacklist', wx.nimData.blacklist);
                vm.$emit('nimOnBlacklistAll', wx.nimData.blacklist);
            },
            onsyncmarkinblacklist(obj) { //当前登录用户在其它端加入黑名单/从黑名单移除后的回调
                /*
                    会传入一个参数,包含两个字段
                    account: 要加入黑名单/从黑名单移除的账号
                    isAdd: true表示加入黑名单, false表示从黑名单移除
                */
                if (obj.isAdd) {
                    addToBlacklist(obj);
                } else {
                    removeFromBlacklist(obj);
                }

                function addToBlacklist(obj) {
                    wx.nimData.blacklist = wx.nim.mergeRelations(wx.nimData.blacklist, obj.record);
                };

                function removeFromBlacklist(obj) {
                    wx.nimData.blacklist = wx.nim.cutRelations(wx.nimData.blacklist, obj.record);
                };

                vm.$emit('nimOnMarkInBlacklist', wx.nimData.blacklist);
                vm.$emit('nimOnBlacklistAll', wx.nimData.blacklist);
            },
            onmutelist(mutelist) { //同步静音列表的回调, 会传入静音列表mutelist
                wx.nimData.mutelist = wx.nim.mergeRelations(wx.nimData.mutelist, mutelist);
                wx.nimData.mutelist = wx.nim.cutRelations(wx.nimData.mutelist, mutelist.invalid);

                vm.$emit('nimOnMutelist', wx.nimData.mutelist);
                vm.$emit('nimOnMutelistAll', wx.nimData.mutelist);
            },
            onsyncmarkinmutelist(obj) { //当前登录用户在其它端加入静音列表/从静音列表移除后的回调
                /*
                    会传入一个参数, 包含两个字段
                    account: 要加入黑名单/从黑名单移除的账号
                    isAdd: true表示加入静音列表, false表示从静音列表移除
                */

                if (obj.isAdd) {
                    addToMutelist(obj);
                } else {
                    removeFromMutelist(obj);
                }

                function addToMutelist(obj) {
                    wx.nimData.mutelist = wx.nim.mergeRelations(wx.nimData.mutelist, obj.record);
                };

                function removeFromMutelist(obj) {
                    wx.nimData.mutelist = wx.nim.cutRelations(wx.nimData.mutelist, obj.record);
                };

                vm.$emit('nimOnMarkInMutelist', wx.nimData.mutelist);
                vm.$emit('nimOnMutelistAll', wx.nimData.mutelist);
            },

            //好友关系
            onfriends(friends) { //同步好友列表的回调,会传入好友列表
                wx.nimData.friends = wx.nim.mergeFriends(wx.nimData.friends, friends);
                wx.nimData.friends = wx.nim.cutFriends(wx.nimData.friends, friends.invalid);

                vm.$emit('nimOnFriends', wx.nimData.friends);
                vm.$emit('nimOnFriendsAll', wx.nimData.friends);
            },
            onsyncfriendaction(obj) { //当前登录用户在其它端进行好友相关的操作后的回调
                switch (obj.type) {
                    case 'addFriend': //你在其它端直接加了一个好友
                        onAddFriend(obj.friend);
                        break;
                    case 'applyFriend': //你在其它端申请加了一个好友

                        break;
                    case 'passFriendApply': //你在其它端通过了一个好友申请
                        onAddFriend(obj.friend);
                        break;
                    case 'rejectFriendApply': //你在其它端拒绝了一个好友申请

                        break;
                    case 'deleteFriend': //你在其它端删了一个好友
                        onDeleteFriend(obj.account);
                        break;
                    case 'updateFriend': //你在其它端更新了一个好友
                        onUpdateFriend(obj.friend);
                        break;
                }

                function onAddFriend(friend) {
                    wx.nimData.friends = wx.nim.mergeFriends(wx.nimData.friends, friend);
                };

                function onDeleteFriend(account) {
                    wx.nimData.friends = wx.nim.cutFriendsByAccounts(wx.nimData.friends, account);
                };

                function onUpdateFriend(friend) {
                    wx.nimData.friends = wx.nim.mergeFriends(wx.nimData.friends, friend);
                };

                vm.$emit('nimOnSyncFriendAction', wx.nimData.friends);
                vm.$emit('nimOnFriendsAll', wx.nimData.friends);
            },

            //用户名片
            onmyinfo(user) { //同步登录用户名片的回调, 会传入用户名片
                wx.nimData.myInfo = user;

                vm.$emit('nimOnMyInfo', wx.nimData.myInfo);
                vm.$emit('nimOnMyInfoAll', wx.nimData.myInfo);
            },
            onupdatemyinfo(user) { //当前登录用户在其它端修改自己的个人名片之后的回调,会传入用户名片
                wx.nimData.myInfo = SDK.NIM.util.merge(wx.nimData.myInfo, user);

                vm.$emit('nimOnUpdateMyInfo', wx.nimData.myInfo);
                vm.$emit('nimOnMyInfoAll', wx.nimData.myInfo);
            },
            onusers(users) { //同步好友用户名片的回调,会传入用户名片数组
                wx.nimData.users = wx.nim.mergeUsers(wx.nimData.users, users);

                vm.$emit('nimOnUsers', wx.nimData.users);
                vm.$emit('nimOnUsersAll', wx.nimData.users);
            },
            onupdateuser(user) { //用户名片更新后的回调,会传入用户名片
                wx.nimData.users = wx.nim.mergeUsers(wx.nimData.users, user);

                vm.$emit('nimOnUpdateUser', wx.nimData.users);
                vm.$emit('nimOnUsersAll', wx.nimData.users);
            },

            //机器人列表的回调
            onrobots(robots) { //客户私有化方案不支持
                wx.nimData.robots = robots;

                vm.$emit('nimOnRobots', wx.nimData.robots);
            },

            //群组
            onteams(teams) { //同步群列表的回调,会传入群数组teams
                wx.nimData.teams = wx.nim.mergeTeams(wx.nimData.teams, teams);

                onInvalidTeams(teams.invalid);

                function onInvalidTeams(teams) {
                    wx.nimData.teams = wx.nim.cutTeams(wx.nimData.teams, teams);
                    wx.nimData.invalidTeams = wx.nim.mergeTeams(wx.nimData.invalidTeams, teams);
                };

                vm.$emit('nimOnTeams', wx.nimData.teams);
                vm.$emit('nimOnTeamsAll', wx.nimData.teams);
            },
            onsynccreateteam(team) { //当前登录用户在其它端创建群后的回调,会传入群对象
                wx.nimData.teams = wx.nim.mergeTeams(wx.nimData.teams, team);

                onTeamMembers({
                    teamId: team.teamId,
                    members: owner,
                });

                vm.$emit('nimOnCreateTeam', wx.nimData.teams);
                vm.$emit('nimOnTeamsAll', wx.nimData.teams);
            },
            onUpdateTeam(team) { //更新群的回调,此方法接收一个参数,更新后的群信息
                vm.$emit('nimOnUpdateTeam', team);
            },
            onteammembers(obj) { //同步群成员的回调,一个群对应一个回调,会传入群成员数组
                onTeamMembers(obj);

                vm.$emit('nimOnTeamMembers', wx.nimData.teamMembers);
                vm.$emit('nimOnTeamMembersAll', wx.nimData.teamMembers);
            },
            onsyncteammembersdone() { //当syncTeams和syncTeamMembers同时为true时,会同步所有群的群成员,当所有群的群成员同步结束时,会调用此回调
                vm.$emit('nimOnSyncTeamMembersDone');
            },
            onupdateteammember(teamMember) { //群成员信息更新后的回调,会传入群成员对象,不过此时的信息是不完整的,只会包括被更新的字段。当前登录帐号在其它端修改自己在群里面的昵称时也会收到此回调。
                onTeamMembers({
                    teamId: teamMember.teamId,
                    members: teamMember,
                });

                vm.$emit('nimOnUpdateTeamMember', wx.nimData.teamMembers);
                vm.$emit('nimOnTeamMembersAll', wx.nimData.teamMembers);
            },

            //群消息业务已读通知
            onTeamMsgReceipt(teamMsgReceipts) {
                vm.$emit('nimOnTeamMsgReceipt', teamMsgReceipts);
            },

            //会话
            onsessions(sessions) { //同步最近会话列表回调,会传入会话列表,按时间正序排列,即最近聊过天的放在列表的最后面。
                wx.nimData.sessions = wx.nim.mergeSessions(wx.nimData.sessions, sessions);

                vm.$emit('nimOnSessions', wx.nimData.sessions);
                vm.$emit('nimOnSessionsAll', wx.nimData.sessions);
            },
            onupdatesession(session) { //更新会话的回调
                /*
                    会传入会话,以下情况会收到此回调
                    收到消息
                    发送消息
                    设置当前会话
                    重置会话未读数
                */
                wx.nimData.sessions = wx.nim.mergeSessions(wx.nimData.sessions, session);

                vm.$emit('nimOnUpdateSession', wx.nimData.sessions);
                vm.$emit('nimOnSessionsAll', wx.nimData.sessions);
            },

            //消息
            onroamingmsgs(obj) { //同步漫游消息的回调,每个会话对应一个回调,会传入消息数组
                pushMsg(obj.msgs);

                vm.$emit('nimOnRoamingMsgs', obj.msgs);
                vm.$emit('nimOnMsgAll', wx.nimData.msgs);
            },
            onofflinemsgs(obj) { //同步离线消息的回调,每个会话对应一个回调,会传入消息数组
                pushMsg(obj.msgs);

                vm.$emit('nimOnOfflineMsgs', obj.msgs);
                vm.$emit('nimOnMsgAll', wx.nimData.msgs);
            },
            onmsg(msg) { //收到消息的回调,会传入消息对象
                pushMsg(msg);
                let msgJson = {};

                msgJson[msg.scene + '-' + msg.from] = msg;
                vm.$emit('nimOnMsg', msgJson);
                vm.$emit('nimOnMsgAll', wx.nimData.msgs);
            },

            //系统通知
            onofflinesysmsgs(sysMsgs) { //同步离线系统通知的回调, 会传入系统通知数组
                pushSysMsgs(sysMsgs);

                vm.$emit('nimOnOfflineSysMsgs', sysMsgs);
                vm.$emit('nimOnSysMsgAll', wx.nimData.sysMsgs);
            },
            onsysmsg(sysMsgs) { //收到系统通知的回调, 会传入系统通知
                pushSysMsgs(sysMsgs);

                vm.$emit('nimOnSysMsg', wx.nimData.sysMsgs[wx.nimData.sysMsgs.length - 1]);
                vm.$emit('nimOnSysMsgAll', wx.nimData.sysMsgs);
            },
            onupdatesysmsg(sysMsg) { //更新系统通知未读数的回调
                pushSysMsgs(sysMsg);

                vm.$emit('nimOnUpdateSysMsg', wx.nimData.sysMsgs);
                vm.$emit('nimOnSysMsgAll', wx.nimData.sysMsgs);
            },
            onsysmsgunread(obj) { //收到系统通知未读数的回调
                wx.nimData.sysMsgUnread = obj;

                vm.$emit('nimOnSysMsgUnread', wx.nimData.sysMsgUnread);
                vm.$emit('nimOnSysMsgUnreadAll', wx.nimData.sysMsgUnread);
            },
            onupdatesysmsgunread(obj) { //更新系统通知未读数的回调
                wx.nimData.sysMsgUnread = obj;

                vm.$emit('nimOnUpdateSysMsgUnread', wx.nimData.sysMsgUnread);
                vm.$emit('nimOnSysMsgUnreadAll', wx.nimData.sysMsgUnread);
            },
            onofflinecustomsysmsgs(sysMsgs) { //同步离线自定义系统通知的回调, 会传入系统通知数组
                vm.$emit('nimOnOfflineCustomSysMsgs', sysMsgs);
            },
            oncustomsysmsg(sysMsg) { //收到自定义系统通知的回调, 会传入系统通知
                console.log(sysMsg);
                vm.$emit('nimOnCustomSysMsg', sysMsg);
            },

            //收到广播消息
            onbroadcastmsg(msg) { //收到广播消息
                vm.$emit('nimOnBroadcastMsg', msg);
            },
            onbroadcastmsgs(msgs) { //收到广播消息列表
                vm.$emit('nimOnBroadcastMsgs', msgs);
            },

            //同步完成
            onsyncdone() { //当上面各个同步（不包括下面的同步群成员）完成后, 会调用此回调；注意, SDK保证在onsyncdone调用的时候上面的同步肯定完成了, 但是不保证各个同步回调的顺序。
                lStore.set('isConnected', true);
                doneFn && doneFn();
                vm.$emit('nimOnsyncdone');
                console.log(copyJson(wx.nimData));
            },
        });
    };
};

function safeParse(json) {
    var json = json;

    if (json) {
        try {
            json = JSON.parse(json);
        } catch (e) {}
    }

    return json;
};

export default nimInit;
export {
    safeParse, //安全执行JSON.parse
};

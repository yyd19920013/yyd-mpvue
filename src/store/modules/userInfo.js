import {
  decodeUserInfo,
  getWxPhoneNumber,
  registerPhone,
  registerWX,
  saveSelfInfo,
  getSelfInfo,
  ImageURL,
  logout,
  uploadHeader,
  changeBindPhone
} from 'services';

var userInfo;
// {
//   id:'',
//   userId:'',
//   sso:'',
//   accessToken:'',
//   userName:'',
//   manageUnit:'',
//   manageUnitName:'',
//   displayName:'',
//   tenantName:'',
//   roleName:'',
//   loginName:'',
// };
try {
  var value = wx.getStorageSync('userInfo')
  if (value) {
    userInfo = value;
  }
} catch (e) {}

var wxuserInfo;
// {
// openId:'',
// nickName:'',
// gender:'',
// city:'',
// province:'',
// country:'',
// avatarUrl:'',
// };
try {
  var value = wx.getStorageSync('wxuserInfo')
  if (value) {
    wxuserInfo = value;
  }
} catch (e) {}

var mpiInfo;
// {
// "personName": "", // 姓名
// "mpiId": "", // 个人唯一识别号
// "sex": "", // 性别代码
// "dob": "", // 出生日期
// "phoneNo": "", // 手机号
// "avatar": 0, // 头像记录号
// "nation": "",// 民族代码
// "nationality": "",// 国籍代码
// "education": "", // 文化水平
// "income": 0, // 收入水平
// "bloodType": "", // 血型代码
// "rhBloodType": "", // RH血型代码
// "maritalStatus": "", // 婚姻状况代码
// "insuranceType": "", // 医保类别代码
// "houseHold": "", // 户籍类别代码
// "province": "", // 地址：省
// "city": "", // 地址：市
// "district": "", // 地址：区（县）
// "street": "", // 地址：街道
// "address": "", // 地址
// "certificate": { // 证件
//    "certificateNo": "", // 证件号
//    "certificateType": "01", // 证件类别代码
//    "source": "01" // 发证机构代码
// }
// };
try {
  var value = wx.getStorageSync('mpiInfo')
  if (value) {
    mpiInfo = value;
  }
} catch (e) {}

var loginName = '';
try {
  var value = wx.getStorageSync('loginName')
  if (value) {
    loginName = value;
  }
} catch (e) {}


export default {
  namespaced: true,
  state: {
    wxuserInfo: wxuserInfo,
    userInfo: userInfo,
    mpiInfo: mpiInfo,
    loginName: loginName
  },
  actions: {
    requestUserInfo(context, { encryptedData, iv, code }) {
      return new Promise((resolve, reject) => {
        decodeUserInfo({ encryptedData, iv, code }, (res) => {
          if (res.code == 200) {
            context.commit('clearUserInfo');
            context.commit('updateUserInfo', res.body.userInfo);
            context.commit('updateWXUserInfo', res.body.wxuserInfo);
            if (res.body.wxuserInfo) {
              resolve();
            } else {
              reject('登录授权失败');
            }
          }
        });
      });
    },
    requestWXPhoneNumber(context, { encryptedData, iv, }) {
      return new Promise((resolve, reject) => {
        const openId = context.state.wxuserInfo.openId;
        getWxPhoneNumber({ encryptedData, iv, openId }, (res) => {
          if (res.code == 200) {
            context.commit('updatePhoneNumber', res.body.purePhoneNumber);
            resolve();
          } else {
            reject();
          }
        })
      });
    },
    requestRegisterWX(context, { encryptedData, iv }) {
      return new Promise((resolve) => {
        context.dispatch('requestWXPhoneNumber', { encryptedData, iv }).then(() => {
          const { openId, unionId } = context.state.wxuserInfo;
          const loginName = context.state.loginName;
          registerWX({ loginName, openId, unionId }, (res) => {
            if (res.code == 200) {
              context.commit('updateUserInfo', res.body);
              resolve();
            }
          });
        });
      });
    },
    requestRegisterPhone(context, { loginName, identifyingCode }) {
      return new Promise((resolve, reject) => {
        const { openId, unionId } = context.state.wxuserInfo;
        registerPhone({
          loginName,
          identifyingCode,
          openId,
          unionId
        }, (res) => {
          if (res.code == 200) {
            let userInfo = res.body;
            if (userInfo) {
              userInfo.loginName = loginName;
            }
            context.commit('updateUserInfo', userInfo);
            resolve();
          }
        });
      });
    },
    requestSaveSelfInfo(context, { sex, dob, personName, certificateNo }) {
      return new Promise((resolve) => {
        const phoneNo = context.state.loginName;
        saveSelfInfo({ sex, dob, personName, certificateNo, phoneNo }, (res) => {
          if (res.code == 200) {
            const { mpiId } = res.body;
            var userInfo = context.state.userInfo;
            userInfo.mpiId = mpiId;
            context.commit('updateUserInfo', userInfo);
            context.dispatch('requestGetSelfInfo').then((res) => {
              resolve(res);
            });
          }
        });
      });
    },
    requestGetSelfInfo(context) {
      return new Promise((resolve) => {
        getSelfInfo((res) => {
          if (res.code == 200) {
            context.commit('updateMpiInfo', res.body);
            resolve(res);
          }
        });
      });
    },
    requestLogout(context) {
      return new Promise((resolve) => {
        const { openId } = context.state.wxuserInfo;
        logout(openId, (res) => {
          if (res.code == 200) {
            context.commit('clearUserInfo');
            try {
              if (wx.netcall) {
                wx.Netcall.destroy();
              }
            } catch (e) {}
            try {
              if (wx.nim) {
                wx.nim.destroy({
                  done: function (err) {
                    wx.clearStorageSync();
                    wx.hideLoading();
                    wx.netcall = null;
                    wx.nim = null;
                  }
                });
              }
            } catch (e) {}
            resolve();
          }
        });
      });
    },
    requestUploadHeader(context, filePath) {
      return new Promise((resolve) => {
        uploadHeader(filePath).then((res) => {
          context.commit('updateUserHeader', res.body);
          resolve();
        });
      });
    },
    requestBindPhone(context, { phoneNo, code }) {
      return new Promise((resolve) => {
        changeBindPhone({ phoneNo, code }, (res) => {
          context.commit('updatePhoneNumber', phoneNo);
          resolve();
        });
      });
    },
    recieveLoginSucess() {
      return new Promise((resolve) => {
        wx.redirectTo({
          url: '/package/main/imOrderDetail/imOrderDetail?back=1',
        });
        resolve();
      });
    },
    needLoginAndImproveInfo(context) {
      return new Promise((resolve) => {
        const { needLogin, needImproveInfo } = context.getters;
        if (needLogin) {
          wx.navigateTo({ url: '/pages/login/login' });
        } else if (needImproveInfo) {
          wx.showModal({
            title: '提示', //提示的标题,
            content: '请先完善证件信息', //提示的内容,
            showCancel: true, //是否显示取消按钮,
            cancelText: '取消', //取消按钮的文字，默认为取消，最多 4 个字符,
            cancelColor: '#000000', //取消按钮的文字颜色,
            confirmText: '确定', //确定按钮的文字，默认为取消，最多 4 个字符,
            confirmColor: '#33adff', //确定按钮的文字颜色,
            success: res => {
              if (res.confirm) {
                wx.navigateTo({
                  url: '/package/userInfo/improveInfo/index',
                });
              }
            }
          });
        } else {
          resolve();
        }
      });
    }
  },
  mutations: {
    updateUserInfo(state, data) {
      if (data) {
        try {
          state.userInfo = data;
          wx.setStorageSync('userInfo', data);
        } catch (e) {}

        if (data.loginName) {
          try {
            state.loginName = data.loginName;
            wx.setStorageSync('loginName', data.loginName);
          } catch (error) {}
        }
      }
    },
    updateWXUserInfo(state, data) {
      if (data) {
        try {
          state.wxuserInfo = data;
          wx.setStorageSync('wxuserInfo', data);
        } catch (e) {}
      }
    },
    updatePhoneNumber(state, data) {
      if (data) {
        try {
          state.loginName = data;
          wx.setStorageSync('loginName', data);
          state.userInfo.loginName = data;
          wx.setStorageSync('userInfo', state.userInfo);
        } catch (e) {}
      }
    },
    updateMpiInfo(state, data) {
      if (data) {
        try {
          state.mpiInfo = data;
          wx.setStorageSync('mpiInfo', data);
          console.log(`userInfo:${JSON.stringify(state)}`);
        } catch (e) {}
      }
    },
    updateUserHeader(state, avatar) {
      if (avatar) {
        try {
          state.mpiInfo.avatar = avatar;
          wx.setStorageSync('mpiInfo', state.mpiInfo);
        } catch (error) {

        }
      }
    },
    updateCertified(state, certified) {
      try {
        state.mpiInfo.certified = (certified && certified == 1) ? 1 : 0;
        wx.setStorageSync('mpiInfo', state.mpiInfo);
      } catch (error) {

      }
    },
    clearUserInfo(state) {
      try {
        state.wxuserInfo = null;
        state.mpiInfo = null
        state.userInfo = null
        state.loginName = ''
        wx.clearStorageSync();
      } catch (error) {

      }
    }
  },
  getters: {
    // 是否需要登录
    needLogin(state) {
      return !state.userInfo || !state.userInfo.accessToken;
    },
    // 是否需要完善信息
    needImproveInfo(state) {
      return !state.userInfo || !state.userInfo.mpiId;
    },
    // 是否需要注册
    needRegister(state) {
      return !state.userInfo;
    },
    // 需要实名认证
    needRealName(state) {
      return !state.mpiInfo || !state.mpiInfo.certified || state.mpiInfo.certified == 0;
    },
    userAvatar(state) {
      if (state.mpiInfo && state.mpiInfo.avatar) {
        return ImageURL + state.mpiInfo.avatar;
      } else {
        const { avatarUrl = '' } = state.wxuserInfo || {};
        return avatarUrl;
      }
    },
    userName(state) {
      if (state.mpiInfo && state.mpiInfo.personName) {
        const { personName = '' } = state.mpiInfo;
        return personName;
      } else {
        const { nickName = '' } = state.wxuserInfo || {};
        return nickName;
      }
    },
    isMySelfGetter(state) {
      return (mpiId) => {
        if (mpiId && state.mpiInfo && state.mpiInfo.mpiId) {
          return state.mpiInfo.mpiId == mpiId;
        } else {
          return false;
        }
      }
    }
  }
};

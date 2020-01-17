<template>
  <div>
    <HeaderView />
    <div class="button-wrapper">
      <template v-if="isScopeUserInfo">
        <van-button round size="large" color="#19B20A" open-type="getPhoneNumber" @getphonenumber="getphonenumber">
          微信一键登录
        </van-button>
        <div class="divider" />
        <van-button round size="large" color="#33adff" @click="redirectToRegister">
          手机号验证登录
        </van-button>
      </template>
      <template v-else>
        <van-button round size="large" color="#19B20A" open-type="getUserInfo" @getuserinfo="bindWXGetUserinfo">
          微信一键登录
        </van-button>
        <div class="divider" />
        <van-button round size="large" color="#33adff" open-type="getUserInfo" @getuserinfo="bindPhoneGetUserinfo">
          手机号验证登录
        </van-button>
      </template>
    </div>
    <van-dialog title="手机权限申请" message="为了账户安全，请绑定手机号，如拒绝将登录失败" :show="showPhoneDialog" show-cancel-button cancel-button-text="拒绝" confirm-button-open-type="getPhoneNumber" confirm-button-text="允许" @close="onClosePhoneDialog" @getphonenumber="getphonenumber" />
  </div>
</template>
<script>
import { mapState, mapActions, mapGetters } from 'vuex';
import HeaderView from './components/HeaderView';
import { resetVueData, wxToast } from 'js/yydjs';
import { decodeUserInfo, getWxPhoneNumber } from 'services';

export default {
  name: 'login',
  components: {
    HeaderView
  },
  data() {
    return {
      showPhoneDialog: false,
      loginCode: '',
      isScopeUserInfo: false,
      isDecodeUserInfo: false,
      userInfo: {
        encryptedData: '',
        iv: ''
      }
    }
  },
  computed: {
    ...mapGetters('userInfo', [
      'needRegister',
      'needImproveInfo'
    ])
  },
  onLoad() {
    wx.showLoading({
      title: '请求中',
      mask: true,
    });
    var self = this;
    wx.login({
      success: res => {
        const code = res.code;
        self.loginCode = code;
        self.getScopeUserInfo();
        wx.hideLoading();
      },
      fail: () => {
        wx.hideLoading();
      }
    });
  },
  onUnload() {
    resetVueData(this);
  },
  onShow() {
    wx.hideLoading();
    wx.hideToast();
  },
  methods: {
    ...mapActions('userInfo', [
      'requestUserInfo',
      'requestRegisterWX',
      'requestGetSelfInfo',
      'recieveLoginSucess'
    ]),
    getScopeUserInfo() {
      var self = this;
      // 查看是否授权
      wx.getSetting({
        success(res) {
          if (res.authSetting['scope.userInfo']) {
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称
            wx.getUserInfo({
              success: function (res) {
                if (res.errMsg == 'getUserInfo:ok') {
                  self.userInfo = res;
                  self.isScopeUserInfo = true;
                }
              }
            })
          }
        }
      })
    },
    decodeUserInfo() {
      return new Promise((resolve) => {
        const { encryptedData, iv } = this.userInfo;
        var self = this;
        this.requestUserInfo({ encryptedData, iv, code: this.loginCode })
          .then(() => {
            self.isDecodeUserInfo = true;
            if (self.needRegister) {
              resolve()
            } else {
              self.loginSucess();
            }
          })
          .catch((errMsg) => {
            wxToast(errMsg);
          })
      });
    },
    // 手机验证登录
    bindPhoneGetUserinfo(e) {
      let { encryptedData, iv, errMsg } = e.mp.detail;
      if (errMsg == 'getUserInfo:ok') {
        this.userInfo = e.mp.detail;
        this.isScopeUserInfo = true;
        if (this.isDecodeUserInfo) {
          wx.redirectTo({ url: '/pages/login/register' });
        } else {
          this.decodeUserInfo().then(() => {
            wx.redirectTo({ url: '/pages/login/register' });
          });
        }
      } else {
        wxToast('登录授权失败');
      }
    },
    // 微信授权登录
    bindWXGetUserinfo(e) {
      let { encryptedData, iv, errMsg } = e.mp.detail;
      if (errMsg == 'getUserInfo:ok') {
        this.userInfo = e.mp.detail;
        this.isScopeUserInfo = true;
        var self = this;
        if (this.isDecodeUserInfo) {
          self.showPhoneDialog = true;
        } else {
          this.decodeUserInfo().then(() => {
            self.showPhoneDialog = true;
          });
        }
      } else {
        wxToast('登录授权失败');
      }
    },
    onClosePhoneDialog() {
      this.showPhoneDialog = false;
    },
    getphonenumber(e) {
      const { errMsg, encryptedData, iv } = e.mp.detail;
      var self = this;
      if (errMsg == "getPhoneNumber:ok") {
        if (this.isDecodeUserInfo) {
          this.requestRegisterWX({ encryptedData, iv }).then(() => {
            self.loginSucess();
          });
        } else {
          this.decodeUserInfo().then(() => {
            self.requestRegisterWX({ encryptedData, iv }).then(() => {
              self.loginSucess();
            });
          });
        }
      } else {
        wxToast('登录授权失败');
      }
    },
    redirectToRegister() {
      if (this.isDecodeUserInfo) {
        wx.redirectTo({ url: './register' });
      } else {
        this.decodeUserInfo().then(() => {
          wx.redirectTo({ url: './register' });
        });
      }
    },
    loginSucess() {
      if (this.needImproveInfo) {
        wx.redirectTo({ url: '../improveInfo/index' });
      } else {
        var self = this;
        this.requestGetSelfInfo().then(() => {
          wxToast('登录成功');
          setTimeout(() => {
            self.recieveLoginSucess();
          }, 2000);
        });
      }
    }
  }
}

</script>
<style lang="scss" scoped>
@import '~css/public.scss';
.button-wrapper {
  padding: 0 10%;
  margin-top: 15%;
  .divider {
    height: 30px;
  }
}

</style>

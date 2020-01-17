<template>
  <div>
    <HeaderView />
    <div class="body">
      <div class="input-wrapper">
        <image class="prefix-icon" :src="phoneImgSrc" mode="widthFix" />
        <input :autofocus="true" placeholder-style="color:#B8BCC6" placeholder="请输入您的手机号" type="number" confirm-type="done" maxlength="11" v-model.lazy="phone" @input="onPhoneChanged" />
      </div>
      <div class="input-wrapper">
        <image class="prefix-icon" :src="messageImgSrc" mode="widthFix" />
        <input placeholder-style="color:#B8BCC6" placeholder="请输入手机验证码" type="number" maxlength="6" v-model.lazy="code" @input="onCodeChanged" />
        <van-button round size="small" color="#fa7a8b" :disabled="codeBtnDisabled" @click="handleCodeClick">
          {{codeBtnText}}
        </van-button>
      </div>
    </div>
    <div class="footer">
      <van-button round size="large" color="#33adff" @click="handleConfirmClick">
        确定
      </van-button>
      <div class="message">
        <span>点击确定，即代表已读并同意</span>
        <span @click="handleAgreementClick" class="protocol">《用户注册登录协议》</span>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions, mapGetters } from 'vuex';
import HeaderView from './components/HeaderView';
import { registerSmsCode } from 'services';
import { resetVueData, wxToast } from 'js/yydjs';

export default {
  name: 'login',
  components: {
    HeaderView
  },
  data() {
    return {
      phoneImgSrc: require('images/login/ic_login_iphone.png'),
      messageImgSrc: require('images/login/ic_login_message.png'),
      codeBtnDisabled: false,
      codeBtnText: '获取验证码',
      phone: '',
      code: '',
    }
  },
  computed: {
    ...mapGetters('userInfo', [
      'needImproveInfo'
    ])
  },
  watch: {
    phone(newVal, oldVal) {
      if (newVal.length >= 11 && !this.timer) {
        this.codeBtnDisabled = false;
      }
    }
  },
  onUnload() {
    this.clearTimer();
    resetVueData(this);
  },
  methods: {
    ...mapActions('userInfo', [
      'requestRegisterPhone',
      'requestGetSelfInfo',
      'recieveLoginSucess'
    ]),
    onPhoneChanged(e) {
      this.phone = e.target.value;
    },
    onCodeChanged(e) {
      this.code = e.target.value;
    },
    // 获取验证码
    handleCodeClick() {
      if (this.codeBtnDisabled) {
        return;
      }
      var reg = /^[1][3,4,5,7,8][0-9]{9}$/;
      if (!reg.test(this.phone)) {
        wx.showToast({
          title: '请输入正确的手机号', //提示的内容,
          icon: 'none', //图标,
          duration: 2000, //延迟时间,
          mask: true, //显示透明蒙层，防止触摸穿透
        });
        return;
      }
      this.code = '';
      var self = this;

      registerSmsCode(this.phone, (res) => {
        self.codeBtnDisabled = true;
        var reduceTime = 60;

        self.timer = setInterval(() => {
          if (reduceTime > 0) {
            reduceTime--;
            self.codeBtnText = reduceTime + 's';
          } else {
            self.clearTimer();
          }
        }, 1000);
      });
    },
    // 清除倒计时定时器
    clearTimer() {
      clearInterval(this.timer);
      this.timer = null;
      this.codeBtnDisabled = false;
      this.codeBtnText = '获取验证码';
    },
    // 注册协议
    handleAgreementClick() {
      wx.navigateTo({
        url: '/package/userInfo/login/agreement'
      });
    },
    // 确定
    handleConfirmClick() {
      var reg = /^[1][3,4,5,7,8][0-9]{9}$/;
      if (!reg.test(this.phone)) {
        wx.showToast({
          title: '请输入正确的手机号', //提示的内容,
          icon: 'none', //图标,
          duration: 2000, //延迟时间,
          mask: true, //显示透明蒙层，防止触摸穿透
        });
      } else if (!this.code) {
        wx.showToast({
          title: '请输入手机验证码', //提示的内容,
          icon: 'none', //图标,
          duration: 2000, //延迟时间,
          mask: true, //显示透明蒙层，防止触摸穿透
        });
      } else {
        var self = this;
        this.requestRegisterPhone({ loginName: this.phone, identifyingCode: this.code })
          .then(() => {
            self.loginSucess();
          });
      }
    },
    loginSucess() {
      if (this.needImproveInfo) {
        wx.redirectTo({ url: '/package/userInfo/improveInfo/index' });
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
@import "~css/public.scss";
.body {
  padding: 0 10%;
  margin-top: 15%;
  .input-wrapper {
    display: flex;
    align-items: center;
    height: 49px;
    border-bottom: 1px solid $dividerColor;
    .prefix-icon {
      width: 22px;
    }
    input {
      display: inline-block;
      flex: 1;
      height: 100%;
      margin: 0 10px;
      font-size: 14px;
      color: $text;
    }
  }
}
.footer {
  margin-top: 30px;
  margin: 30px 10% 0;
  .message {
    font-size: 12px;
    color: $lightGrayText;
    text-align: center;
    margin-top: 10px;
    .protocol {
      color: $main;
    }
  }
}

</style>

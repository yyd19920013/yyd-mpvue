<template>
  <div class="user">
    <HeaderView :name="userName" :avatar="userAvatar" :needLogin="needLogin" @edit="handleEditClick" @login="handleLoginClick" />
    <OrderGrid :badge="orderBadge" @clickItem="handleOrderClick" />
    <ul v-if="list && list.length > 0">
      <ListCell v-for="(item,index) of list" :key="index" :title="item.title" :iconSrc="item.iconSrc" :showSeperator="index != list.length -1" @click="handleCellClick(item.title)" />
    </ul>
    <view v-if="!needLogin" class="footer" hover-class="touch-highlight" @click="handleLogout">
      退出登录
    </view>
  </div>
</template>
<script>
import { mapActions, mapState, mapGetters } from 'vuex';
import { myOrderCountAll } from 'services';
import HeaderView from './components/HeaderView';
import OrderGrid from './components/OrderGrid';
import ListCell from './components/ListCell';

export default {
  name: 'user',
  components: {
    HeaderView,
    OrderGrid,
    ListCell
  },
  data() {
    return {
      list: [
        // {
        //   iconSrc:require('images/user/ic_user_files.png'),
        //   title:'健康档案管理'
        // },
        {
          iconSrc: require('images/user/ic_user_jzr.png'),
          title: '就诊人管理'
        },
        {
          iconSrc: require('images/user/ic_user_service_dzgl.png'),
          title: '收货地址管理'
        }
      ],
      orderBadge: {}
    }
  },
  computed: {
    ...mapGetters('userInfo', [
      'userAvatar',
      'userName',
      'needLogin'
    ])
  },
  onShow() {
    if (!this.needLogin) {
      this.requestOrderCount();
    } else {
      this.orderBadge = {};
    }
  },
  onShareAppMessage() {
    return {
      title: '创业慧康互联网医院',
      path: '/pages/user/index',
      success: function (res) {
        // 转发成功之后的回调
        if (res.errMsg == 'shareAppMessage:ok') {

        }
      },
      fail: function (res) {
        // 转发失败之后的回调
        if (res.errMsg == 'shareAppMessage:fail cancel') {
          // 用户取消转发
        } else if (res.errMsg == 'shareAppMessage:fail') {
          // 转发失败，其中 detail message 为详细失败信息
        }
      },
    }
  },
  methods: {
    ...mapActions('userInfo', [
      'requestLogout',
      'needLoginAndImproveInfo'
    ]),
    // 编辑信息
    handleEditClick() {
      this.needLoginAndImproveInfo().then(() => {
        wx.navigateTo({ url: '/package/userInfo/personalInfo/index' });
      });
    },
    // 去登录
    handleLoginClick() {
      wx.navigateTo({ url: '/pages/login/login' });
    },
    // 点击订单
    handleOrderClick(title) {
      this.needLoginAndImproveInfo().then(() => {
        if (title === '咨询订单') {
          wx.navigateTo({
            url: '/package/order/consultOrder/orderList'
          });
        } else if (title === '复诊订单') {
          wx.navigateTo({
            url: '/package/order/revisitOrder/orderList'
          });
        } else if (title === '药品订单') {
          wx.navigateTo({
            url: '/package/order/drugOrder/orderList'
          });
        } else if (title === '挂号订单') {
          wx.showToast({
            title: '挂号订单开发中...',
            icon: 'none',
            duration: 2000
          })
        }
      });
    },
    // 点击列表
    handleCellClick(title) {
      this.needLoginAndImproveInfo().then(() => {
        if (title === '健康档案管理') {

        } else if (title === '就诊人管理') {
          wx.navigateTo({ url: '/package/userInfo/family/familyManage' });
        } else if (title === '收货地址管理') {
          wx.navigateTo({ url: '/package/userInfo/address/addressList' });
        }
      });
    },
    // 退出登录
    handleLogout() {
      var self = this;
      wx.showModal({
        title: '提示', //提示的标题,
        content: '确定退出登录互联网医院?', //提示的内容,
        showCancel: true, //是否显示取消按钮,
        cancelText: '取消', //取消按钮的文字，默认为取消，最多 4 个字符,
        cancelColor: '#000000', //取消按钮的文字颜色,
        confirmText: '确定', //确定按钮的文字，默认为取消，最多 4 个字符,
        confirmColor: '#33adff', //确定按钮的文字颜色,
        success: res => {
          if (res.confirm) {
            self.requestLogout().then(() => {
              wx.reLaunch({ // 重新加载整个app
                url: '/pages/home/index'
              })
            });
          }
        }
      });
    },
    async requestOrderCount() {
      try {
        var response = await myOrderCountAll();
        if (response.body) {
          this.orderBadge = response.body;
        }
      } catch (error) {
        this.orderBadge = {};
      }
    }
  }
}

</script>
<style lang="scss" scoped>
@import "~css/public.scss";
.user {
  position: absolute;
  background-color: $bg;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  .footer {
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    width: 180px;
    height: 36px;
    line-height: 36px;
    text-align: center;
    border: 2px solid $dividerColor;
    border-radius: 18px;
    font-size: 14px;
    &.touch-highlight {
      @include touchHighlightedStyle;
    }
  }
}

</style>

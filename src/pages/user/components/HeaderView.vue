<template>
  <div class="header-view" @click="onEditClick">
    <div class="background">
      <image class="bg-img" :src="backgroundSrc" mode="scaleToFill"/>
    </div>
    <div class="content">
      <template v-if="needLogin">
        <div class="need-login" @click="onLoginClick">
          去登录
        </div>
      </template>
      <template v-else>
        <image class="image" :src="avatar" mode="scaleToFill"/>
        <div class="info">
          <span class="name">{{name}}</span>
          <image :src="edtImgSrc" class="edit-img" mode="scaleToFill"/>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  name:'user-header-view',
  props:{
    name:{
      type:String,
      default:''
    },
    avatar:{
      type:String,
      default:require('images/common/img_head_user.png')
    },
    needLogin:{
      type:Boolean,
      default:false
    }
  },
  data() {
    return {
      backgroundSrc:require('images/bg/bg_user.png'),
      edtImgSrc:require('images/user/ic_edit_white.png'),
    }
  },
  methods:{
    onEditClick() {
      if (this.needLogin) {
        return;
      }
      this.$emit('edit');
    },
    onLoginClick() {
      this.$emit('login');
    }
  }
}
</script>

<style lang="scss" scoped>
.header-view {
  width: 100%;
  height: 0;
  padding-bottom: 26.67%;
  position: relative;
  background-color: white;
  .background {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    .bg-img {
      width: 100%;
      height: 100%;
    }
  }
  .content {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    display: flex;
    align-items: center;
    padding: 0 15px;
    .need-login {
      color: white;
      height: 30px;
      width: 80px;
      font-size: 14px;
      text-align: center;
      line-height: 30px;
      border: 1px solid white;
      border-radius: 15px;
    }
    .image {
      width:50px;
      height: 50px;
      border-radius: 50%;
    }
    .info {
      display: flex;
      align-items: center;
      margin-left: 15px;
      color: white;
      .name {
        font-size: 18px;
      }
      .edit-img {
        width: 20px;
        height: 20px;
        margin-left: 5px;
      }
    }
  }
}
</style>
<template>
  <div class="header-view">
    <div class="bg-wrapper">
      <div class="bg-content">
        <image
          class="bg-img"
          :src="backgroundSrc"
          mode="scaleToFill"
        />
        <image
          class="logo-img"
          :src="logoSrc"
          mode="scaleToFill"
        />
      </div>
    </div>
    <span class="app-name">
      互联网医院
    </span>
  </div>
</template>


<script>
export default {
  name:'HeaderView',
  data() {
    return {
      backgroundSrc:require('images/login/img_bg_register.png'),
      logoSrc:require('images/common/ic_logo.png'),
    }
  }
}
</script>

<style lang="scss" scoped>
.header-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  .bg-wrapper {
    width: 100%;
    height: 0;
    padding-bottom: 36.62%;
    position: relative;
    .bg-content {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      .bg-img {
        width: 100%;
        height: 100%;
      }
      .logo-img {
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%) translateY(50%);
        width: 85px;
        height: 85px;
        border-radius: 16px;
        box-shadow: 0 0 20px -10px;
        z-index: 10;
      }
    }
  }
  .app-name {
    margin-top: 55px;
    font-size: 18px;
    color: #666;
    font-weight: bold;
  }
}
</style>
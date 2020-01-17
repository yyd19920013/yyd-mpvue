<template>
  <div class="banner">
    <div class="banner-content">
      <template v-if="showSwiper">
        <div class="banner-view">
          <swiper v-if="imgUrls.length > 0" indidator-dots="imgUrls.length > 1" :circular="true">
            <block v-for="(item, index) in imgUrls" :key="index">
              <swiper-item>
                <image class="banner-image" :src="item" mode="aspectFill"></image>
              </swiper-item>
            </block>
          </swiper>
        </div>
      </template>
      <template v-else>
        <div class="banner-view">
          <image class="banner-image" :src="imgDefault" mode="aspectFill" />
        </div>
      </template>
    </div>
  </div>
</template>
<script>
export default {
  name: 'banner',
  props: {
    imgUrls: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      imgDefault: require('images/home/img_banner.jpg')
    }
  },
  computed: {
    showSwiper() {
      return this.imgUrls && this.imgUrls.length > 0
    }
  }
}

</script>
<style lang="scss" scoped>
.banner {
  margin: 15px;
  border-radius: 6px;
  .banner-content {
    height: 0;
    padding-bottom: 33.33%;
    overflow: hidden;
    position: relative;
    .banner-view {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      .banner-image {
        height: 100%;
        width: 100%;
        border-radius: 6px;
      }
    }
  }
}

</style>

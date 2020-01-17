<template>
  <div class="list-header" @click="onClick">
    <span class="title">{{title}}</span>
    <div class="more">
      更多
      <image class="more-img" :src="moreImgSrc" mode="widthFix"/>
    </div>
  </div>
</template>

<script>
export default {
  name: 'list-header',
  props: {
    title: String
  },
  data () {
    return {
      moreImgSrc: require('images/common/ic_arrow_more.png')
    }
  },
  methods:{
    onClick() {
      this.$emit('click');
    }
  }
}
</script>

<style lang="scss" scoped>
.list-header {
  margin:0px 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .title {
    font-size: 16px;
  }
  .more {
    font-size: 14px;
    display: flex;
    align-items: center;
    color: #999;
    .more-img {
      width: 6px;
      margin-left: 5px;
    }
  }
}
</style>
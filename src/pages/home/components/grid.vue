<template>
  <div class="grid">
    <div class="grid-view">
      <div 
        v-for="(item,index) of list"
        :key="index"
        class="grid-item"
        @click="handleGridClick(item)"
      >
        <image class="bg-image" :src="item.background" mode="scaleToFill"/>
        <div class="grid-text">
          <span 
            class="grid-title"
            :style="{
              color:item.titleColor
            }"
          >
            {{item.title}}
          </span>
          <span 
            class="grid-subtitle"
            :style="{
              color:item.subTitleColor
            }"
          >
            {{item.subTitle}}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'grid',
  data () {
    return {
      list: [{
        background: require('images/home/img_home_tooly.png'),
        title: '复诊配药',
        titleColor: '#0099FF',
        subTitle: '医生复诊 在线配药',
        subTitleColor: '#70B3E2'
      }, {
        background: require('images/home/img_home_zxzx.png'),
        titleColor: '#FB9925',
        title: '在线咨询',
        subTitle: '咨询专家 把握病情',
        subTitleColor: '#E8B476'
      }]
    }
  },
  methods: {
    handleGridClick (item) {
      this.$emit('clickGrid', item.title)
    }
  }
}
</script>

<style lang="scss" scoped>
.grid {
  height: 0;
  padding-bottom: 21%;
  margin: 15px 15px 20px;
  position: relative;
  .grid-view {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: space-between;
    .grid-item{
      width: 49%;
      height: 100%;
      position: relative;
      display: flex;
      align-items: center;
      .bg-image {
        height: 100%;
        width: 100%;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 0;
      }
      .grid-text {
        z-index: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        margin-left: 13px;
        .grid-title {
          font-size: 16px;
        }
        .grid-subtitle {
          margin-top: 8px;
          font-size: 11px;
        }
      }
    }
  }
}

</style>
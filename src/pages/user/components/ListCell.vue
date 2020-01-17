<template>
  <div class="list-cell" @click="handleClick">
    <image class="image" :src="iconSrc" mode="scaleToFix"/>
    <div 
      class="content"
      :style="{
        borderBottom: showSeperator ? '1px solid #e4e4e4' : '0 solid #e4e4e4'
      }"
    >
      <div class="title">
        {{title}}
      </div>
      <image class="arrow" :src="arrowSrc" mode="widthFix"/>
    </div>
  </div>
</template>

<script>
export default {
  name:'list-cell',
  props:{
    iconSrc:{
      type:String,
      default:null
    },
    title:{
      type:String,
      default:''
    },
    showSeperator:{
      type:Boolean,
      default:true
    }
  },
  data() {
    return {
      arrowSrc:require('images/common/ic_arrow_more.png')
    }
  },
  methods:{
    handleClick() {
      this.$emit('click');
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~css/public.scss";
.list-cell {
  display: flex;
  align-items: center;
  background-color: white;
  .image {
    width: 22px;
    height: 22px;
    margin-left: 15px;
  }
  .content {
    flex: 1;
    margin-left: 15px;
    display: flex;
    align-items: center;
    height: 49px;
    min-height: 49px;
    .title {
      flex: 1;
      font-size: 14px;
      color: $text;
    }
    .arrow {
      width: 6px;
      margin-left: 5px;
      margin-right: 15px;
    }
  }
}
</style>
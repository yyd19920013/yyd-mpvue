<template>
  <div class="order-grid">
    <div class="header">
      我的订单
    </div>
    <div class="grid">
      <div 
        class="grid-item"
        v-for="(item,gridIndex) of list"
        :key="gridIndex"
        @click="handleGridClick(item)"
      >
        <van-icon :name="item.imgSrc" size="24px" :info="item.count"/>
        <div class="title">{{item.title}}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name:'order-grid',
  props:{
    badge:{
      type:Object,
      default:{
        consultCount:0,
        revisitCount:0,
        recipeCount:0
      }
    }
  },
  computed:{
    list() {
      return [
        {
          title:'咨询订单',
          imgSrc:require('images/user/ic_user_zxdd.png'),
          count:this.getBadgeText(this.badge.consultCount || 0)
        },
        {
          title:'复诊订单',
          imgSrc:require('images/user/ic_user_fzdd.png'),
          count:this.getBadgeText(this.badge.revisitCount || 0)
        },
        {
          title:'药品订单',
          imgSrc:require('images/user/ic_user_ypdd.png'),
          count:this.getBadgeText(this.badge.recipeCount || 0)
        },
        // {
        //   title:'挂号订单',
        //   imgSrc:require('images/user/ic_user_ghdd.png'),
        //   count:0
        // }
      ];
    }
  },
  methods:{
    handleGridClick(item) {
      this.$emit('clickItem',item.title);
    },
    getBadgeText(count) {
      if (count > 99) {
        return '99+';
      } else if (count > 0) {
        return `${count}`;
      } else {
        return '';
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~css/public.scss";
.order-grid {
  margin: 10px 0;
  background-color: white;
  .header {
    height: 40px;
    line-height: 40px;
    font-size: 14px;
    color:$text;
    text-align: center;
  }
  .grid {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    .grid-item {
      margin: 15px 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      .title {
        font-size: 14px;
        color:$grayText;
        margin-top: 10px;
      }
    }
  }
}
</style>
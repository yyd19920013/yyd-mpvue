<template>
  <div class="container">
    <banner :imgUrls="imgUrls" />
    <grid @clickGrid="handleGridClick" />
    <ListHeader title='热门医生' @click="handleMoreDoctorClick" />
    <DoctotrCard v-for="(item,index) of doctors" :key="index" :item="item" @click="onDoctorClick(item)" />
  </div>
</template>
<script>
import banner from './components/banner'
import grid from './components/grid'
import ListHeader from './components/ListHeader'
import DoctotrCard from './components/DoctorCard'
import { residentIndex } from 'services';
import { mapActions } from 'vuex';

export default {
  components: {
    banner,
    grid,
    ListHeader,
    DoctotrCard
  },
  data() {
    return {
      imgUrls: [],
      doctors: [],
    }
  },
  onShow() {
    this.requestDdata();
  },
  onPullDownRefresh: function () {
    this.requestDdata();
  },
  onShareAppMessage() {
    return {
      title:'创业慧康互联网医院',
      path:'/pages/home/index',
      success: function(res){
　　　　　　// 转发成功之后的回调
　　　　　　if(res.errMsg == 'shareAppMessage:ok'){

　　　　　　}
　　　　},
      fail: function(res){
　　　　　　// 转发失败之后的回调
　　　　　　if(res.errMsg == 'shareAppMessage:fail cancel'){
　　　　　　　　// 用户取消转发
　　　　　　}else if(res.errMsg == 'shareAppMessage:fail'){
　　　　　　　　// 转发失败，其中 detail message 为详细失败信息
　　　　　　}
　　　　},
    }
  },
  methods: {
    ...mapActions('userInfo',[
      'needLoginAndImproveInfo'
    ]),
    // 点击grid
    handleGridClick(name) {
      if (name === '复诊配药') {
        this.needLoginAndImproveInfo().then(()=>{
          wx.navigateTo({
            url: '/package/main/doctorHome/selectPatient?type=homeVisit'
          });
        });
      } else if (name === '在线咨询') {
        wx.navigateTo({
          url: '/package/main/findDoctor/findDoctor?type=homeConsult'
        });
      }
    },
    handleMoreDoctorClick() {
      wx.navigateTo({
        url: '/package/main/findDoctor/findDoctor'
      });
    },
    async requestDdata() {
      try {
        var response = await residentIndex();
        wx.stopPullDownRefresh();
        if (!response || !response.body) {
          return;
        }
        var body = response.body;
        this.doctors = body.doctors || []
      } catch (error) {
        wx.stopPullDownRefresh()
      }
    },
    onDoctorClick(item) {
      wx.navigateTo({
        url: `/package/main/doctorHome/doctorHome?id=${item.id}`
      });
    }
  }
}

</script>
<style lang="scss" scoped>
@import "~css/public.scss";
.container {
  min-height: 100vh;
}

</style>

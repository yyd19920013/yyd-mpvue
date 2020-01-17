<template>
  <div class="doctor-card" @click="onClick">
    <image 
      class="avatar"
      :src="doctorAvatar" 
      mode="scaleToFill"
    />
    <div class="content">
      <div>
        <span class="content-name">{{item.doctorName || ''}}</span>
        <span class="content-title">{{item.doctorLevelText || ''}}</span>
      </div>
      <div>
        <span class="content-dept">{{item.orgFullName || ''}}</span>
        <span class="content-dept">{{item.deptName || ''}}</span>
      </div>
      <div class="content-desc">
        擅长:{{item.speciality || '暂无'}}
      </div>
      <div class="content-service">
        <div 
          v-for="(item,key) of serviceObject" :key="key"
          class="service-item"
        >
          <image class="service-item-img" :src="item.flag ? item.imgSrc : item.imgDisabledSrc" mode="scaleToFill"/>
          <span class="service-item-title">{{item.title}}</span>
          <span v-if="item.flag" class="service-item-price">¥{{item.price}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { DoctorImageSrc } from 'services';
export default {
  name: 'DoctorCard',
  props:{
    item:{
      type:Object,
      default:{
        avatarFileId:'',
        doctorName:'',
        doctorLevelText:'',
        orgFullName:'',
        deptName:'',
        speciality:'',
        doctorOnlineItems:[]
      }
    },
  },
  data () {
    return {
      defaultServiceData: {
        '01':{
          imgSrc: require('images/common/ic_service_photo.png'),
          imgDisabledSrc: require('images/common/ic_service_photo_gray.png'),
          title: '图文',
          price: 0,
          flag: 0
        }, 
        '02':{
          imgSrc: require('images/common/ic_service_video.png'),
          imgDisabledSrc: require('images/common/ic_service_video_gray.png'),
          title: '视频',
          price: 0,
          flag: 0
        },
        '04': {
          imgSrc: require('images/common/ic_service_revisit.png'),
          imgDisabledSrc: require('images/common/ic_service_revisit_gray.png'),
          title: '复诊',
          price: 0,
          flag: 0
        }, 
      }
    }
  },
  computed:{
    doctorAvatar() {
      return DoctorImageSrc(this.item.avatarFileId);
    },
    serviceObject() {
      if (!this.item.doctorOnlineItems) {
        return this.defaultServiceData;
      }

      // 重置服务项
      Object.keys(this.defaultServiceData).forEach((key)=>{
        let item = this.defaultServiceData[key];
        item.price = 0;
        item.flag = 0;
      });
      // 刷新服务项
      var self = this;
      this.item.doctorOnlineItems.forEach((item)=>{
        if (item.itemCode && ['01','02','04'].indexOf(item.itemCode) != -1) {
          var service = self.defaultServiceData[item.itemCode];
          service.price = item.price;
          service.flag = 1;
        } else {
          service.price = 0;
          service.flag = 0;
        }
      });

      return  this.defaultServiceData;
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
.doctor-card {
  display: flex;
  margin: 20px 15px 30px;
  .avatar {
    width: 50px;
    min-width: 50px;
    height: 50px;
    border-radius: 25px;
  }
  .content {
    flex: 1;
    margin-left: 15px;
    overflow: hidden;
  }
  .content-name {
    font-size: 16px;
    color: #333;
  }
  .content-title {
    font-size: 14px;
    color: #999;
    margin-left: 10px;
  }

  .content-dept {
    display: inline-block;
    font-size: 16px;
    color: #999;
    margin-right: 10px;
    margin-top: 10px;
  }
  .content-desc {
    margin-top: 10px;
    font-size: 16px;
    color: #333;
    display: -webkit-box;
    overflow: hidden;
    text-overflow: ellipsis;
    word-wrap: break-word;
    white-space: normal !important;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
  .content-service {
    display: flex;
    margin-top: 10px;
    .service-item {
      width: 33.3%;
      display: flex;
      align-items: center;
      .service-item-img {
        width: 14px;
        height: 14px;
        margin-right: 5px;
      }
      .service-item-title {
        font-size: 12px;
        color: #333;
      }
      .service-item-price {
        font-size: 13px;
        margin-left: 2px;
        color: #FF6633;
      }
    }
  }
}

</style>
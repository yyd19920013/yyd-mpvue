import amapFile from 'js/AMapWX_SDK_V1.2.1/amap-wx';

//判断数据类型的方法（对typeof的增强，7种常用类型的判断，返回小写字符串）
function Type(obj){
    var arr=['null','nan','function','number','string','array','object'];
    if(obj===null){
        return 'null';
    }
    if(obj!==obj){
        return 'nan';
    }
    if(typeof Array.isArray==='function'){
        if(Array.isArray(obj)){ //浏览器支持则使用isArray()方法
            return 'array';
        }
    }else{                      //否则使用toString方法
        if(Object.prototype.toString.call(obj)==='[object Array]'){
            return 'array';
        }
    }
    return (typeof obj).toLowerCase();
};

//json克隆副本
function copyJson(json){
    return json?JSON.parse(JSON.stringify(json)):'';
};

//正常化日期
function normalDate(oDate){
    var oDate=oDate;
    var reg=/\-+/g;

    if(Type(oDate)=='string'){
        oDate=oDate.split('.')[0];//解决ie浏览器对yyyy-MM-dd HH:mm:ss.S格式的不兼容
        oDate=oDate.replace(reg,'/');//解决苹果浏览器对yyyy-MM-dd格式的不兼容性
    }

    oDate=new Date(oDate);
    return oDate;
};

//根据出生日期获取年龄
function getAge(date,real){
    var diff=(new Date()-normalDate(date))/(1000*60*60*24*365);
    var age=diff>0?(real?diff:Math.floor(diff)):0;

    return age;
};

//日期格式化函数
//oDate（时间戳或字符串日期都支持）
//fmt（格式匹配）
//月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
//年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
//例子：
//dateFormat0(new Date(),'yyyy-MM-dd hh:mm:ss.S')，2018-12-21 17:24:33.664
//dateFormat0(new Date(),'y-M-d h:m:s.S/q')，2018-12-21 17:24:33.666/4
function dateFormat0(oDate,fmt){
    var fmt=fmt||'yyyy/MM/dd hh:mm:ss';
    var oDate=normalDate(oDate||new Date());
    var date={
        'y+':oDate.getFullYear(),              //年
        'M+':oDate.getMonth()+1,               //月
        'd+':oDate.getDate(),                  //日
        'h+':oDate.getHours(),                 //时
        'm+':oDate.getMinutes(),               //分
        's+':oDate.getSeconds(),               //秒
        'S':oDate.getMilliseconds(),           //毫秒
        'q+':Math.ceil((oDate.getMonth()+1)/3),//季度，+3为了好取整
    };
    var result='';
    var value='';

    for(var attr in date){
        if(new RegExp('('+attr+')').test(fmt)){
            result=RegExp.$1;
            value=date[attr]+'';
            fmt=fmt.replace(result,result.length==1?value:(attr=='y+'?value.substring(4-result.length):toTwo(value)));
        }
    }

    return fmt;
};

//时间格式化(主要用于格式化历史时间到当前时间是多少秒到多少年前)
//oDate（时间戳或字符串日期都支持）
//fmt（格式匹配）
function dateFormat1(oDate,fmt){
    var oDate=normalDate(oDate);

    if(+oDate>=+new Date()){
        return '刚刚';
    }
    var lookTime=+new Date()-(+oDate);
    var seconds=Math.floor(lookTime/(1000));
    var minutes=Math.floor(lookTime/(1000*60));
    var hours=Math.floor(lookTime/(1000*60*60));
    var days=Math.floor(lookTime/(1000*60*60*24));
    var months=Math.floor(lookTime/(1000*60*60*24*30));
    var years=Math.floor(lookTime/(1000*60*60*24*30*12));

    if(seconds<60){
        lookTime=seconds+'秒前';
    }else if(minutes<60){
        lookTime=minutes+'分钟前';
    }else if(hours<24){
        lookTime=hours+'小时前';
    }else if(days<7){
        lookTime=days+'天前';
    }else if(days==7){
        lookTime='一周前';
    }else if(days>7){
        lookTime=dateFormat0(oDate,fmt);
    }
    return lookTime;
};

//生成32位唯一字符串(大小写字母数字组合)
function soleString32(){
    var str='abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var timestamp=+new Date()+Math.floor(Math.random()*10);
    var resultStr='';

    for(var i=0;i<19;i++){
        resultStr+=str.charAt(Math.floor(Math.random()*str.length));
    }
    resultStr+=timestamp;

    resultStr=resultStr.split('');
    resultStr.sort(function(a,b){
        return Math.random()-0.5;
    });
    resultStr=resultStr.join('');
    return resultStr;
};

//自定义事件的实现
var customEvent={
    json:{},
    on:function(evName,fn){
        if(Type(this.json[evName])!='object'){
            this.json[evName]={};
        }
        if(Type(fn)=='function'){
            fn.id=soleString32();
            this.json[evName][fn.id]=fn;
        }
        return this;
    },
    emit:function(evName,data){
        var evFnArr=this.json[evName];

        if(Type(evFnArr)=='object'){
            for(var attr in this.json[evName]){
                if(Type(this.json[evName][attr])=='function'){
                    this.json[evName][attr](data);
                }
            }
        }
        return this;
    },
    remove:function(evName,fn){
        var evFnArr=this.json[evName];

        if(Type(evName)=='string'&&Type(evFnArr)=='object'){
            if(Type(fn)=='function'){
                if(fn.id){
                    delete this.json[evName][fn.id];
                }else{
                    for(var attr in this.json[evName]){
                        if(this.json[evName][attr]+''===fn+''){
                            delete this.json[evName][attr];
                            break;
                        }
                    }
                }
            }else{
                delete this.json[evName];
            }
        }
        return this;
    }
};

//重置data数据
function resetData(data){
    var oData=copyJson(data);

    return{
        data:copyJson(oData),
        reset:function(parent){
            var oData=copyJson(data);

            for(var attr in oData){
                parent[attr]=oData[attr];
            }
        },
    };
};

//微信小程序-获取当前页面的信息
function getCurrentPage(){
  var pages=getCurrentPages();
  var length=pages.length-1;

  return pages[length];
};

//微信小程序-动画
/*
    <div :animation="animationData" class="test">
        测试页面
    </div>
    wxAnimation({
        parent:this,//父组件的this
        animationName:'animationData',//animation绑定data中的值的名字
        animationConfig:{//动画属性配置
            scale:[2,2],
            rotate:45,
        },
    });
*/
function wxAnimation(option){
    var option=option||{};
    var animation=wx.createAnimation({
        duration:option.duration||300,
        timingFunction:option.timingFunction||'ease',
    });

    for(var attr in option.animationConfig){
        animation[attr][Type(option.animationConfig[attr])=='array'?'apply':'call'](animation,option.animationConfig[attr]);
    }
    animation.step();

    option.parent[option.animationName]=animation.export();
};

//微信小程序-toast
function wxToast(title,duration){
    wx.showToast({
        title:title,
        mask:true,
        icon:'none',
        duration:duration||3000,
    });
};

//微信小程序-分享
function wxxcxShare(option){
  var option=option||{};

  return{
    title:option.title||'亿家健康预约挂号',
    desc:option.desc||'亿家健康预约挂号',
    imageUrl:option.imageUrl||require('images/wxShare.png'),
    path:option.path?(typeof option.path=='boolean'?getCurrentPage().route:option.path):'/pages/hospital/main',
    success:function(res){
      option.success&&option.success(res);
    },
    fail:function(res){
      option.fail&&option.fail(res);
    },
    complete:function(res){
      option.complete&&option.complete(res);
    },
  };
};

//微信小程序-网络请求
function wxRequest(option){
    var option=option||{};

    wx.showLoading({
        title:'请求中',
        mask:true,
    });

    wx.request({
        url:option.url,
        data:option.data||{},
        header:option.header||{},
        method:option.method&&option.method.toUpperCase()||'GET',
        dataType:option.dataType||'json',
        responseType:option.responseType||'text',
        success:function(res){
            var data=res.data;

            wx.hideLoading();
            if(res.statusCode=='200'){
                if(data.code=='0'){
                    option.success&&option.success(data);
                }else{
                    wxToast('请求代码错误');
                }
            }else{
                wxToast('网络异常');
            }
        },
        fail:function(res){
            option.fail&&option.fail(res);
        },
        complete:function(res){
            option.complete&&option.complete(res);
        },
    });
};

//微信小程序-用高德地图获取地理位置
/*
    wxGetLocation({
        success:function(res,detail){//成功回调
            console.log(res,detail);
        },
        fail:function(error){//失败回调
            console.log(error);
        },
    });
*/
function wxGetLocation(option){
    var option=option||{};
    var myAmapFun = new amapFile.AMapWX({
        key:'836a3b19c3d3461705af9d8ea20efcc5',//高德小程序应用专用key
    });

    myAmapFun.getRegeo({
        success:function(detail){
            var detail=detail[0]||{};
            var addressComponent=detail.regeocodeData&&detail.regeocodeData.addressComponent||{};
            var res={
                longitude:detail.longitude,
                latitude:detail.latitude,
                name:detail.name,
                desc:detail.desc,
                formatted_address:detail.regeocodeData&&detail.regeocodeData.formatted_address,
                country:addressComponent.country,
                province:addressComponent.province,
                city:addressComponent.city,
                district:addressComponent.district,
                township:addressComponent.township,
                adcode:addressComponent.adcode,
                citycode:addressComponent.citycode,
                towncode:addressComponent.towncode,
            };
            option.success&&option.success(res,detail);
        },
        fail:function(error){
            option.fail&&option.fail(error);
        },
    });
};

//项目中用到的工具函数
export {
        Type,
        copyJson,
        normalDate,
        getAge,
        dateFormat0,
        dateFormat1,
        customEvent,
        resetData,
        getCurrentPage,
        wxAnimation,
        wxToast,
        wxxcxShare,
        wxRequest,
        wxGetLocation,
    };

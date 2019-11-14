import amapFile from 'js/AMapWX_SDK_V1.2.1/amap-wx';

//判断数据类型的方法（对typeof的增强，7种常用类型的判断，返回小写字符串）
function Type(obj) {
    var arr = ['null', 'nan', 'function', 'number', 'string', 'array', 'object'];
    if (obj === null) {
        return 'null';
    }
    if (obj !== obj) {
        return 'nan';
    }
    if (typeof Array.isArray === 'function') {
        if (Array.isArray(obj)) { //浏览器支持则使用isArray()方法
            return 'array';
        }
    } else { //否则使用toString方法
        if (Object.prototype.toString.call(obj) === '[object Array]') {
            return 'array';
        }
    }
    return (typeof obj).toLowerCase();
};

//json克隆副本
function copyJson(json) {
    return json ? JSON.parse(JSON.stringify(json)) : json;
};

//时间变成两位数
function toTwo(n) {
    return +n < 10 ? '0' + n : n + '';
};

//补零函数
//value（需要补零的值）
//length（需要补零的长度(数量)）
//isBehind（是否在末尾补零）
function zeroFill(value, length, isBehind) {
    var value = value || '';
    var length = length > 0 ? length : 0;
    var zeroStr = '';

    for (var i = 0; i < length; i++) {
        zeroStr += '0';
    }

    return !isBehind ? zeroStr + value : value + zeroStr;
};

//算出本月天数
//getMonth获得的月份是从0开始，要加1
//下月第0天就是最后一天，-1=倒数第二天，国外月份从0开始,逗号隔开年月日new Date之后月份要大一个月，字符串是正常的
function manyDay(year, month) {
    var nextMonth = new Date(year, month, 0);

    return nextMonth.getDate();
};

//正常化日期
function normalDate(oDate) {
    var oDate = oDate;
    var reg = /\-+/g;

    if (Type(oDate) == 'string') {
        oDate = oDate.split('.')[0]; //解决ie浏览器对yyyy-MM-dd HH:mm:ss.S格式的不兼容
        oDate = oDate.replace(reg, '/'); //解决苹果浏览器对yyyy-MM-dd格式的不兼容性
    }

    oDate = new Date(oDate);
    return oDate;
};

//根据出生日期获取年龄
function getAge(date, real) {
    var bDate = normalDate(date);
    var bYear = bDate.getFullYear();
    var bMonth = bDate.getMonth();
    var bDay = bDate.getDate();
    var nDate = new Date();
    var nYear = nDate.getFullYear();
    var nMonth = nDate.getMonth();
    var nDay = nDate.getDate();
    var dYear = nYear - bYear;
    var dMonth = (nMonth - bMonth) / 12;
    var dDay = (nDay - bDay) / 365;
    var diff = dYear + dMonth + dDay;
    var age = diff > 0 ? (real ? diff : Math.floor(diff)) : 0;

    return age;
};

//根据身份证号码获取性别和生日
function getSexAndDob(identity) {
    var sexAndDob = {};

    if (regJson.identity.reg.test(identity)) {
        var sex = identity.substring(identity.length - 2, identity.length - 1);
        var dob = identity.substring(6, 14);

        sex = sex & 1 == 1 ? '1' : '2';
        dob = `${dob.substring(0,4)}-${dob.substring(4,6)}-${dob.substring(6)}`;

        sexAndDob = {
            sex: sex,
            dob: dob,
        };
    }

    return sexAndDob;
};

//身份证号码校验、获取身份证信息以及计算最后一位校验码、转换15位身份证为18位
/*
    校验码计算
    1、十七位数字本体码加权求和公式
    S = Sum(Ai * Wi), i = 0, ... , 16 ，先对前17位数字的权求和
    Ai：表示第i位置上的身份证号码数字值
    Wi：表示第i位置上的加权因子
    7 9 10 5 8 4 2 1 6 3 7 9 10 5 8 4 2

    2、计算模
    Y = mod(S, 11)

    3、通过模得到对应的校验码
    Y： 0 1 2 3 4 5 6 7 8 9 10
    校验码： 1 0 X 9 8 7 6 5 4 3 2
    也就是说，如果得到余数为1则最后的校验位p应该为对应的0。

    15位的号码：
    a a b b c c y y m m d d x x s
    18位的号码：
    a a b b c c y y y y m m d d x x s p
*/
var idCardNo = {
    citys: { 11: '北京', 12: '天津', 13: '河北', 14: '山西', 15: '内蒙古', 21: '辽宁', 22: '吉林', 23: '黑龙江', 31: '上海', 32: '江苏', 33: '浙江', 34: '安徽', 35: '福建', 36: '江西', 37: '山东', 41: '河南', 42: '湖北', 43: '湖南', 44: '广东', 45: '广西', 46: '海南', 50: '重庆', 51: '四川', 52: '贵州', 53: '云南', 54: '西藏', 61: '陕西', 62: '甘肃', 63: '青海', 64: '宁夏', 65: '新疆', 71: '台湾', 81: '香港', 82: '澳门', 91: '国外' }, //省,直辖市代码
    powers: ['7', '9', '10', '5', '8', '4', '2', '1', '6', '3', '7', '9', '10', '5', '8', '4', '2'], //每位加权因子
    lastCodes: ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'], //第18位校检码
    normalIdCardNo: function (idCardNo) { //格式化15身份证号码为18位
        var id17 = idCardNo.substring(0, 6) + '19' + idCardNo.substring(6);

        return idCardNo.length == 15 ? id17 + this.getLastCode(id17) : idCardNo;
    },
    getLastCode: function (idCardNo) { //根据身份证前17位计算出最后一位校检码
        var idCardNo = this.normalIdCardNo(idCardNo);
        var id17 = idCardNo.substring(0, 17);
        var sum = 0;
        var codeIndex = 0;

        for (var i = 0; i < 17; i++) {
            sum += id17.charAt(i) * this.powers[i];
        }

        codeIndex = sum % 11;

        return this.lastCodes[codeIndex];
    },
    getIdCardNoInfo: function (idCardNo) { //获取身份证信息
        var idCardNo = this.normalIdCardNo(idCardNo);
        var cityCode = idCardNo.substring(0, 2);
        var dobCode = idCardNo.substring(6, 14);
        var sexCode = idCardNo.substring(idCardNo.length - 2, idCardNo.length - 1);
        var bYear = dobCode.substring(0, 4);
        var bMonth = dobCode.substring(4, 6);
        var bDay = dobCode.substring(6);
        var bDate = new Date(bYear, bMonth - 1, bDay);
        var dob = dateFormat0(bDate, 'yyyy-MM-dd');
        var ageCode = getAge(dob) + '';
        var idCardNoInfo = {
            city: this.citys[cityCode],
            dob: dob,
            sex: sexCode & 1 == 1 ? '男' : '女',
            age: getAge(dob) + '岁',
            cityCode: cityCode,
            dobCode: dobCode,
            sexCode: sexCode,
            ageCode: ageCode,
        };

        return this.checkIdCardNo(idCardNo) ? idCardNoInfo : this.getIdCardNoCheckInfo(idCardNo);
    },
    checkAddressCode: function (idCardNo) { //检查地址码
        var idCardNo = this.normalIdCardNo(idCardNo);
        var addressCode = idCardNo.substring(0, 6);
        var reg = /[1-8]\d{5}/;

        return reg.test(addressCode) && this.citys[addressCode.substring(0, 2)] ? true : false;
    },
    checkDobCode: function (idCardNo) { //检查日期码
        var idCardNo = this.normalIdCardNo(idCardNo);
        var dobCode = idCardNo.substring(6, 14);
        var reg = /[1-9]\d{3}(0[1-9]|1[0-2])(0[1-9]|[1-2]\d|3[0-1])/;
        var oDate = new Date();
        var bYear = dobCode.substring(0, 4);
        var bMonth = dobCode.substring(4, 6);
        var bDay = dobCode.substring(6);
        var bDate = new Date(bYear, bMonth - 1, bDay);
        var cYear = bDate.getFullYear();
        var cMonth = bDate.getMonth() + 1;
        var cDay = bDate.getDate();

        return reg.test(dobCode) && bDate <= oDate && cYear == bYear && cMonth == bMonth && cDay == bDay ? true : false;
    },
    checkLastCode: function (idCardNo) { //检查身份证最后一位校验码
        var idCardNo = this.normalIdCardNo(idCardNo);
        var lastCode = idCardNo.charAt(idCardNo.length - 1);

        return lastCode == this.getLastCode(idCardNo) ? true : false;
    },
    getIdCardNoCheckInfo: function (idCardNo) { //获取身份证号码校验信息
        var regTestResult = /^[1-8]\d{5}[1-9]\d{3}(0[1-9]|1[0-2])(0[1-9]|[1-2]\d|3[0-1])\d{3}[\dxX]$/.test(idCardNo);
        var idCardNo = this.normalIdCardNo(idCardNo);
        var checkResult = [
            regTestResult,
            this.checkAddressCode(idCardNo),
            this.checkDobCode(idCardNo),
            this.checkLastCode(idCardNo),
        ];
        var posIndex = checkResult.indexOf(false);
        var result = ~posIndex ? posIndex : true;
        var msgJson = {
            '-1': '身份证号码校验通过',
            '0': '身份证号码格式校验不通过',
            '1': '地址码校验不通过',
            '2': '日期码校验不通过',
            '3': '最后一位校验码校验不通过',
        };

        return {
            pass: result === true,
            code: posIndex,
            msg: msgJson[posIndex],
        };
    },
    checkIdCardNo: function (idCardNo) { //检查身份证号码
        var result = this.getIdCardNoCheckInfo(idCardNo);

        return result.pass;
    },
};

//时间格式化函数（根据秒数来格式化）
//seconds（多少秒）
//fmt（格式匹配）
//adjustFmt（是否自动调整格式，会删除无效的格式）
//年(y)、月(M)、日(d)、小时(h)、分(m)、秒(s)，都可以用1到任意位占位符
/*
    例子：
    secondFormat0(86400*365+86400*30+86400+3600+60+1,'yy/MM/dd hh:mm:ss'); //01/01/01 01:01:01
    secondFormat0(86400+3600+60+1,'hh:mm:ss'); //25:01:01
*/
function secondFormat0(seconds, fmt, adjustFmt) {
    var fmt = fmt || 'yy/MM/dd hh:mm:ss';
    var aMinute = 60;
    var aHour = aMinute * 60;
    var aDay = aHour * 24;
    var aMonth = aDay * 30;
    var aYear = aDay * 365;

    var iYears = Math.floor(seconds / aYear);
    var dMonth = seconds - iYears * aYear > 0 ? seconds - iYears * aYear : 0;
    dMonth = ~fmt.indexOf('y') ? dMonth : seconds;
    var iMonths = Math.floor(dMonth / aMonth);
    var dDay = dMonth - iMonths * aMonth > 0 ? dMonth - iMonths * aMonth : 0;
    dDay = ~fmt.indexOf('M') ? dDay : seconds;
    var iDays = Math.floor(dDay / aDay);
    var dHour = dDay - iDays * aDay > 0 ? dDay - iDays * aDay : 0;
    dHour = ~fmt.indexOf('d') ? dHour : seconds;
    var iHours = Math.floor(dHour / aHour);
    var dMinutes = dHour - iHours * aHour > 0 ? dHour - iHours * aHour : 0;
    dMinutes = ~fmt.indexOf('h') ? dMinutes : seconds;
    var iMinutes = Math.floor(dMinutes / aMinute);
    var dSeconds = dMinutes - iMinutes * aMinute ? dMinutes - iMinutes * aMinute : 0;
    dSeconds = ~fmt.indexOf('m') ? dSeconds : seconds;
    var iSeconds = Math.floor(dSeconds);

    var time = {
        'y+': iYears,
        'M+': iMonths,
        'd+': iDays,
        'h+': iHours,
        'm+': iMinutes,
        's+': iSeconds,
    };
    var result = '';
    var value = '';

    for (var attr in time) {
        if (new RegExp('(' + attr + ')').test(fmt)) {
            result = RegExp.$1;
            value = time[attr] + '';
            value = result.length == 1 ? value : zeroFill(value, result.length - value.length);

            if (adjustFmt && (+value) === 0) {
                var reg = new RegExp(attr + '([^a-zA-Z]+)[a-zA-Z]+');
                var matchStr = fmt.match(reg);

                if (matchStr) {
                    fmt = fmt.replace(matchStr[1], '');
                    value = '';
                }
            }

            fmt = fmt.replace(result, value);
        }
    }

    return fmt;
};

//日期格式化函数
//oDate（时间戳或字符串日期都支持）
//fmt（格式匹配）
//月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
//年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
/*
    例子：
    dateFormat0(new Date(),'yyyy-MM-dd hh:mm:ss.S'); //2018-12-21 17:24:33.664
    dateFormat0(new Date(),'y-M-d h:m:s.S/q'); //2018-12-21 17:24:33.666/4
*/
function dateFormat0(oDate, fmt) {
    var fmt = fmt || 'yyyy/MM/dd hh:mm:ss';
    var oDate = normalDate(oDate || new Date());
    var date = {
        'y+': oDate.getFullYear(), //年
        'M+': oDate.getMonth() + 1, //月
        'd+': oDate.getDate(), //日
        'h+': oDate.getHours(), //时
        'm+': oDate.getMinutes(), //分
        's+': oDate.getSeconds(), //秒
        'S': oDate.getMilliseconds(), //毫秒
        'q+': Math.ceil((oDate.getMonth() + 1) / 3), //季度
    };
    var result = '';
    var value = '';

    for (var attr in date) {
        if (new RegExp('(' + attr + ')').test(fmt)) {
            result = RegExp.$1;
            value = date[attr] + '';
            fmt = fmt.replace(result, result.length == 1 ? value : (attr == 'y+' ? value.substring(4 - result.length) : toTwo(value)));
        }
    }

    return fmt;
};

//时间格式化(主要用于格式化历史时间到当前时间是多少秒到多少年前)
//oDate（时间戳或字符串日期都支持）
function dateFormat1(oDate) {
    var oDate = normalDate(oDate);

    if (+oDate >= +new Date()) {
        return '刚刚';
    }
    var lookTime = +new Date() - (+oDate);
    var seconds = Math.floor(lookTime / (1000));
    var minutes = Math.floor(lookTime / (1000 * 60));
    var hours = Math.floor(lookTime / (1000 * 60 * 60));
    var days = Math.floor(lookTime / (1000 * 60 * 60 * 24));
    var months = Math.floor(lookTime / (1000 * 60 * 60 * 24 * 30));
    var years = Math.floor(lookTime / (1000 * 60 * 60 * 24 * 30 * 12));

    if (seconds < 60) {
        lookTime = seconds + '秒前';
    } else if (minutes < 60) {
        lookTime = minutes + '分钟前';
    } else if (hours < 24) {
        lookTime = hours + '小时前';
    } else if (days < 30) {
        lookTime = days + '天前';
    } else if (months < 12) {
        lookTime = months + '个月前';
    } else {
        lookTime = years + '年前';
    }
    return lookTime;
};

//金额格式化
function amountFormat0(value, dLength, cLength) {
    var oldValue = value;
    var value = +value;
    var arr = [];
    var dLength = dLength || 2;
    var cLength = cLength || 3;
    var zero = '';

    for (var i = 0; i < dLength; i++) {
        zero += '0';
    }

    if (Type(value) == 'number') {
        value += '';
        value = value.split('.');
        value[0] = value[0].split('');
        value[1] = (value[1] || '') + zero;
        value[1] = value[1].substring(0, dLength);

        arr.unshift('.', value[1]);
        while (value[0].length > cLength) {
            arr.unshift(',', value[0].splice(value[0].length - cLength, cLength).join(''));
        }

        arr = value[0].join('') + arr.join('');
    } else {
        arr = oldValue;
    }

    if (arr && arr.length) arr = arr.replace('-,', '-');
    return arr;
};

//格式化手机号为344
function formatMobile(val) {
    var reg = /^[1][3-9][0-9][ ][0-9]{4}[ ][0-9]{4}$/;
    var reg1 = /(\d{3})(?=\d)/;
    var reg2 = /(\d{4})(?=\d)/g;

    if (!reg.test(val)) {
        val = val.replace(/\s/g, '');
        val = val.replace(reg1, '$1 ');
        val = val.replace(reg2, '$1 ');
    }

    return val;
};

//科学运算（解决js处理浮点不正确的问题）
//num1（要进行运算的第一个数字）
//operator（运算符号,+,-,*,/）
//num2（要进行运算的第二个数字）
function computed(num1, operator, num2) {
    var length1 = (num1 + '').split('.')[1];
    length1 = length1 ? length1.length : 0;
    var length2 = (num2 + '').split('.')[1];
    length2 = length2 ? length2.length : 0;

    var integer1 = Math.pow(10, length1);
    var integer2 = Math.pow(10, length2);
    var iMax = Math.max(integer1, integer2);
    var result = '';

    switch (operator) {
        case '+':
            num1 = num1 * iMax;
            num2 = num2 * iMax;
            result = (num1 + num2) / iMax;
            break;
        case '-':
            num1 = num1 * iMax;
            num2 = num2 * iMax;
            result = (num1 - num2) / iMax;
            break;
        case '*':
            num1 = num1 * integer1;
            num2 = num2 * integer2;
            result = (num1 * num2) / integer1;
            result = result / integer2;
            break;
        case '/':
            num1 = num1 * integer1;
            num2 = num2 * integer2;
            result = (num1 / num2) / integer1;
            result = result / integer2;
            break;
    }
    return result;
};

//生成32位唯一字符串(大小写字母数字组合)
function soleString32() {
    var str = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var timestamp = +new Date() + Math.floor(Math.random() * 10);
    var resultStr = '';

    for (var i = 0; i < 19; i++) {
        resultStr += str.charAt(Math.floor(Math.random() * str.length));
    }
    resultStr += timestamp;

    resultStr = resultStr.split('');
    resultStr.sort(function (a, b) {
        return Math.random() - 0.5;
    });
    resultStr = resultStr.join('');
    return resultStr;
};

//自定义事件的实现
var customEvent = {
    json: {},
    on: function (evName, fn) {
        if (Type(this.json[evName]) != 'object') {
            this.json[evName] = {};
        }
        if (Type(fn) == 'function') {
            fn.id = soleString32();
            this.json[evName][fn.id] = fn;
        }
        return this;
    },
    emit: function (evName, data) {
        var evFnArr = this.json[evName];

        if (Type(evFnArr) == 'object') {
            for (var attr in this.json[evName]) {
                if (Type(this.json[evName][attr]) == 'function') {
                    this.json[evName][attr](data);
                }
            }
        }
        return this;
    },
    remove: function (evName, fn) {
        var evFnArr = this.json[evName];

        if (Type(evName) == 'string' && Type(evFnArr) == 'object') {
            if (Type(fn) == 'function') {
                if (fn.id) {
                    delete this.json[evName][fn.id];
                } else {
                    for (var attr in this.json[evName]) {
                        if (this.json[evName][attr] + '' === fn + '') {
                            delete this.json[evName][attr];
                            break;
                        }
                    }
                }
            } else {
                delete this.json[evName];
            }
        }
        return this;
    }
};

//重置data数据
function resetData(data) {
    var oData = copyJson(data);

    return {
        data: copyJson(oData),
        reset: function (parent) {
            var oData = copyJson(data);

            for (var attr in oData) {
                parent[attr] = oData[attr];
            }
        },
    };
};

//微信小程序-获取当前页面的信息
function getCurrentPage() {
    var pages = getCurrentPages();
    var length = pages.length - 1;

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
function wxAnimation(option) {
    var option = option || {};
    var animation = wx.createAnimation({
        duration: option.duration || 300,
        timingFunction: option.timingFunction || 'ease',
    });

    for (var attr in option.animationConfig) {
        animation[attr][Type(option.animationConfig[attr]) == 'array' ? 'apply' : 'call'](animation, option.animationConfig[attr]);
    }
    animation.step();

    option.parent[option.animationName] = animation.export();
};

//微信小程序-toast
function wxToast(title, duration) {
    wx.showToast({
        title: title,
        mask: true,
        icon: 'none',
        duration: duration || 3000,
    });
};

//微信小程序-分享
function wxxcxShare(option) {
    var option = option || {};

    return {
        title: option.title || '亿家健康预约挂号',
        desc: option.desc || '亿家健康预约挂号',
        imageUrl: option.imageUrl || require('images/wxShare.png'),
        path: option.path ? (typeof option.path == 'boolean' ? getCurrentPage().route : option.path) : '/pages/hospital/main',
        success: function (res) {
            option.success && option.success(res);
        },
        fail: function (res) {
            option.fail && option.fail(res);
        },
        complete: function (res) {
            option.complete && option.complete(res);
        },
    };
};

//微信小程序-网络请求
function wxRequest(option) {
    var option = option || {};

    wx.showLoading({
        title: '请求中',
        mask: true,
    });

    wx.request({
        url: option.url,
        data: option.data || {},
        header: option.header || {},
        method: option.method && option.method.toUpperCase() || 'GET',
        dataType: option.dataType || 'json',
        responseType: option.responseType || 'text',
        success: function (res) {
            var data = res.data;

            wx.hideLoading();
            if (res.statusCode == '200') {
                if (data.code == '0') {
                    option.success && option.success(data);
                } else {
                    wxToast('请求代码错误');
                }
            } else {
                wxToast('网络异常');
            }
        },
        fail: function (res) {
            option.fail && option.fail(res);
        },
        complete: function (res) {
            option.complete && option.complete(res);
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
function wxGetLocation(option) {
    var option = option || {};
    var myAmapFun = new amapFile.AMapWX({
        key: '836a3b19c3d3461705af9d8ea20efcc5', //高德小程序应用专用key
    });

    myAmapFun.getRegeo({
        success: function (detail) {
            var detail = detail[0] || {};
            var addressComponent = detail.regeocodeData && detail.regeocodeData.addressComponent || {};
            var res = {
                longitude: detail.longitude,
                latitude: detail.latitude,
                name: detail.name,
                desc: detail.desc,
                formatted_address: detail.regeocodeData && detail.regeocodeData.formatted_address,
                country: addressComponent.country,
                province: addressComponent.province,
                city: addressComponent.city,
                district: addressComponent.district,
                township: addressComponent.township,
                adcode: addressComponent.adcode,
                citycode: addressComponent.citycode,
                towncode: addressComponent.towncode,
            };
            option.success && option.success(res, detail);
        },
        fail: function (error) {
            option.fail && option.fail(error);
        },
    });
};

//项目中用到的工具函数
export {
    Type,
    copyJson,
    normalDate,
    getAge,
    getSexAndDob,
    idCardNo,
    secondFormat0,
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

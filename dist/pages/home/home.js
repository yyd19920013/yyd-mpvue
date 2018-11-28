require("../../common/manifest.js");
require("../../common/vendor.js");
global.webpackJsonp([1],{

/***/ 100:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 101:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_js_yydjs__ = __webpack_require__(5);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//



var resetDataFn = Object(__WEBPACK_IMPORTED_MODULE_0_js_yydjs__["c" /* resetData */])({});

/* harmony default export */ __webpack_exports__["a"] = ({
    data: function data() {
        return resetDataFn.data;
    },


    computed: {
        cWidth: function cWidth() {
            return this.width ? this.width + 'rpx;' : '';
        }
    },

    /*
        例子：
        <swiperWrap
            :dataList="[
                {
                    src:'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
                    link:'../user/user',
                },
                {
                    src:'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
                    link:'../user/user',
                },
                {
                    src:'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
                    link:'../user/user',
                },
            ]"
        />
    */

    props: {
        dataList: { //必填
            type: Array,
            required: true,
            default: function _default() {
                return [];
            }
        },
        click: function click() {}, //点击图片触发的函数
        showDot: { //是否显示圆点
            type: Boolean,
            default: true
        },
        dotColor: { //圆点的颜色
            type: String,
            default: 'rgba(255,255,255,0.3)'
        },
        dotActiveColor: { //圆点选中时候的颜色
            type: String,
            default: 'rgba(255,255,255,1)'
        },
        auto: { //是否自动播放
            type: Boolean,
            default: true
        },
        interval: { //自动播放间隔时间
            type: Number,
            default: 3000
        },
        duration: { //滚动持续时间
            type: Number,
            default: 500
        },
        width: { //轮播图宽度
            type: Number,
            default: 0
        },
        height: { //轮播图高度
            type: Number,
            default: 150
        }
    },

    onHide: function onHide() {
        //重置data
        resetDataFn.reset(this);
    },
    onLoad: function onLoad() {},


    methods: {
        clickImg: function clickImg(item, index) {
            if (item.link) {
                wx.navigateTo({
                    url: item.link
                });
            }

            this.click && this.click(item, index);
        }
    }
});

/***/ }),

/***/ 102:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "swiperWrap"
  }, [_c('swiper', {
    staticClass: "swiper",
    style: ({
      width: _vm.cWidth,
      height: _vm.height + 'rpx',
    }),
    attrs: {
      "indicator-dots": _vm.showDot,
      "indicator-color": _vm.dotColor,
      "indicator-active-color": _vm.dotActiveColor,
      "autoplay": _vm.auto,
      "interval": _vm.interval,
      "duration": _vm.duration
    }
  }, _vm._l((_vm.dataList), function(item, index) {
    return _c('block', {
      key: index
    }, [_c('swiper-item', {
      attrs: {
        "mpcomid": '0-' + index
      }
    }, [_c('img', {
      staticClass: "img",
      style: ({
        width: _vm.cWidth,
        height: _vm.height + 'rpx',
        backgroundImage: 'url(' + item.src + ')',
      }),
      attrs: {
        "eventid": '0-' + index
      },
      on: {
        "click": function($event) {
          _vm.clickImg(item, index)
        }
      }
    })])], 1)
  }))], 1)
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-0007855d", esExports)
  }
}

/***/ }),

/***/ 103:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_mpvue_loader_1_1_4_mpvue_loader_lib_selector_type_script_index_0_pickerWrap_vue__ = __webpack_require__(105);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_mpvue_loader_1_1_4_mpvue_loader_lib_template_compiler_index_id_data_v_38a26f73_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_mpvue_loader_1_1_4_mpvue_loader_lib_selector_type_template_index_0_pickerWrap_vue__ = __webpack_require__(106);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(104)
}
var normalizeComponent = __webpack_require__(9)
/* script */

/* template */

/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-38a26f73"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_mpvue_loader_1_1_4_mpvue_loader_lib_selector_type_script_index_0_pickerWrap_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_mpvue_loader_1_1_4_mpvue_loader_lib_template_compiler_index_id_data_v_38a26f73_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_mpvue_loader_1_1_4_mpvue_loader_lib_selector_type_template_index_0_pickerWrap_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src\\components\\pickerWrap.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] pickerWrap.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-38a26f73", Component.options)
  } else {
    hotAPI.reload("data-v-38a26f73", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 104:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 105:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_js_yydjs__ = __webpack_require__(5);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//



var resetDataFn = Object(__WEBPACK_IMPORTED_MODULE_0_js_yydjs__["c" /* resetData */])({
    firstLoaded: false,
    gangedValue: [],
    cacheValue: [],
    cacheRange: [],
    cacheMultiSelectorValue: []
});

/* harmony default export */ __webpack_exports__["a"] = ({
    data: function data() {
        return resetDataFn.data;
    },


    computed: {
        selectorRangeKey: function selectorRangeKey() {
            if (this.mode != 'selector') return;
            var range = this.range,
                rangeKey = this.rangeKey;

            var type = range[0] ? Object(__WEBPACK_IMPORTED_MODULE_0_js_yydjs__["a" /* Type */])(range[0]) : 'string';
            var selectorRangeKey = '';

            if (type == 'object') {
                selectorRangeKey = rangeKey || 'name';
            }
            return selectorRangeKey;
        },
        selectorValue: function selectorValue() {
            if (this.mode != 'selector') return;
            var range = this.range,
                value = this.value,
                rangeKey = this.rangeKey;

            var type = range[0] ? Object(__WEBPACK_IMPORTED_MODULE_0_js_yydjs__["a" /* Type */])(range[0]) : 'string';
            var selectorValue = '';

            if (!value && value != 0) {
                value = 0;
            }

            if (type == 'string') {
                selectorValue = range[value];
            } else if (type == 'object') {
                selectorValue = range[value][rangeKey];
            }
            return selectorValue;
        },
        multiSelectorRangeKey: function multiSelectorRangeKey() {
            if (this.mode != 'multiSelector') return;
            var range = this.range,
                rangeKey = this.rangeKey;

            var type = range[0] && range[0][0] ? Object(__WEBPACK_IMPORTED_MODULE_0_js_yydjs__["a" /* Type */])(range[0][0]) : 'string';
            var multiSelectorRangeKey = '';

            if (type == 'object') {
                multiSelectorRangeKey = rangeKey || 'name';
            }
            return multiSelectorRangeKey;
        },
        multiSelectorValue: function multiSelectorValue() {
            var _this = this;

            if (this.mode != 'multiSelector') return;
            var range = Object(__WEBPACK_IMPORTED_MODULE_0_js_yydjs__["b" /* copyJson */])(this.range);
            var value = Object(__WEBPACK_IMPORTED_MODULE_0_js_yydjs__["b" /* copyJson */])(this.value);
            var rangeKey = this.rangeKey;

            var type = range[0] && range[0][0] ? Object(__WEBPACK_IMPORTED_MODULE_0_js_yydjs__["a" /* Type */])(range[0][0]) : 'string';
            var multiSelectorValue = '';

            if (!value.length) {
                value = range.map(function (item, index) {
                    return 0;
                });
            }

            if (type == 'string') {
                value = value.map(function (item, index) {
                    return range[index] ? range[index][item] : '';
                });
            } else if (type == 'object') {
                value = value.map(function (item, index) {
                    return range[index] && range[index][item] && range[index][item][_this.multiSelectorRangeKey] ? range[index][item][_this.multiSelectorRangeKey] : '';
                });
            }

            multiSelectorValue = value.join('，');
            return multiSelectorValue;
        },
        timeValue: function timeValue() {
            if (this.mode != 'time') return;
            var timeValue = '';

            timeValue = this.value.split(':').join(this.join || ':');
            return timeValue;
        },
        dateValue: function dateValue() {
            if (this.mode != 'date') return;
            var dateValue = '';

            dateValue = this.value.split('-').join(this.join || '-');
            return dateValue;
        },
        regionValue: function regionValue() {
            if (this.mode != 'region') return;
            var regionValue = '';

            regionValue = this.value.join(this.join || '-');
            return regionValue;
        }
    },

    /*
        例子：
        <pickerWrap
            :mode="'selector'"
            :range="['美国','中国','巴西','日本']"
            :value="index1"
            :change="changeFn1"
        />
         <pickerWrap
            :mode="'selector'"
            :range="[{id:0,name:'美国'},{id:1,name:'中国'},{id:2,name:'巴西'},{id:3,name:'日本'}]"
            :value="index11"
            :change="changeFn11"
        />
         <pickerWrap
            :mode="'multiSelector'"
            :range="[['无脊柱动物','脊柱动物'],['扁性动物','线形动物','环节动物','软体动物','节肢动物'],['猪肉绦虫','吸血虫']]"
            :value="arrIndex2"
            :change="changeFn2"
        />
         <pickerWrap
            :mode="'multiSelector'"
            :range="gangedArr"
            :value="gangedArrIndex"
            :ganged="true"
            :change="gChangeFn"
            :cancel="gCancelFn"
            :columnchange="gColumnchangeFn"
        />
         <pickerWrap
            :mode="'time'"
            :value="time"
            :change="tChangeFn"
        />
         <pickerWrap
            :mode="'date'"
            :value="date"
            :change="dChangeFn"
        />
         <pickerWrap
            :mode="'region'"
            :value="region"
            :change="rChangeFn"
        />
         data:{
            dataList:[],
            index1:0,
            index11:0,
            arrIndex2:[],
            arrIndex22:[],
            gangedArr:[],
            gangedArrIndex:[],
            time:'',
            date:'',
            region:[],
        }
         methods:{
            clickFn(){
                wx.navigateTo({
                    url:'../test/test',
                });
            },
            changeFn1(changeValue){
                let res=changeValue(this,'index1');
                 console.log(res);
            },
            changeFn11(changeValue){
                let res=changeValue(this,'index11');
                 console.log(res);
            },
            changeFn2(changeValue){
                let res=changeValue(this,'arrIndex2');
                 console.log(res);
            },
            changeFn22(changeValue){
                let res=changeValue(this,'arrIndex22');
                 console.log(res);
            },
            mockGangedArr(id,endFn){
                let arr=[];
                 switch(id){
                    case '1':
                            arr=[{id:'1-1',name:'扁性动物'},{id:'1-2',name:'线性动物'}];
                        break;
                    case '1-1':
                            arr=[{id:'1-1-1',name:'猪肉绦虫'},{id:'1-1-2',name:'吸血虫'},{id:'1-1-3',name:'尸蟞'}];
                        break;
                    case '1-2':
                            arr=[{id:'1-2-1',name:'蛔虫'},{id:'1-2-2',name:'线虫'}];
                        break;
                    case '2':
                            arr=[{id:'2-1',name:'鱼'},{id:'2-2',name:'两栖动物'}];
                        break;
                    case '2-1':
                            arr=[{id:'2-1-1',name:'鲫鱼'},{id:'2-1-2',name:'带鱼'}];
                        break;
                    case '2-2':
                            arr=[{id:'2-2-1',name:'青蛙'},{id:'2-2-2',name:'娃娃鱼'}];
                        break;
                    default:
                            arr=[{id:'1',name:'无脊柱动物'},{id:'2',name:'脊柱动物'}];
                }
                 setTimeout(()=>{
                    endFn&&endFn(arr);
                },100);
            },
            gChangeFn(changeValue){
                let res=changeValue(this,'gangedArrIndex','gangedArr');
                 console.log(res);
            },
            gCancelFn(cancelValue){
                cancelValue(this,'gangedArrIndex','gangedArr');
            },
            gColumnchangeFn(changeArray){
                changeArray(this,'gangedArrIndex','gangedArr',3,this.mockGangedArr);
            },
            tChangeFn(changeArray){
                let res=changeArray(this,'time');
                 console.log(res);
            },
            dChangeFn(changeArray){
                let res=changeArray(this,'date');
                 console.log(res);
            },
            rChangeFn(changeArray){
                let res=changeArray(this,'region');
                 console.log(res);
            },
        }
    */

    props: {
        mode: { //分别是普通选择器('selector')，多列选择器('multiSelector')，时间选择器('time')，日期选择器('date')，省市区选择器('region')
            type: String,
            default: 'selector'
        },
        title: { //title名
            type: String,
            default: ''
        },
        range: {
            //普通选择器('selector')，mode为 selector 或 multiSelector 时，range 有效
            //多列选择器('multiSelector')，mode为 selector 或 multiSelector 时，range 有效。二维数组，长度表示多少列，数组的每项表示每列的数据，如[["a","b"], ["c","d"]]
            type: [Array, Object],
            default: []
        },
        rangeKey: {
            //普通选择器('selector')，当 range 是一个 Object Array 时，通过 range-key 来指定 Object 中 key 的值作为选择器显示内容
            //多列选择器('multiSelector')，当 range 是一个 二维Object Array 时，通过 range-key 来指定 Object 中 key 的值作为选择器显示内容
            type: String,
            default: 'name'
        },
        value: {
            //普通选择器('selector')，value 的值表示选择了 range 中的第几个（下标从 0 开始），Number
            //多列选择器('multiSelector')，value 每一项的值表示选择了 range 对应项中的第几个（下标从 0 开始），Array
            //时间选择器('time')，表示选中的时间，格式为"hh:mm"，String
            //日期选择器('date')，表示选中的日期，格式为"YYYY-MM-DD"，String
            //省市区选择器('region')，表示选中的省市区，默认选中每一列的第一个值，Array
            type: [Number, String, Array],
            default: null
        },
        start: {
            //时间选择器('time')，表示有效时间范围的开始，字符串格式为"hh:mm"
            //日期选择器('date')，表示有效日期范围的开始，字符串格式为"YYYY-MM-DD"
            type: String,
            default: ''
        },
        end: {
            //时间选择器('time')，表示有效时间范围的结束，字符串格式为"hh:mm"
            //日期选择器('date')，表示有效日期范围的结束，字符串格式为"YYYY-MM-DD"
            type: String,
            default: ''
        },
        fields: {
            //日期选择器('date')，有效值 year,month,day，表示选择器的粒度
            type: String,
            default: 'day'
        },
        join: {
            //省市区选择器('region')，连接符号
            type: String,
            default: ''
        },
        customItem: {
            //省市区选择器('region')，可为每一列的顶部添加一个自定义的项
            type: String,
            default: ''
        },
        ganged: {
            //多列选择器('multiSelector')，是否是联动
            type: Boolean,
            default: false
        },
        hideSlot: { //隐藏该组件的slot，需要设置高度，自己根据change事件的返回值设置显示的字段
            type: Boolean,
            default: false
        },
        disabled: { //是否禁用
            type: Boolean,
            default: false
        },
        change: { //value 改变时触发 change 事件，会返回一个函数changeFn，需要传入参数
            /*
                parent,//父组件的this
                valueName,//该组件绑定父组件的value名
                rangeName,//该组件绑定父组件的range名
            */
            type: Function,
            default: function _default() {}
        },
        cancel: { //取消选择时触发
            /*
                parent,//父组件的this
                valueName,//该组件绑定父组件的value名
                rangeName,//该组件绑定父组件的range名
            */
            type: Function,
            default: function _default() {}
        },
        columnchange: {
            //多列选择器('multiSelector')，某一列的值改变时触发 columnchange 事件
            /*
                parent,//父组件的this
                valueName,//该组件绑定父组件的value名
                rangeName,//该组件绑定父组件的range名
                rangeLength,//联动数组的长度
                apiFn,//根据业务进行改造，请求接口的封装，第一个参数为接收的id，第二个为获取数据成功的回调函数
            */
            type: Function,
            default: function _default() {}
        }
    },

    onHide: function onHide() {
        //重置data
        resetDataFn.reset(this);
    },
    onLoad: function onLoad() {
        //多列选择器联动设置默认数据
        this.setDefaultData();
    },
    updated: function updated() {
        //多列选择器联动设置默认数据
        this.setDefaultData();
    },


    methods: {
        setDefaultData: function setDefaultData() {
            if (this.ganged && !this.firstLoaded && this.range && this.range.length) {
                this.firstLoaded = true;
                this.gangedValue = Object(__WEBPACK_IMPORTED_MODULE_0_js_yydjs__["b" /* copyJson */])(this.value);
                this.cacheValue = Object(__WEBPACK_IMPORTED_MODULE_0_js_yydjs__["b" /* copyJson */])(this.value);
                this.cacheRange = Object(__WEBPACK_IMPORTED_MODULE_0_js_yydjs__["b" /* copyJson */])(this.range);
                this.cacheMultiSelectorValue = Object(__WEBPACK_IMPORTED_MODULE_0_js_yydjs__["b" /* copyJson */])(this.multiSelectorValue);
            }
        },
        changeFn: function changeFn(ev) {
            var _this2 = this;

            var value = ev.mp.detail.value;


            var changeValue = function changeValue(parent, valueName, rangeName) {
                if (parent && valueName) {
                    if (!_this2.ganged) {
                        parent[valueName] = value;
                    } else {
                        _this2.cacheValue = Object(__WEBPACK_IMPORTED_MODULE_0_js_yydjs__["b" /* copyJson */])(_this2.gangedValue);
                        _this2.cacheRange = Object(__WEBPACK_IMPORTED_MODULE_0_js_yydjs__["b" /* copyJson */])(_this2.range);
                        _this2.cacheMultiSelectorValue = Object(__WEBPACK_IMPORTED_MODULE_0_js_yydjs__["b" /* copyJson */])(_this2.multiSelectorValue);
                    }
                }

                var resData = {};

                resData.value = Object(__WEBPACK_IMPORTED_MODULE_0_js_yydjs__["a" /* Type */])(value) == 'string' && Object(__WEBPACK_IMPORTED_MODULE_0_js_yydjs__["a" /* Type */])(+value) != 'nan' ? +value : Object(__WEBPACK_IMPORTED_MODULE_0_js_yydjs__["b" /* copyJson */])(value);
                resData.range = Object(__WEBPACK_IMPORTED_MODULE_0_js_yydjs__["b" /* copyJson */])(_this2.range);
                resData.detail = ev.mp.detail;
                resData.ev = ev;

                switch (_this2.mode) {
                    case 'selector':
                        resData.strValue = _this2.selectorValue;
                        break;
                    case 'multiSelector':
                        if (_this2.ganged) {
                            resData.strValue = _this2.cacheMultiSelectorValue;
                            resData.range = Object(__WEBPACK_IMPORTED_MODULE_0_js_yydjs__["b" /* copyJson */])(_this2.cacheRange);
                        } else {
                            resData.strValue = _this2.multiSelectorValue;
                        }
                        break;
                    case 'time':
                        resData.strValue = _this2.timeValue;
                        break;
                    case 'date':
                        resData.strValue = _this2.dateValue;
                        break;
                    case 'region':
                        resData.strValue = _this2.regionValue;
                        break;
                }
                return resData;
            };
            this.change && this.change(changeValue);
        },
        cancelFn: function cancelFn() {
            var _this3 = this;

            var cancelValue = function cancelValue(parent, valueName, rangeName) {
                if (parent && valueName) {
                    if (_this3.ganged) {
                        _this3.gangedValue = Object(__WEBPACK_IMPORTED_MODULE_0_js_yydjs__["b" /* copyJson */])(_this3.cacheValue);
                        parent[valueName] = Object(__WEBPACK_IMPORTED_MODULE_0_js_yydjs__["b" /* copyJson */])(_this3.cacheValue);
                        parent[rangeName] = Object(__WEBPACK_IMPORTED_MODULE_0_js_yydjs__["b" /* copyJson */])(_this3.cacheRange);
                    }
                }
            };
            this.cancel && this.cancel(cancelValue);
        },
        columnchangeFn: function columnchangeFn(ev) {
            var _this4 = this;

            var _ev$mp$detail = ev.mp.detail,
                column = _ev$mp$detail.column,
                value = _ev$mp$detail.value;


            var changeArray = function changeArray(parent, valueName, rangeName) {
                var rangeLength = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
                var apiFn = arguments[4];

                if (parent && rangeName && parent[rangeName] && apiFn && Object(__WEBPACK_IMPORTED_MODULE_0_js_yydjs__["a" /* Type */])(apiFn) == 'function') {
                    var parentRange = Object(__WEBPACK_IMPORTED_MODULE_0_js_yydjs__["b" /* copyJson */])(parent[rangeName]);
                    var parentValue = Object(__WEBPACK_IMPORTED_MODULE_0_js_yydjs__["b" /* copyJson */])(parent[valueName]);
                    var id = parentRange[column][value].id;

                    var setParent = function setParent(value) {
                        parentRange.length = rangeLength;
                        parentValue.length = rangeLength;

                        for (var i = 0; i < parentValue.length; i++) {
                            var item = parentValue[i];

                            if (!item && item != 0) {
                                parentValue[i] = 0;
                            }
                        }

                        _this4.gangedValue = Object(__WEBPACK_IMPORTED_MODULE_0_js_yydjs__["b" /* copyJson */])(parentValue);

                        for (var _i = 0; _i < parentValue.length; _i++) {
                            var _item = parentValue[_i];

                            if (!parentRange[_i][_item]) {
                                parentValue[_i] = 0;
                            }
                        }

                        setTimeout(function () {
                            parent[valueName] = Object(__WEBPACK_IMPORTED_MODULE_0_js_yydjs__["b" /* copyJson */])(parentValue);
                            parent[rangeName] = Object(__WEBPACK_IMPORTED_MODULE_0_js_yydjs__["b" /* copyJson */])(parentRange);
                        }, 100);
                    };

                    if (parent[rangeName][column + 1]) {
                        var reqFn = function reqFn(id, column, value) {
                            apiFn(id, function (res) {
                                parentValue[column] = value;
                                parentRange[column + 1] = res;

                                if (column + 1 < rangeLength - 1 && Object(__WEBPACK_IMPORTED_MODULE_0_js_yydjs__["a" /* Type */])(rangeLength) == 'number') {
                                    var valueIndex = parentValue[column + 1] || 0;
                                    var _id = parentRange[column + 1][valueIndex].id;

                                    if (_id) {
                                        reqFn(_id, column + 1, valueIndex);
                                    }
                                } else {
                                    setParent(value);
                                }
                            });
                        };

                        reqFn(id, column, value);
                    } else {
                        parentValue[column] = value || 0;
                        setParent(value);
                    }
                }
            };
            this.columnchange && this.columnchange(changeArray);
        }
    }
});

/***/ }),

/***/ 106:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "pickerWrap"
  }, [(_vm.mode == 'selector') ? _c('picker', {
    attrs: {
      "mode": "selector",
      "value": _vm.value,
      "rangeKey": _vm.selectorRangeKey,
      "range": _vm.range,
      "disabled": _vm.disabled,
      "eventid": '0'
    },
    on: {
      "change": _vm.changeFn,
      "cancel": _vm.cancelFn
    }
  }, [(!_vm.hideSlot) ? _c('div', {
    staticClass: "picker"
  }, [_c('span', {
    staticClass: "title"
  }, [_vm._v(_vm._s(_vm.title || '普通选择器：'))]), _vm._v(" "), _c('span', {
    staticClass: "value"
  }, [_vm._v(_vm._s(_vm.selectorValue))])]) : _c('div', {
    staticClass: "picker selector"
  })]) : _vm._e(), _vm._v(" "), (_vm.mode == 'multiSelector') ? _c('picker', {
    attrs: {
      "mode": "multiSelector",
      "value": !_vm.ganged ? _vm.value : _vm.gangedValue,
      "rangeKey": _vm.multiSelectorRangeKey,
      "range": _vm.range,
      "disabled": _vm.disabled,
      "eventid": '1'
    },
    on: {
      "change": _vm.changeFn,
      "columnchange": _vm.columnchangeFn,
      "cancel": _vm.cancelFn
    }
  }, [(!_vm.hideSlot) ? _c('div', {
    staticClass: "picker"
  }, [_c('span', {
    staticClass: "title"
  }, [_vm._v(_vm._s(_vm.title || '多列选择器：'))]), _vm._v(" "), _c('span', {
    staticClass: "value"
  }, [_vm._v(_vm._s(!_vm.ganged ? _vm.multiSelectorValue : _vm.cacheMultiSelectorValue))])]) : _c('div', {
    staticClass: "picker multiSelector"
  })]) : _vm._e(), _vm._v(" "), (_vm.mode == 'time') ? _c('picker', {
    attrs: {
      "mode": "time",
      "value": _vm.value,
      "start": _vm.start,
      "end": _vm.end,
      "disabled": _vm.disabled,
      "eventid": '2'
    },
    on: {
      "change": _vm.changeFn,
      "cancel": _vm.cancelFn
    }
  }, [(!_vm.hideSlot) ? _c('div', {
    staticClass: "picker"
  }, [_c('span', {
    staticClass: "title"
  }, [_vm._v(_vm._s(_vm.title || '时间选择器：'))]), _vm._v(" "), _c('span', {
    staticClass: "value"
  }, [_vm._v(_vm._s(_vm.timeValue))])]) : _c('div', {
    staticClass: "picker time"
  })]) : _vm._e(), _vm._v(" "), (_vm.mode == 'date') ? _c('picker', {
    attrs: {
      "mode": "date",
      "value": _vm.value,
      "start": _vm.start,
      "end": _vm.end,
      "flieds": _vm.flieds,
      "disabled": _vm.disabled,
      "eventid": '3'
    },
    on: {
      "change": _vm.changeFn,
      "cancel": _vm.cancelFn
    }
  }, [(!_vm.hideSlot) ? _c('div', {
    staticClass: "picker"
  }, [_c('span', {
    staticClass: "title"
  }, [_vm._v(_vm._s(_vm.title || '日期选择器：'))]), _vm._v(" "), _c('span', {
    staticClass: "value"
  }, [_vm._v(_vm._s(_vm.dateValue))])]) : _c('div', {
    staticClass: "picker date"
  })]) : _vm._e(), _vm._v(" "), (_vm.mode == 'region') ? _c('picker', {
    attrs: {
      "mode": "region",
      "value": _vm.value,
      "join": _vm.join,
      "customItem": _vm.customItem,
      "disabled": _vm.disabled,
      "eventid": '4'
    },
    on: {
      "change": _vm.changeFn,
      "cancel": _vm.cancelFn
    }
  }, [(!_vm.hideSlot) ? _c('div', {
    staticClass: "picker"
  }, [_c('span', {
    staticClass: "title"
  }, [_vm._v(_vm._s(_vm.title || '省市区选择器：'))]), _vm._v(" "), _c('span', {
    staticClass: "value"
  }, [_vm._v(_vm._s(_vm.regionValue))])]) : _c('div', {
    staticClass: "picker region"
  })]) : _vm._e()], 1)
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-38a26f73", esExports)
  }
}

/***/ }),

/***/ 107:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export URL */
/* unused harmony export API */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return testAxios; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_md5__ = __webpack_require__(108);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_md5___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_md5__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_js_yydjs_js__ = __webpack_require__(5);



var URL = 'https://www.muyouche.com'; //域名

var API = function API(config) {
    // let arr=config.url.split('/');
    // let testToken=['68c476b0-aeb4-4f08-a8a4-86ae82863eaf'];

    // //lStore.set('token',testToken[0]);

    // delete config.url;
    // config.url=URL+'/*.jsonRequest';
    // config.header={
    //     'X-Access-Token':wx.getStorageSync('token')||testToken[0],
    //     'X-Service-Id':'cas.wxregistrationService',
    //     'X-Service-Method':'findAreaOrg',

    // };

    Object(__WEBPACK_IMPORTED_MODULE_1_js_yydjs_js__["f" /* wxRequest */])(config);
};

//axios请求示例
var testAxios = function testAxios(data, endFn) {
    API({
        url: URL + '/action2/AllProvince.ashx',
        method: 'post',
        data: data,
        success: function success(res) {
            endFn && endFn(res);
        }
    });
};



/***/ }),

/***/ 111:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "home"
  }, [_c('swiperWrap', {
    attrs: {
      "dataList": [{
          src: 'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
          link: '../user/user',
        },
        {
          src: 'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
          link: '../user/user',
        },
        {
          src: 'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
          link: '../user/user',
        } ],
      "mpcomid": '0'
    }
  }, [_c('div', [_vm._v("111111111111111")])]), _vm._v(" "), _c('pickerWrap', {
    attrs: {
      "mode": 'selector',
      "range": ['美国', '中国', '巴西', '日本'],
      "value": _vm.index1,
      "change": _vm.changeFn1,
      "mpcomid": '1'
    }
  }), _vm._v(" "), _c('pickerWrap', {
    attrs: {
      "mode": 'selector',
      "range": [{
        id: 0,
        name: '美国'
      }, {
        id: 1,
        name: '中国'
      }, {
        id: 2,
        name: '巴西'
      }, {
        id: 3,
        name: '日本'
      }],
      "value": _vm.index11,
      "change": _vm.changeFn11,
      "mpcomid": '2'
    }
  }), _vm._v(" "), _c('pickerWrap', {
    attrs: {
      "mode": 'multiSelector',
      "range": [
        ['无脊柱动物', '脊柱动物'],
        ['扁性动物', '线形动物', '环节动物', '软体动物', '节肢动物'],
        ['猪肉绦虫', '吸血虫']
      ],
      "value": _vm.arrIndex2,
      "change": _vm.changeFn2,
      "mpcomid": '3'
    }
  }), _vm._v(" "), _c('pickerWrap', {
    attrs: {
      "mode": 'multiSelector',
      "range": _vm.gangedArr,
      "value": _vm.gangedArrIndex,
      "ganged": true,
      "change": _vm.gChangeFn,
      "cancel": _vm.gCancelFn,
      "columnchange": _vm.gColumnchangeFn,
      "mpcomid": '4'
    }
  }), _vm._v(" "), _c('pickerWrap', {
    attrs: {
      "mode": 'time',
      "value": _vm.time,
      "change": _vm.tChangeFn,
      "mpcomid": '5'
    }
  }), _vm._v(" "), _c('pickerWrap', {
    attrs: {
      "mode": 'date',
      "value": _vm.date,
      "change": _vm.dChangeFn,
      "mpcomid": '6'
    }
  }), _vm._v(" "), _c('pickerWrap', {
    attrs: {
      "mode": 'region',
      "value": _vm.region,
      "change": _vm.rChangeFn,
      "mpcomid": '7'
    }
  }), _vm._v(" "), _c('div', {
    attrs: {
      "eventid": '0'
    },
    on: {
      "click": _vm.clickFn
    }
  }, [_vm._v("跳转")])], 1)
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-0e7c7666", esExports)
  }
}

/***/ }),

/***/ 96:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_mpvue_loader_1_1_4_mpvue_loader_lib_selector_type_script_index_0_home_vue__ = __webpack_require__(98);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_mpvue_loader_1_1_4_mpvue_loader_lib_template_compiler_index_id_data_v_0e7c7666_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_mpvue_loader_1_1_4_mpvue_loader_lib_selector_type_template_index_0_home_vue__ = __webpack_require__(111);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(97)
}
var normalizeComponent = __webpack_require__(9)
/* script */

/* template */

/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-0e7c7666"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_mpvue_loader_1_1_4_mpvue_loader_lib_selector_type_script_index_0_home_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_mpvue_loader_1_1_4_mpvue_loader_lib_template_compiler_index_id_data_v_0e7c7666_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_mpvue_loader_1_1_4_mpvue_loader_lib_selector_type_template_index_0_home_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src\\pages\\home\\home.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] home.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-0e7c7666", Component.options)
  } else {
    hotAPI.reload("data-v-0e7c7666", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 97:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 98:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_components_swiperWrap__ = __webpack_require__(99);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_components_pickerWrap__ = __webpack_require__(103);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_js_yydjs__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_services__ = __webpack_require__(107);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//






var resetDataFn = Object(__WEBPACK_IMPORTED_MODULE_2_js_yydjs__["c" /* resetData */])({
    dataList: [],
    index1: 0,
    index11: 0,
    arrIndex2: [],
    arrIndex22: [],
    gangedArr: [],
    gangedArrIndex: [],
    time: '',
    date: '',
    region: []
});

/* harmony default export */ __webpack_exports__["a"] = ({
    data: function data() {
        return resetDataFn.data;
    },
    onHide: function onHide() {
        //重置data
        resetDataFn.reset(this);
    },
    onShow: function onShow() {
        var _this = this;

        Object(__WEBPACK_IMPORTED_MODULE_3_services__["a" /* testAxios */])([], function (res) {
            console.log(res);
        });

        var gangedArr = [];
        this.mockGangedArr(null, function (res) {
            gangedArr.push(res);
            _this.mockGangedArr(gangedArr[0][0].id, function (res1) {
                gangedArr.push(res1);
                _this.mockGangedArr(gangedArr[1][0].id, function (res2) {
                    gangedArr.push(res2);
                    _this.gangedArr = gangedArr;
                });
            });
        });

        Object(__WEBPACK_IMPORTED_MODULE_2_js_yydjs__["e" /* wxGetLocation */])({
            success: function success(res, detail) {
                console.log(res, detail);
            }
        });
    },


    methods: {
        clickFn: function clickFn() {
            wx.navigateTo({
                url: '../test/test'
            });
        },
        changeFn1: function changeFn1(changeValue) {
            var res = changeValue(this, 'index1');

            console.log(res);
        },
        changeFn11: function changeFn11(changeValue) {
            var res = changeValue(this, 'index11');

            console.log(res);
        },
        changeFn2: function changeFn2(changeValue) {
            var res = changeValue(this, 'arrIndex2');

            console.log(res);
        },
        changeFn22: function changeFn22(changeValue) {
            var res = changeValue(this, 'arrIndex22');

            console.log(res);
        },
        mockGangedArr: function mockGangedArr(id, endFn) {
            var arr = [];

            switch (id) {
                case '1':
                    arr = [{ id: '1-1', name: '扁性动物' }, { id: '1-2', name: '线性动物' }];
                    break;
                case '1-1':
                    arr = [{ id: '1-1-1', name: '猪肉绦虫' }, { id: '1-1-2', name: '吸血虫' }, { id: '1-1-3', name: '尸蟞' }];
                    break;
                case '1-2':
                    arr = [{ id: '1-2-1', name: '蛔虫' }, { id: '1-2-2', name: '线虫' }];
                    break;
                case '2':
                    arr = [{ id: '2-1', name: '鱼' }, { id: '2-2', name: '两栖动物' }];
                    break;
                case '2-1':
                    arr = [{ id: '2-1-1', name: '鲫鱼' }, { id: '2-1-2', name: '带鱼' }];
                    break;
                case '2-2':
                    arr = [{ id: '2-2-1', name: '青蛙' }, { id: '2-2-2', name: '娃娃鱼' }];
                    break;
                default:
                    arr = [{ id: '1', name: '无脊柱动物' }, { id: '2', name: '脊柱动物' }];
            }

            setTimeout(function () {
                endFn && endFn(arr);
            }, 100);
        },
        gChangeFn: function gChangeFn(changeValue) {
            var res = changeValue(this, 'gangedArrIndex', 'gangedArr');

            console.log(res);
        },
        gCancelFn: function gCancelFn(cancelValue) {
            cancelValue(this, 'gangedArrIndex', 'gangedArr');
        },
        gColumnchangeFn: function gColumnchangeFn(changeArray) {
            changeArray(this, 'gangedArrIndex', 'gangedArr', 3, this.mockGangedArr);
        },
        tChangeFn: function tChangeFn(changeArray) {
            var res = changeArray(this, 'time');

            console.log(res);
        },
        dChangeFn: function dChangeFn(changeArray) {
            var res = changeArray(this, 'date');

            console.log(res);
        },
        rChangeFn: function rChangeFn(changeArray) {
            var res = changeArray(this, 'region');

            console.log(res);
        }
    },

    components: {
        swiperWrap: __WEBPACK_IMPORTED_MODULE_0_components_swiperWrap__["a" /* default */],
        pickerWrap: __WEBPACK_IMPORTED_MODULE_1_components_pickerWrap__["a" /* default */]
    }
});

/***/ }),

/***/ 99:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_mpvue_loader_1_1_4_mpvue_loader_lib_selector_type_script_index_0_swiperWrap_vue__ = __webpack_require__(101);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_mpvue_loader_1_1_4_mpvue_loader_lib_template_compiler_index_id_data_v_0007855d_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_mpvue_loader_1_1_4_mpvue_loader_lib_selector_type_template_index_0_swiperWrap_vue__ = __webpack_require__(102);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(100)
}
var normalizeComponent = __webpack_require__(9)
/* script */

/* template */

/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-0007855d"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_mpvue_loader_1_1_4_mpvue_loader_lib_selector_type_script_index_0_swiperWrap_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_mpvue_loader_1_1_4_mpvue_loader_lib_template_compiler_index_id_data_v_0007855d_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_mpvue_loader_1_1_4_mpvue_loader_lib_selector_type_template_index_0_swiperWrap_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src\\components\\swiperWrap.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] swiperWrap.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-0007855d", Component.options)
  } else {
    hotAPI.reload("data-v-0007855d", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ })

},[122]);
//# sourceMappingURL=home.js.map
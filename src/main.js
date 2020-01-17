import Vue from 'vue';
import store from './store';
import App from './App';
import { lStore, addRouter, resetVueData } from 'js/yydjs';

const MyPlugin = {};

MyPlugin.install = function (Vue, options) {
    //1. 添加全局方法或属性
    //获取相对域名
    Vue.prototype.URL = () => {
        return '';
    };

    //2. 添加全局资源
    Vue.directive('myDirective', {
        bind(el, binding, vnode, oldVnode) { //只调用一次，指令第一次绑定到元素时调用。

        },
        inserted(el, binding, vnode, oldVnode) { //被绑定元素插入父节点时调用

        },
        update(el, binding, vnode, oldVnode) { //所在组件的 VNode 更新时调用，但是可能发生在其子 VNode 更新之前。

        },
        componentUpdated(el, binding, vnode, oldVnode) { //指令所在组件的 VNode 及其子 VNode 全部更新后调用。

        },
        unbind(el, binding, vnode, oldVnode) { //只调用一次，指令与元素解绑时调用。

        },
    });

    //3. 注入组件
    Vue.mixin({
        data() {
            return {

            }
        },
        onLoad() {
            //增加路由对象
            addRouter(this);
        },
        onUnload() {
            //重置页面中data的数据
            resetVueData(this);
        },
        methods: {

        },
        components: {

        },
    });

    //4. 添加实例方法
    //Vue.prototype.method=yyd;
}

//调用 `MyPlugin.install(Vue)`
Vue.use(MyPlugin);

const vm = new Vue({
    store,
    ...App
});
vm.$mount();

lStore.remove('isConnected');
lStore.remove('beCallingData');

export default vm;
//console.log(wx);

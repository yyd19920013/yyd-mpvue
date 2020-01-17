import Vue from 'vue';
import Vuex from 'vuex';

import getters from './getters';
import mutations from './mutations';
import actions from './actions';
import modules from './modules';

Vue.use(Vuex);

const state = {
	isLoading:false,//当前加载状态
}

export default new Vuex.Store({
	state,
	getters,
	actions,
	mutations,
	modules
})
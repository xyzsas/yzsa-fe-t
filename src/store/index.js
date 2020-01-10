import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    menuSelect: ['home', ''],
    pageTitle: ''
  },
  mutations: {
    routeTo: function (state, payload) {
      state.menuSelect = payload.menuSelect;
      state.pageTitle = payload.pageTitle;
    }
  },
  actions: {
  },
  modules: {
  }
})

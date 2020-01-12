import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    menuSelect: ['home', ''],
    pageTitle: '',
    currentTask: {}
  },
  mutations: {
    routeTo: function (state, payload) {
      state.menuSelect = payload.menuSelect;
      if(payload.addCurrentTask) {
        state.pageTitle = `${payload.pageTitle} - ${state.currentTask.title}(${state.currentTask.id})`
      } else {
        state.pageTitle = payload.pageTitle;
      }
    },
    selectTask: function (state, payload) {
      state.currentTask = payload;
    }
  },
  actions: {
  },
  modules: {
  }
})

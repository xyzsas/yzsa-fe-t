import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    menuSelect: ['home', ''],
    pageTitle: '',
    currentTask: {
      id: '',
      name: '',
    }
  },
  mutations: {
    routeTo: function (state, payload) {
      state.menuSelect = payload.menuSelect;
      if(payload.addCurrentTask) {
        state.pageTitle = `${payload.pageTitle} - ${state.currentTask.name}(${state.currentTask.id})`
      } else {
        state.pageTitle = payload.pageTitle;
      }
    }
  },
  actions: {
  },
  modules: {
  }
})

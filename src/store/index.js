import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    menuSelect: ['home', ''], // 主页两个菜单的选择项
    pageTitle: '', // 当前页标题
    currentTask: {}, // 目前选中的task
    currentPermission: {} // 目前选中的permission
  },
  mutations: {
    // 页面跳转，payload直接传入路由meta，详见router
    routeTo: function (state, payload) {
      state.menuSelect = payload.menuSelect;
      if(payload.addCurrentTask) {
        state.pageTitle = `${payload.pageTitle} - ${state.currentTask.title}(${state.currentTask.id})`
      } else if(payload.addCurrentPermission) {
        state.pageTitle = `${payload.pageTitle} - ${state.currentPermission.name}(${state.currentPermission.id})`
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

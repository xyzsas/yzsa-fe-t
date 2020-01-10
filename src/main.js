import Vue from 'vue'
import './plugins/axios'
import AntDesignVue from 'ant-design-vue'

import 'ant-design-vue/dist/antd.css'

import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false;

Vue.use(AntDesignVue);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');

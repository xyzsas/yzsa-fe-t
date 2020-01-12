import Vue from 'vue'
import VueRouter from 'vue-router'

import { Modal } from 'ant-design-vue';

import store from '../store'

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    component: () => { return import('../views/Base') },
    children: [
      {
        path: '',
        component: () => { return import('../views/Home') },
        meta: {
          menuSelect: ['home', ''],
          pageTitle: '主页',
          role: 'teacher'
        }
      },
      {
        path: 'tasks',
        component: () => { return import('../views/Tasks') },
        meta: {
          menuSelect: ['tasks', ''],
          pageTitle: '任务管理',
          role: 'teacher'
        }
      },
      {
        path: 'task',
        component: () => { return import('../views/task/Base') },
        children: [
          {
            path: '',
            component: () => { return import('../views/task/Info') },
            meta: {
              menuSelect: ['tasks', 'info'],
              pageTitle: '任务信息',
              role: 'teacher',
              addCurrentTask: true
            }
          }
        ]
      }
    ]
  }
];

const router = new VueRouter({
  routes
});

router.beforeEach((to, from, next) => {
  store.commit('routeTo', to.meta);
  let role = window.sessionStorage['role'];
  if(role === 'admin' || role === to.meta.role) {
    next();
  } else {
    Modal.error({
      title: '错误',
      content: '您没有权限',
      onOk() {
        window.location.href = '/';
      }
    });
  }
});

export default router

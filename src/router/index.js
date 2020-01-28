import Vue from 'vue'
import VueRouter from 'vue-router'

import { Modal } from 'ant-design-vue';

import store from '../store'

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    component: () => { return import('../views/Base') }, // 横向导航条
    children: [
      {
        path: '',
        component: () => { return import('../views/Home') },
        meta: {
          menuSelect: ['home', ''], // 选择的菜单项
          pageTitle: '主页', // 页标题
          role: 'teacher' // 许可权限
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
        component: () => { return import('../views/task/Base') }, // 纵向导航条
        children: [
          {
            path: '',
            component: () => { return import('../views/task/Info') },
            meta: {
              menuSelect: ['tasks', 'info'],
              pageTitle: '任务信息',
              role: 'teacher',
              addCurrentTask: true // 在页面标题栏目中加入当前选择的task
            }
          },
          {
            path: 'edit',
            component: () => { return import('../views/task/Edit') },
            meta: {
              menuSelect: ['tasks', 'edit'],
              pageTitle: '编辑任务',
              role: 'teacher',
              addCurrentTask: true
            }
          },
          {
            path: 'runtime',
            component: () => { return import('../views/task/Runtime') },
            meta: {
              menuSelect: ['tasks', 'runtime'],
              pageTitle: '运行管理',
              role: 'teacher',
              addCurrentTask: true
            }
          },
          {
            path: 'record',
            component: () => { return import('../views/task/Record') },
            meta: {
              menuSelect: ['tasks', 'record'],
              pageTitle: '任务记录',
              role: 'teacher',
              addCurrentTask: true
            }
          },
        ]
      },
      {
        path: 'permission',
        component: () => { return import('../views/Permission') },
        meta: {
          menuSelect: ['user', ''],
          pageTitle: '权限树',
          role: 'admin'
        }
      },
      {
        path: 'user',
        component: () => { return import('../views/user/Base') },
        children: [
          {
            path: '',
            component: () => { return import('../views/user/List') },
            meta: {
              menuSelect: ['user', 'list'],
              pageTitle: '用户列表',
              role: 'admin',
              addCurrentPermission: true
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

// 路由鉴权，admin全部放行，其它校验
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

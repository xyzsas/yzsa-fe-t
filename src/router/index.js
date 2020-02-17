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
        path: 'user',
        component: () => { return import('../views/user/Base') },
        children: [
          {
            path: '',
            component: () => { return import('../views/user/Tree') },
            meta: {
              menuSelect: ['user', 'tree'],
              pageTitle: '权限树',
              role: 'admin'
            }
          },
          {
            path: 'batch',
            component: () => { return import('../views/user/batch/Base') },
            meta: {
              menuSelect: ['user', 'batch'],
              pageTitle: '批量操作',
              role: 'admin'
            }
          }
        ]
      },
      {
        path: 'permission',
        component: () => { return import('../views/permission/Base') },
        children: [
          {
            path: '',
            component: () => { return import('../views/permission/Info') },
            meta: {
              menuSelect: ['user', 'info'],
              pageTitle: '节点信息',
              role: 'admin',
              addCurrentPermission: true
            }
          },
          {
            path: 'edit',
            component: () => { return import('../views/permission/Edit') },
            meta: {
              menuSelect: ['user', 'edit'],
              pageTitle: '编辑节点',
              role: 'admin',
              addCurrentPermission: true
            }
          },
          {
            path: 'user',
            component: () => { return import('../views/permission/User') },
            meta: {
              menuSelect: ['user', 'user'],
              pageTitle: '用户管理',
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

<template>
  <a-layout id="app-bar">
    <a-layout-header class="header">
      <div class="logo">学生事务系统</div>
      <a-menu
        theme="dark"
        mode="horizontal"
        :selectedKeys="[$store.state.menuSelect[0]]"
        style="line-height: 64px;"
      >
        <a-menu-item
          key="home"
          v-if="role === 'admin' || role === 'teacher'"
          @click="$router.push('/')"
        >
          <a-icon type="home" />
          主页
        </a-menu-item>

        <a-menu-item
          key="tasks"
          v-if="role === 'admin' || role === 'teacher'"
          @click="$router.push('/tasks')"
        >
          <a-icon type="project" />
          任务管理
        </a-menu-item>
        <a-menu-item
          key="user"
          v-if="role === 'admin'"
          @click="$router.push('/tree')"
        >
          <a-icon type="team" />
          用户管理
        </a-menu-item>
        <a-menu-item style="float: right;" key="exit" @click="back"><a-icon type="logout" />返回前台</a-menu-item>
      </a-menu>
    </a-layout-header>
    <router-view />
  </a-layout>
</template>

<script>
  export default {
    computed: {
      name() {
        return window.sessionStorage['name'];
      },
      role() {
        return window.sessionStorage['role'];
      }
    },
    methods: {
      back() {
        window.location.href = '/';
      }
    }
  }
</script>

<style scoped>
  #app-bar .header {
    background: #fff;
    padding: 0;
    min-width: 1056px;
  }

  #app-bar .logo {
    float: left;
    color: #ffffff;
    margin-left: 28px;
    margin-right: 28px;
    font-size: 1.5em;
  }
</style>

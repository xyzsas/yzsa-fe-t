<template>
  <a-layout>
    <a-layout-sider collapsible v-model="collapsed">
      <a-menu
        mode="inline"
        theme="dark"
        :selectedKeys="$store.state.menuSelect"
        :inlineCollapsed="collapsed"
      >
        <a-menu-item key="password" @click="$router.push('/settings')">
          <a-icon type="key" />
          <span>修改密码</span>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <div style="background: #ffffff; margin: 16px 16px 0 16px; padding: 8px; font-size: 1.5em;">
        {{ $store.state.pageTitle }}
      </div>
      <a-layout-content style="min-height: calc(100vh - 192px); padding: 16px;">
        <div style="background: #ffffff; padding: 16px; min-height: calc(100vh - 192px);">
          <router-view/>
        </div>
      </a-layout-content>
      <a-layout-footer style="padding: 0; height: 32px; line-height: 32px; text-align: center;">
        YZSA © 2020 ITI
      </a-layout-footer>
    </a-layout>
  </a-layout>
</template>

<script>
  export default {
    data() {
      return {
        collapsed: false
      }
    }
  }
</script>

<style scoped>

</style>

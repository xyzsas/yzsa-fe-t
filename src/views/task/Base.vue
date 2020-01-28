<template>
  <a-layout>
    <a-layout-sider collapsible v-model="collapsed">
      <div style="
        height: 40px;
        margin: 4px 0 4px 0;
        padding: 0 32px 0 32px;
        color: #ffffff;
        line-height: 40px;
        font-size: 1.3em;
        font-weight: bold;
       ">
        <template v-if="collapsed">
          <a-icon type="project" />
        </template>
        <template v-else>
          任务管理
        </template>
      </div>
      <a-menu
        mode="inline"
        theme="dark"
        :selectedKeys="$store.state.menuSelect"
        :inlineCollapsed="collapsed"
      >
        <a-menu-item key="info" @click="$router.push('/task/')">
          <a-icon type="info-circle" />
          <span>任务信息</span>
        </a-menu-item>

        <a-menu-item key="edit" @click="$router.push('/task/edit')">
          <a-icon type="edit" />
          <span>编辑任务</span>
        </a-menu-item>

        <a-menu-item key="runtime" @click="$router.push('/task/runtime')">
          <a-icon type="play-circle" />
          <span>运行管理</span>
        </a-menu-item>

        <a-menu-item key="record" @click="$router.push('/task/record')">
          <a-icon type="form" />
          <span>任务记录</span>
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

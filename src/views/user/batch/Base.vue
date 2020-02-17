<template>
  <a-tabs>
    <a-tab-pane key="user">
      <span slot="tab">
        <a-icon type="usergroup-add" />
        批量添加用户
      </span>
      <batch-user></batch-user>
    </a-tab-pane>
    <a-tab-pane key="permission">
      <span slot="tab">
        <a-icon type="branches" />
        批量添加权限节点
      </span>
      <batch-permission></batch-permission>
    </a-tab-pane>
  </a-tabs>
</template>

<script>
  export default {
    components: {
      BatchUser: () => import('./User'),
      BatchPermission: () => import('./Permission')
    }
  }
</script>

<style scoped>

</style>

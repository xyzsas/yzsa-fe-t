<template>
  <a-tabs :active-key="$store.state.menuSelect[2]" @change="onChange">
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
    },
    methods: {
      onChange(actionKey) {
        this.$router.replace(`/user/batch/${actionKey}`)
      }
    }
  }
</script>

<style scoped>

</style>

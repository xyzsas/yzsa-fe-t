<template>
  <div>
    <table style="table-layout: fixed;">
      <tr style="height: 40px;">
        <td><b>ID：</b></td>
        <td>{{ permission.id }}</td>
      </tr>
      <tr style="height: 40px;">
        <td><b>名称：</b></td>
        <td>{{ permission.name }}</td>
      </tr>
      <tr style="height: 40px;">
        <td><b>父节点ID：</b></td>
        <td>{{ permission.father }}</td>
      </tr>
      <tr style="height: 40px;">
        <td><b>任务列表：</b></td>
      </tr>
    </table>
    <a-list size="small" style="width:300px;" bordered :dataSource="permission.tasks">
      <a-list-item slot="renderItem" slot-scope="item">
        <a-list-item-meta><span slot="title" >{{ item }}</span></a-list-item-meta>
      </a-list-item>
    </a-list>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        permission: this.$store.state.currentPermission
      }
    }
  }
</script>

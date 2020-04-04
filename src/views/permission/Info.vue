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

    <a-table style="width: 600px;" :columns="columns" :dataSource="taskList" :loading="loading" size="middle" rowKey="id"></a-table>
  </div>
</template>

<script>

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id'
    },
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title'
    }
  ];

  export default {
    data() {
      return {
        columns,

        loading: true,
        permission: this.$store.state.currentPermission,

        taskList: []
      }
    },
    async mounted() {
      let tasks, taskNames = {};
      await this.axios.get('/api/T/task')
        .then(res => {
          tasks = res.data;
        });
      for(let i = 0; i < tasks.length; i++) {
        taskNames[tasks[i].id] = tasks[i].title;
      }
      for(let i = 0; i < this.permission.tasks.length; i++) {
        this.taskList.push({
          id: this.permission.tasks[i],
          title: taskNames[this.permission.tasks[i]]
        });
      }
      this.loading = false;
    }
  }
</script>

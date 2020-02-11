<template>
  <div>
    <table style="table-layout: fixed;">
      <tr style="height: 40px;">
        <td><b>ID：</b></td>
        <td>{{ permission.id }}</td>
      </tr>
      <tr style="height: 40px;">
        <td><b>名称：</b></td>
        <td><a-input placeholder="节点名称" v-model="permission.name"></a-input></td>
      </tr>
      <tr style="height: 40px;">
        <td><b>父节点ID：</b></td>
        <td><a-input placeholder="父节点ID" v-model="permission.father"></a-input></td>
      </tr>
      <tr style="height: 40px;">
        <td><b>任务列表：</b></td>
      </tr>
    </table>
    <a-list size="small" style="width:300px;" bordered :dataSource="permission.tasks">
      <a-list-item slot="renderItem" slot-scope="item, index">
        <a-list-item-meta><span slot="title" >{{ item }}</span></a-list-item-meta>
        <div style="color: #f5222d; cursor: pointer;" @click="removeTask(index)"><a-icon type="delete" /></div>
      </a-list-item>
      <div slot="header">
        <a-button type="dashed" block @click="modalVisible = true"><a-icon type="plus" />添加任务</a-button>
      </div>
    </a-list>

    <a-button @click="updatePermission" style="margin-top: 16px; width: 200px;" type="primary" :loading="loading">提交修改</a-button>
    <br>
    <a-button @click="deletePermission" style="margin-top: 16px; width: 200px;" type="danger">删除节点</a-button>

    <a-modal
      title="添加任务"
      v-model="modalVisible"
      @ok="addTask"
      okText="确认"
      cancelText="取消"
    >
      <a-input placeholder="任务ID" v-model="newTaskId"></a-input>
    </a-modal>

  </div>
</template>

<script>
  import { Modal } from 'ant-design-vue';

  export default {
    data() {
      return {
        permission: {
          id: this.$store.state.currentPermission.id,
          name: this.$store.state.currentPermission.name,
          father: this.$store.state.currentPermission.father,
          tasks: [].concat(this.$store.state.currentPermission.tasks)
        },

        newTaskId: '',
        modalVisible: false,

        loading: false

      }
    },
    methods: {
      removeTask(index) {
        this.permission.tasks.splice(index, 1);
      },
      addTask() {
        this.permission.tasks.push(this.newTaskId);
        this.newTaskId = '';
        this.modalVisible = false;
      },
      updatePermission() {
        this.loading = true;
        this.$axios.put('/api/A/permission', this.permission)
          .then(res => {
            this.$store.state.currentPermission = this.permission;
            this.$router.push('/permission');
            Modal.success({
              title: '成功',
              content: '节点修改成功'
            });
          })
          .catch(err => {
            this.$router.push('/permission');
          })
      },
      deletePermission() {
        let that = this;
        Modal.confirm({
          title: '确认危险操作',
          content: '确定删除节点？该节点的子节点及全部相关用户将被一并删除！',
          okText: '确认',
          okType: 'danger',
          cancelText: '取消',
          onOk() {
            return new Promise(resolve => {
              that.$axios.delete(`/api/A/permission/${that.permission.id}`)
                .then(res => {
                  Modal.success({
                    title: '成功',
                    content: '删除权限节点、子节点及所属用户成功'
                  });
                  that.$router.push('/user');
                  resolve();
                })
                .catch(err => {
                  that.$router.push('/permission');
                  resolve();
                })
            });
          }
        });
      }
    }
  }
</script>

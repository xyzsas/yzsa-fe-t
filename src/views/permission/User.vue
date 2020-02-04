<template>
  <div>
    <a-button type="dashed" block @click="openModalNew" style="margin-bottom: 16px;"><a-icon type="plus" />新建用户</a-button>
    <a-table :columns="columns" :dataSource="users" :loading="loading" rowKey="id">
      <span slot="action" slot-scope="i">
        <a @click="openModalPermission(i.id)">修改权限节点</a>
        <a-divider type="vertical" />
        <a @click="openModalName(i.id)">修改姓名</a>
        <a-divider type="vertical" />
        <a @click="resetPwd(i.id)">重置密码</a>
        <a-divider type="vertical" />
        <a @click="deleteUser(i.id)">删除用户</a>
      </span>
    </a-table>

    <a-modal
      title="修改权限节点"
      v-model="modalPermission.visible"
      :confirm-loading="modalPermission.loading"
      @ok="updatePermission"
      okText="确认"
      cancelText="取消"
    >
      <a-input placeholder="节点ID" v-model="modalPermission.permission"></a-input>
    </a-modal>

    <a-modal
      title="修改姓名"
      v-model="modalName.visible"
      :confirm-loading="modalName.loading"
      @ok="updateName"
      okText="确认"
      cancelText="取消"
    >
      <a-input placeholder="新姓名" v-model="modalName.name"></a-input>
    </a-modal>

    <a-modal
      title="新建用户"
      v-model="modalNew.visible"
      :confirm-loading="modalNew.loading"
      @ok="newUser"
      okText="确认"
      cancelText="取消"
    >
      <a-input placeholder="用户ID" v-model="modalNew.id" style="margin-bottom: 16px;"></a-input>
      <a-input placeholder="用户姓名" v-model="modalNew.name" style="margin-bottom: 16px;"></a-input>
      <a-input placeholder="用户角色" v-model="modalNew.role"></a-input>
    </a-modal>

  </div>
</template>

<script>
  import { Modal } from 'ant-design-vue';

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id'
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role'
    },
    {
      title: '操作',
      key: 'action',
      scopedSlots: {
        customRender: 'action'
      }
    }
  ];

  export default {
    data() {
      return {
        columns,
        permission: this.$store.state.currentPermission,

        users: [],
        loading: false,

        user: '',

        modalPermission: {
          visible: false,
          loading: false,
          permission: ''
        },
        modalName: {
          visible: false,
          loading: false,
          name: ''
        },
        modalNew: {
          visible: false,
          loading: false,
          id: '',
          name: '',
          role: ''
        }
      }
    },
    mounted() {
      this.getList();
    },
    methods: {
      getList() {
        this.loading = true;
        this.$axios.get('/api/A/user', {
          params: {
            'permission': this.permission.id
          }
        })
          .then(res => {
            this.users = res.data;
            this.loading = false;
          })
      },
      openModalPermission(id) {
        this.user = id;
        this.modalPermission.permission = '';
        this.modalPermission.visible = true;
      },
      openModalName(id) {
        this.user = id;
        this.modalName.name = '';
        this.modalName.visible = true;
      },
      openModalNew() {
        this.modalNew.id = '';
        this.modalNew.name = '';
        this.modalNew.role = '';
        this.modalNew.visible = true;
      },
      updatePermission() {
        this.modalPermission.loading = true;
        this.$axios.put(`/api/A/user/${this.user}/permission`, {
          permission: this.modalPermission.permission
        })
          .then(res => {
            this.modalPermission.loading = false;
            this.modalPermission.visible = false;
            Modal.success({
              title: '成功',
              content: '修改用户权限节点成功'
            });
            this.getList();
          })
          .catch(err => {
            this.modalPermission.loading = false;
            this.modalPermission.visible = false;
            this.getList();
          })
      },
      updateName() {
        this.modalName.loading = true;
        this.$axios.put(`/api/A/user/${this.user}/name`, {
          name: this.modalName.name
        })
          .then(res => {
            this.modalName.loading = false;
            this.modalName.visible = false;
            Modal.success({
              title: '成功',
              content: '修改用户姓名成功'
            });
            this.getList();
          })
          .catch(err => {
            this.modalName.loading = false;
            this.modalName.visible = false;
            this.getList();
          })
      },
      resetPwd(id) {
        let that = this;
        Modal.confirm({
          title: '确认危险操作',
          content: '确定重置用户密码？用户将被强制登出！',
          okText: '确认',
          okType: 'danger',
          cancelText: '取消',
          onOk() {
            return new Promise(resolve => {
              that.$axios.put(`/api/A/user/${id}/pwd`)
                .then(res => {
                  Modal.success({
                    title: '成功',
                    content: '成功将用户密码重置为其ID'
                  });
                  resolve();
                })
                .catch(err => {
                  resolve();
                })
            });
          }
        });
      },
      deleteUser(id) {
        let that = this;
        Modal.confirm({
          title: '确认危险操作',
          content: '确定删除用户？',
          okText: '确认',
          okType: 'danger',
          cancelText: '取消',
          onOk() {
            return new Promise(resolve => {
              that.$axios.delete(`/api/A/user/${id}`)
                .then(res => {
                  Modal.success({
                    title: '成功',
                    content: '删除用户成功'
                  });
                  that.getList();
                  resolve();
                })
                .catch(err => {
                  that.getList();
                  resolve();
                })
            });
          }
        });
      },
      newUser() {
        this.modalNew.loading = true;
        this.$axios.post('/api/A/user', {
          id: this.modalNew.id,
          name: this.modalNew.name,
          role: this.modalNew.role,
          permission: this.permission.id
        })
          .then(res => {
            this.modalNew.loading = false;
            this.modalNew.visible = false;
            Modal.success({
              title: '成功',
              content: '新建用户成功'
            });
            this.getList();
          })
          .catch(err => {
            this.modalNew.loading = false;
            this.modalNew.visible = false;
            this.getList();
          })
      }
    }
  }
</script>

<style scoped>

</style>

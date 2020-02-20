<template>
  <div>
    <a-input-search style="width: 300px;" placeholder="用户ID" @search="onSearch" enterButton />
    <a-divider />
    <template v-if="show">
      <div v-if="loading" style="text-align: center;">
        <a-spin />
      </div>
      <template v-else>
        <table style="table-layout: fixed; margin-bottom: 16px;">
          <tr style="height: 40px;">
            <td><b>ID：</b></td>
            <td>{{ user.id }}</td>
          </tr>
          <tr style="height: 40px;">
            <td><b>姓名：</b></td>
            <td>{{ user.name }}</td>
          </tr>
          <tr style="height: 40px;">
            <td><b>角色：</b></td>
            <td>{{ user.role }}</td>
          </tr>
          <tr style="height: 40px;">
            <td><b>权限节点ID：</b></td>
            <td>{{ user.permission }}</td>
          </tr>
        </table>
        <a-button style="width: 200px; margin-bottom: 16px;" @click="openModalPermission">修改权限节点</a-button>
        <br>
        <a-button style="width: 200px; margin-bottom: 16px;" @click="openModalName">修改姓名</a-button>
        <br>
        <a-button style="width: 200px; margin-bottom: 16px;" @click="resetPwd">重置密码</a-button>
        <br>
        <a-button style="width: 200px; margin-bottom: 16px;" type="danger" @click="deleteUser">删除用户</a-button>
      </template>
    </template>

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

  </div>
</template>

<script>
  import { Modal } from 'ant-design-vue';

  export default {
    data() {
      return {
        show: false,
        loading: false,
        user: null,

        modalPermission: {
          visible: false,
          loading: false,
          permission: ''
        },
        modalName: {
          visible: false,
          loading: false,
          name: ''
        }
      }
    },
    methods: {
      onSearch(value, event) {
        this.loading = true;
        this.show = true;
        this.$axios.get(`/api/A/user/${value}`)
          .then(res => {
            this.user = res.data;
            this.loading = false;
          })
          .catch(res => {
            this.show = false;
            this.loading = false;
          })
      },
      openModalPermission() {
        this.modalPermission.permission = '';
        this.modalPermission.visible = true;
      },
      openModalName() {
        this.modalName.name = '';
        this.modalName.visible = true;
      },
      updatePermission() {
        this.modalPermission.loading = true;
        this.$axios.put(`/api/A/user/${this.user.id}/permission`, {
          permission: this.modalPermission.permission
        })
          .then(res => {
            this.modalPermission.loading = false;
            this.modalPermission.visible = false;
            Modal.success({
              title: '成功',
              content: '修改用户权限节点成功'
            });
            this.onSearch(this.user.id, null);
          })
          .catch(err => {
            this.modalPermission.loading = false;
            this.modalPermission.visible = false;
            this.onSearch(this.user.id, null);
          })
      },
      updateName() {
        this.modalName.loading = true;
        this.$axios.put(`/api/A/user/${this.user.id}/name`, {
          name: this.modalName.name
        })
          .then(res => {
            this.modalName.loading = false;
            this.modalName.visible = false;
            Modal.success({
              title: '成功',
              content: '修改用户姓名成功'
            });
            this.onSearch(this.user.id, null);
          })
          .catch(err => {
            this.modalName.loading = false;
            this.modalName.visible = false;
            this.onSearch(this.user.id, null);
          })
      },
      resetPwd() {
        let that = this;
        Modal.confirm({
          title: '确认危险操作',
          content: '确定重置用户密码？用户将被强制登出！',
          okText: '确认',
          okType: 'danger',
          cancelText: '取消',
          onOk() {
            return new Promise(resolve => {
              that.$axios.put(`/api/A/user/${that.user.id}/pwd`)
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
      deleteUser() {
        let that = this;
        Modal.confirm({
          title: '确认危险操作',
          content: '确定删除用户？',
          okText: '确认',
          okType: 'danger',
          cancelText: '取消',
          onOk() {
            return new Promise(resolve => {
              that.$axios.delete(`/api/A/user/${that.user.id}`)
                .then(res => {
                  Modal.success({
                    title: '成功',
                    content: '删除用户成功'
                  });
                  that.show = false;
                  resolve();
                })
                .catch(err => {
                  that.show = false;
                  resolve();
                })
            });
          }
        });
      }
    }
  }
</script>

<style scoped>

</style>

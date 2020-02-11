<template>
  <div>
    <a-table :columns="columns" :dataSource="data" :loading="loading" :pagination="false">
      <span slot="action" slot-scope="i">
        <a @click="openModal(i.id)">添加子节点</a>
        <a-divider type="vertical" />
        <a @click="manageNode(i)">管理节点</a>
      </span>
    </a-table>

    <a-modal
      title="添加子节点"
      v-model="modal.visible"
      :confirm-loading="modal.loading"
      @ok="insertNode"
      okText="确认"
      cancelText="取消"
    >
      <a-input placeholder="节点ID" v-model="permission.id" style="margin-bottom: 16px;"></a-input>
      <br>
      <a-input placeholder="节点名称" v-model="permission.name"></a-input>
    </a-modal>
  </div>
</template>

<script>
  import { Modal } from 'ant-design-vue';

  const columns = [
    {
      title: '权限节点名称',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id'
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
        loading: false,

        columns,
        data: [],

        modal: {
          visible: false,
          loading: false
        },

        permission: {
          id: '',
          name: '',
          father: ''
        }
      }
    },
    mounted() {
      this.buildTree();
    },
    methods: {
      async buildTree() {
        this.data = [];
        this.loading = true;
        let list, map = {}, i;
        await this.$axios.get('/api/A/permission')
          .then(res => {
            list = res.data;
          });
        for(i = 0; i < list.length; ++i) {
          map[list[i].id] = i;
          list[i].children = [];
          list[i].key = i;
        }
        for(i = 0; i < list.length; ++i) {
          if(list[i].father === '') {
            this.data.push(list[i]);
          } else {
            list[map[list[i].father]].children.push(list[i]);
          }
        }
        this.loading = false;
      },
      openModal(id) {
        this.permission.father = id;
        this.permission.id = '';
        this.permission.name = '';
        this.modal.visible = true;
      },
      insertNode() {
        this.modal.loading = true;
        if(this.permission.id === '') {
          Modal.error({
            'title': '失败',
            'content': '新节点ID不能为空'
          });
          this.modal.loading = false;
          this.modal.visible = false;
          return;
        }
        this.$axios.post('/api/A/permission', {
          'id': this.permission.id,
          'name': this.permission.name,
          'father': this.permission.father
        })
          .then(res => {
            Modal.success({
              'title': '成功',
              'content': '新子节点添加成功'
            });
            this.modal.loading = false;
            this.modal.visible = false;
            this.buildTree();
          })
          .catch(err => {
            this.modal.loading = false;
            this.modal.visible = false;
            this.buildTree();
          })
      },
      manageNode(permission) {
        this.$store.state.currentPermission = {
          id: permission.id,
          name: permission.name,
          father: permission.father,
          tasks: permission.tasks
        };
        this.$router.push('/permission');
      }
    }
  }
</script>

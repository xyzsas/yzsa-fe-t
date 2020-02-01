<template>
  <a-layout style="margin-left: auto; margin-right: auto; min-width: 1056px;">
    <div style="background: #ffffff; margin: 16px 16px 0 16px; padding: 8px; font-size: 1.5em; max-width: 1024px;">
      {{ $store.state.pageTitle }}
    </div>
    <a-layout-content style="min-height: calc(100vh - 192px); padding: 16px;">
      <div style="background: #ffffff; padding: 16px; min-height: calc(100vh - 192px); max-width: 1024px;">
        <div style="display: inline-flex; width: 100%; justify-content: space-between;">
          <div style="display: inline-flex; width: 100%; align-items: baseline;">
            <h1>权限树</h1>
            <h2 v-if="mode.open" style="color: #52c41a">（正在编辑）</h2>
          </div>
          
          <a-button @click="edit">{{mode.text}}</a-button>
        </div>
        <p>展示权限树，可增删改。可参考task</p>
        <a-tree :treeData="tree" style="font-size: 20px" @select="select"></a-tree>
      </div>
    </a-layout-content>
    <a-layout-footer style="padding: 0; height: 32px; line-height: 32px; text-align: center;">
      YZSA © 2020 ITI
    </a-layout-footer>
    <a-modal
      title="编辑节点"
      v-model="modalStat.visible"
      :confirm-loading="modalStat.loading"
      @ok="edit"
      okText="关闭修改界面"
      cancelText="编辑其他节点"
    >
      <h2>添加子节点</h2>
      <table>
        <tr>
          <td><b>新节点ID：</b></td>
          <td><a-input style="width: 220px" placeholder="请输入ID" v-model="newPermission.id" /></td>
        </tr>
      </table>
      <br/><a-button @click="createNode">确认添加</a-button>
      <a-divider/>
      <div style="display: inline-flex; width: 100%; justify-content: space-between;">
        <h2>修改当前节点</h2>
        <a-button style="color: red; border-color: red;" @click="deleteNode">删除当前节点</a-button>
      </div>
      
      <table>
        <tr>
          <td><b></b></td>
          <td><a-input style="width: 220px" placeholder="请输入ID" v-model="newPermission.id" /></td>
        </tr>
      </table>
      <br/><a-button @click="editNode">确认修改</a-button>
      <a-divider/>
    </a-modal>
  </a-layout>
</template>

<script>

  import { Modal } from 'ant-design-vue';

  export default {
    data() {
      return {
        tree: [],
        map: {},
        mode: {
          text: '编辑权限树',
          open: false,
        },
        modalStat: {
          visible: false,
          loading: false
        },
        newPermission: {
          id: '',
          father: '',
          tasks: []
        },
      }
    },
    async mounted() {
      this.constructTree()
    },
    methods: {
      select(key) {
        let permission = {}, node = this.map[key];
        permission.id = node.id;
        permission.father = node.father;
        permission.task = node.task; 
        this.$store.commit('selectPermission', permission);
        // if in edit mode open modal
        if (this.mode.open) {
          this.modalStat.visible = true;
          return;
        };
        this.$router.push('/user');
      },
      edit() {
        // close edit mode
        if (this.mode.open) {
          this.modalStat.loading = false;
          this.modalStat.visible = false;
          this.mode.open = false;
          this.mode.text = '编辑权限树';
        } else{
          // start edit mode
          this.mode.open = true;
          this.mode.text = '取消编辑';
        }
      },
      createNode() {
        this.modalStat.loading = true;
        if (!this.newPermission.id) {
          Modal.error({
            'title': '失败',
            'content': '新节点ID为空'
          })
          this.modalStat.loading = false;
          return;
        }
        console.log(this.newPermission)
        this.newPermission.father = this.$store.state.currentPermission.id;
        this.$axios.post(`/api/A/permission`, {
          'id': this.newPermission.id,
          'father': this.newPermission.father,
        })
          .then( res => {
            Modal.success({
              'title': '成功',
              'content': '新子节点添加成功'
            })
            this.modalStat.loading = false;
            this.constructTree();
          })
          .catch(err => {
            this.modalStat.loading = false;
          })
      },
      editNode() {

      },
      deleteNode() {
        this.modalStat.loading = true;
        this.$axios.delete(`/api/A/permission/${this.$store.state.currentPermission.id}`)
          .then( res => {
            Modal.success({
              'title': '成功',
              'content': res.data
            })
            this.modalStat.visible = false;
            this.modalStat.loading = false;
            this.constructTree();
          })
          .catch( err => {
            this.modalStat.loading = false;
          })
      },
      async constructTree() {
        let list;
        await this.$axios.get(`/api/A/permission`)
          .then(res => {
            list = Array.from(res.data);
          })

        let map = {}, node, roots = [], count = 0, i;
        for (i = 0; i < list.length; i += 1) {
            map[list[i].id] = i; 
            list[i]['children'] = []; 
            list[i]['title'] = list[i].id;
        }
        for (i = 0; i < list.length; i += 1) {
            node = list[i];
            if (node.father !== "") {
                list[map[node.father]]['children'].push(node);
                node['key'] = list[map[node.father]]['key'] + '-' + (list[map[node.father]]['children'].length - 1).toString(10)
            } else {
                node['key'] = count.toString(10);
                roots.push(node);
                count++;
            }
            this.map[node['key']] = node;
        }
        for (i = 0; i < list.length; i += 1) {
            node = list[i];
            if (node.children.lenth === 0) {
                delete node.children
            } 
        }
        this.tree = roots;
      }
    }
  }
</script>

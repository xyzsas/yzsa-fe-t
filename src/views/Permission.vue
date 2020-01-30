<template>
  <a-layout style="margin-left: auto; margin-right: auto; min-width: 1056px;">
    <div style="background: #ffffff; margin: 16px 16px 0 16px; padding: 8px; font-size: 1.5em; max-width: 1024px;">
      {{ $store.state.pageTitle }}
    </div>
    <a-layout-content style="min-height: calc(100vh - 192px); padding: 16px;">
      <div style="background: #ffffff; padding: 16px; min-height: calc(100vh - 192px); max-width: 1024px;">
        <h1>权限树</h1>
        <p>展示权限树，可增删改，可选中，放入vuex。可参考task</p>
        <a-tree :treeData="tree" style="font-size: 20px" @select="select"></a-tree>
      </div>
    </a-layout-content>
    <a-layout-footer style="padding: 0; height: 32px; line-height: 32px; text-align: center;">
      YZSA © 2020 ITI
    </a-layout-footer>
  </a-layout>
</template>

<script>
  export default {
    data() {
      return {
        tree: [],
        map: {}
      }
    },
    async mounted() {
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
    },
    methods: {
      select(key) {
        let permission = {}, node = this.map[key];
        permission.id = node.id;
        permission.father = node.father;
        permission.task = node.task; 
        this.$store.commit('selectPermission', permission);
        this.$router.push('/user');
      },
    }
  }
</script>

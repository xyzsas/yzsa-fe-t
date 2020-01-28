<template>
  <div>
    <table>
      <tr>
        <td><b>ID：</b></td>
        <td>{{ $store.state.currentTask.id }}</td>
      </tr>
      <tr>
        <td><b>标题：</b></td>
        <td>{{ $store.state.currentTask.title }}</td>
      </tr>
      <tr>
        <td><b>类型：</b></td>
        <td>{{ utils.task.type[$store.state.currentTask.type] }}</td>
      </tr>
    </table>
    <a-divider />

    <template v-if="$store.state.currentTask.info">
      展示方式：
      <a-select @change="changeMode" v-model="mode" style="margin: 10px;">
        <a-select-option value="view">树形</a-select-option>
        <a-select-option value="preview">文本</a-select-option>
      </a-select>
      <div ref="jsonEditor"></div>
    </template>
    <b v-else>暂无任务信息，请到编辑任务页面添加任务信息</b>

  </div>
</template>

<script>

  import utils from '../../utils'

  export default {
    data() {
      return {
        utils,
        editor: null,
        mode: 'view',
        data: {}
      }
    },
    mounted() {
      this.$axios.get(`/api/T/task/${this.$store.state.currentTask.id}`)
        .then(res => {
          let len = Object.keys(res.data.info).length;
          if (len > 0) {
            this.$store.state.currentTask.info = res.data.info;
          }
          else this.$store.state.currentTask.info = null;
        })
        .then( () => {
          if(this.$store.state.currentTask.info) {
            let container = this.$refs.jsonEditor;
            this.editor = new JSONEditor(container);
            this.editor.set(this.$store.state.currentTask.info);
            this.editor.setMode('view');
            this.editor.expandAll();
          }
        });
    },
    methods: {
      changeMode: function() {
        this.editor.setMode(this.mode);
      }
    }
  }
</script>

<style scoped>

</style>

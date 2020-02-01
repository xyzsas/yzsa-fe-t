<template>
  <div>
    <table style="table-layout: fixed;">
      <tr style="height: 40px;">
        <td><b>ID：</b></td>
        <td>{{ $store.state.currentTask.id }}</td>
      </tr>
      <tr style="height: 40px;">
        <td><b>标题：</b></td>
        <td>{{ $store.state.currentTask.title }}</td>
      </tr>
      <tr style="height: 40px;">
        <td><b>类型：</b></td>
        <td>{{ utils.task.type[$store.state.currentTask.type] }}</td>
      </tr>
      <tr style="height: 40px;">
        <td><b>信息：</b></td>
        <td>
          <a-select @change="changeMode" v-model="mode">
            <a-select-option value="view">树形</a-select-option>
            <a-select-option value="preview">文本</a-select-option>
          </a-select>
        </td>
      </tr>
    </table>

    <div v-show="loading" style="text-align: center;">
      <a-spin/>
    </div>
    <div v-show="!loading">
      <div ref="jsonEditor"></div>
    </div>
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
        loading: true
      }
    },
    mounted() {
      this.$axios.get(`/api/T/task/${this.$store.state.currentTask.id}`)
        .then(res => {
          this.$store.state.currentTask = res.data;
          let len = Object.keys(res.data.info).length;
          if (len === 0) {
            this.$store.state.currentTask.info = {};
          }
          this.loading = false;
          if(this.$store.state.currentTask.info) {
            let container = this.$refs.jsonEditor;
            this.editor = new JSONEditor(container);
            this.editor.set(this.$store.state.currentTask.info);
            this.editor.setMode('view');
            this.editor.expandAll();
          }
        })
        .catch(err => {
          this.$router.push('/tasks');
        })
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

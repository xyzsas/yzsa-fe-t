<template>
  <div>
    <div style="display: inline-flex; width: 100%; justify-content: space-between;">
      <h1>编辑任务</h1>
      <a-button @click="deleteTask()">删除任务</a-button>
    </div>
    <p>包含任务修改，删除任务</p>
    <table>
      <tr>
        <td><b>id：</b></td>
        <td>{{task.id}}</td>
      </tr>
      <tr>
        <td><b>标题：</b></td>
        <td><a-input style="margin-bottom: 16px;" placeholder="任务标题" v-model="task.title"></a-input></td>
      </tr>
      <tr>
        <td><b>类型：</b></td>
        <td>
          <a-select v-model="task.type" style="width: 300px;">
            <a-select-option v-for="(v, k) in taskType" :key="k" :value="k">{{ v }}</a-select-option>
          </a-select>
        </td>
      </tr>
    </table>
    <a-divider />

    展示方式：
    <a-select @change="changeMode" v-model="mode" style="margin: 10px;">
      <a-select-option value="view">树形</a-select-option>
      <a-select-option value="preview">文本</a-select-option>
    </a-select>
    <div ref="jsonEditor"></div>

  </div>
</template>

<script>

  import { Modal } from 'ant-design-vue';
  import utils from '../../utils'

  export default {
    data() {
      return {
        utils: utils,
        editor: null,
        mode: 'view',
        taskType: utils.task.type,
        task: {
          id: this.$store.state.currentTask.id,
          type: this.$store.state.currentTask.type,
          title: this.$store.state.currentTask.title,
          info: this.$store.state.currentTask.info
        }
      }
    },
    mounted() {
      let container = this.$refs.jsonEditor;
      this.editor = new JSONEditor(container);
      this.editor.set(this.task.info);
      this.editor.setMode('view');
      this.editor.expandAll();
    },
    methods: {
      changeMode: function() {
        this.editor.setMode(this.mode);
      },
      deleteTask: function() {
        this.$axios.delete(`/api/T/task/${this.task.id}`)
          .then(res => {
            Modal.success({
              title: '成功',
              content: '任务删除成功',
              onOk:() => { this.utils.general.Jump("/task/"); },
            })
          })
          .catch(err => {
          })
      }
    }
  }
</script>

<style scoped>

</style>

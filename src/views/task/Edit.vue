<template>
  <div>
    <div style="display: inline-flex; width: 100%; justify-content: space-between;">
      <h1>编辑任务</h1>
      <a-button @click="deleteTask()">删除任务</a-button>
    </div>
    <table>
      <tr>
        <td><b>ID：</b></td>
        <td>{{task.id}}</td>
      </tr>
      <tr>
        <td><b>标题：</b></td>
        <td><a-input style="margin-bottom: 16px; margin-top: 16px;" placeholder="任务标题" v-model="task.title"></a-input></td>
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
    <div style="display: inline-flex; width: 100%; justify-content: space-between;">
      <div> 展示方式：
        <a-select @change="changeMode" v-model="mode" style="margin: 10px;">
          <a-select-option value="view">树形</a-select-option>
          <a-select-option value="preview">文本</a-select-option>
        </a-select>
      </div>
      <a-button @click="edit()" style="top: 10px;">{{editMode}}</a-button>
    </div>
    <div ref="jsonEditor" style="height: 32vh;"></div>

    <a-button @click="updateTask()" style="top: 20px;">确认修改</a-button>
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
        editMode: '编辑',
        mode: 'view',
        sample: "",
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
      if (this.task.info) this.editor.set(this.task.info);
      else {
        this.sample = {
          "样例" : {
            "标题" : "内容",
            "更多": {"继续" : "内容"},
            "按照例子" : "完成"
          },
          "如果内容为空" : "请删除全部并输入null",
          "使用前请删除此例子":"谢谢"
        }
        this.editor.set(this.sample);
      }
      this.editor.setMode('view');
      this.editor.expandAll();
    },
    methods: {
      changeMode: function() {
        this.editor.setMode(this.mode);
      },
      edit: function() {
        if (this.editMode === '编辑') {
          this.editor.setMode('code');
          this.editMode = '取消';
        } else {
          this.editMode = '编辑';
          this.editor.setMode('view');
        }
      },
      deleteTask: function() {
        this.$axios.delete(`/api/T/task/${this.task.id}`)
          .then(res => {
            Modal.success({
              title: '成功',
              content: '任务删除成功',
              onOk:() => { this.utils.general.Jump("/tasks/"); },
            })
          })
          .catch(err => {
            Modal.error({
              title: "失败",
              content: err.response.data,
              onOk: () => { this.utils.general.Jump("/tasks/"); }
            })
          })
      },
      updateTask: function() {
        let content = this.editor.get();
        if (!content) this.task.info = {};
        else this.task.info = this.editor.get();
        this.$store.state.currentTask.info = this.task.info 
        this.$axios.put(`/api/T/task/${this.task.id}`, {
          'title': this.task.title,
          'type': this.task.type,
          'info': this.task.info 
        })
        .then(res => {
          Modal.success({
            title: '成功',
            content: '任务修改成功',
            onOk:() => { 
              this.editMode = '编辑';
              this.editor.setMode('view');
            }
          })
        })
        .catch(err => { this.utils.general.catchError(); })
      }
    }
  }
</script>

<style scoped>

</style>

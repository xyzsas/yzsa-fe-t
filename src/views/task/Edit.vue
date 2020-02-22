<template>
  <div>
    <table style="table-layout: fixed;">
      <tr style="height: 40px;">
        <td><b>ID：</b></td>
        <td><div>{{ task.id }}</div></td>
      </tr>
      <tr style="height: 40px;">
        <td><b>标题：</b></td>
        <td><a-input placeholder="任务标题" v-model="task.title"></a-input></td>
      </tr>
      <tr style="height: 40px;">
        <td><b>类型：</b></td>
        <td>
          <a-select v-model="task.type" style="width: 300px;">
            <a-select-option v-for="(v, k) in taskType" :key="k" :value="k">{{ v }}</a-select-option>
          </a-select>
        </td>
      </tr>
      <tr style="height: 40px;">
        <td><b>信息：</b></td>
        <td>
          <a-select @change="changeMode" v-model="mode">
            <a-select-option value="tree">树形</a-select-option>
            <a-select-option value="code">文本</a-select-option>
          </a-select>
          <a-button @click="openInfoGenerator" style="margin-left: 16px;">信息生成工具</a-button>
        </td>
      </tr>
    </table>
    <div ref="jsonEditor" style="height: 400px;"></div>
    <a-button @click="updateTask()" style="margin-top: 16px; width: 200px;" type="primary" :loading="loading">提交修改</a-button>
    <br>
    <a-button @click="deleteTask()" style="margin-top: 16px; width: 200px;" type="danger">删除任务</a-button>

    <a-modal
      title="信息生成工具"
      v-model="modalVisible"
      @ok="generateInfo"
      okText="生成"
      cancelText="取消"
    >
      <component ref="generator" :is="generator"></component>
    </a-modal>

  </div>
</template>

<script>
  import { Modal } from 'ant-design-vue';
  import utils from '../../utils'

  export default {
    data() {
      return {
        editor: null,
        mode: 'code',
        taskType: utils.task.type,
        task: {
          id: this.$store.state.currentTask.id,
          title: this.$store.state.currentTask.title,
          type: this.$store.state.currentTask.type,
          info: this.$store.state.currentTask.info,
          start: this.$store.state.currentTask.start,
          end: this.$store.state.currentTask.end
        },
        loading: false,

        modalVisible: false,

        generator: utils.task.infoGenerator[this.$store.state.currentTask.type]
      }
    },
    mounted() {
      let container = this.$refs.jsonEditor;
      this.editor = new JSONEditor(container);
      this.editor.set(this.task.info);
      this.editor.setMode('code');
    },
    methods: {
      openInfoGenerator() {
        let content = this.editor.get();
        if (!content) {
          this.task.info = {};
        } else {
          this.task.info = content;
        }
        this.modalVisible = true;
        this.$nextTick(() => {
          this.$refs.generator.setInfo(this.task.info);
        });
      },
      generateInfo() {
        this.task.info = this.$refs.generator.getInfo();
        this.editor.set(this.task.info);
        this.$nextTick(() => {
          this.modalVisible = false;
        });
      },
      changeMode: function() {
        this.editor.setMode(this.mode);
        if(this.mode === 'tree') {
          this.editor.expandAll();
        }
      },
      deleteTask: function() {
        let that = this;
        Modal.confirm({
          title: '确认危险操作',
          content: '确定删除任务？该操作不可逆！',
          okText: '确认',
          okType: 'danger',
          cancelText: '取消',
          onOk() {
            return new Promise(resolve => {
              that.$axios.delete(`/api/T/task/${that.task.id}`)
                .then(res => {
                  Modal.success({
                    title: '成功',
                    content: '任务删除成功'
                  });
                  that.$router.push('/tasks');
                  resolve();
                })
                .catch(err => {
                  that.$router.push('/task');
                  resolve();
                })
            });
          }
        });
      },
      updateTask: function() {
        this.loading = true;
        let content = this.editor.get();
        if (!content) {
          this.task.info = {};
        } else {
          this.task.info = content;
        }
        this.$store.state.currentTask = this.task;
        this.$axios.put(`/api/T/task/${this.task.id}`, {
          'title': this.task.title,
          'type': this.task.type,
          'info': this.task.info
        })
          .then(() => {
            this.$router.push('/task');
            Modal.success({
              title: '成功',
              content: '任务修改成功'
            });
          })
          .catch(() => {
            this.$router.push('/task');
          })
      }
    }
  }
</script>

<style scoped>

</style>

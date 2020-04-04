<template>
  <div>
    <div v-if="has">
      <a-button style="margin-bottom: 16px;" type="primary" size="large" :loading="downloadLoading" @click="downloadData"><span><a-icon type="download" />下载原始数据</span></a-button>
      <br>
      <a-button v-if="!advanceOpt" @click="advanceOpt = true"><span><a-icon type="experiment" />高级功能</span></a-button>
      <a-card title="高级功能" style="width: 700px;" v-if="advanceOpt">
        <p>
          JavaScript 数据处理函数
          <br>
          函数格式：function(x){}
          <br>
          输入：原始数据对象数组
          <br>
          输出：含有 data keys 两个成员的对象，keys 可省。data 为对象数组，keys 为表头字符串数组
          <br>
          若 keys 省略，请保证 data 中每个对象的结构相同。省略即 undefined
        </p>
        <a-textarea placeholder="function" autoSize style="margin-bottom: 16px;" v-model="func"/>
        <a-button @click="runFunc" :loading="runLoading"><span><a-icon type="play-circle" />运行并下载</span></a-button>
      </a-card>
    </div>
    <div v-else>
      <a-button type="primary" size="large" :loading="dataLoading" @click="pullData"><span><a-icon type="database" />加载任务记录</span></a-button>
    </div>
  </div>
</template>


<script>
  import { Modal } from 'ant-design-vue';
  import utils from '../../utils'

  export default {
    data() {
      return {
        has: false,
        dataLoading: false,
        downloadLoading: false,
        runLoading: false,
        advanceOpt: false,

        srcData: [],
        keys: ['id', 'name', 'role', 'permission'],

        taskId: this.$store.state.currentTask.id,
        taskTitle: this.$store.state.currentTask.title,

        func: `function(data) { return { data: data, keys: ['id', 'name']} }`
      }
    },
    methods: {
      async pullData() {
        this.dataLoading = true;
        let records, users;
        let error = false;
        await this.$axios.get(`/api/T/record/${this.taskId}`)
          .then(res => {
            records = res.data;
          })
          .catch(err => {
            this.loading = false;
            error = true;
          });
        if(error) {
          return;
        }

        if(Object.keys(records).length === 0) {
          Modal.info({
            title: '提示',
            content: '目前没有任务信息'
          });
          this.dataLoading = false;
          return;
        }

        await this.$axios.get(`/api/T/task/${this.taskId}/user`)
          .then(res => {
            users = res.data;
          })
          .catch(err => {
            this.loading = false;
            error = true;
          });
        if(error) {
          return;
        }

        this.keys = this.keys.concat(Object.keys(records[Object.keys(records)[0]]));

        for(let i = 0; i < users.length; i++) {
          Object.assign(users[i], records[users[i].id]);
        }
        this.srcData = users;

        this.dataLoading = false;
        this.has = true;
      },
      downloadData() {
        this.downloadLoading = true;
        utils.file.downloadText(`${this.taskTitle} - ${this.taskId}.csv`, utils.file.dumpCSV(this.srcData, this.keys));
        this.downloadLoading = false;
      },
      runFunc() {
        this.runLoading = true;
        let f = new Function('return ' + this.func)();
        let res = f(this.srcData);
        if (res) utils.file.downloadText('result.csv', utils.file.dumpCSV(res.data, res.keys));
        this.runLoading = false;
      }
    }
  }
</script>

<style scoped>

</style>

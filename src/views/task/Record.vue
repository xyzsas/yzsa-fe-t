<template>
  <div>
    <a-button type="primary" size="large" :loading="loading" @click="download"><span><a-icon type="download" />下载任务记录</span></a-button>
  </div>
</template>


<script>
  import { Modal } from 'ant-design-vue';
  import FileSaver from 'file-saver';

  export default {
    data() {
      return {
        loading: false,
      }
    },
    methods: {
      async download() {

        let task = this.$store.state.currentTask.id;
        let title = this.$store.state.currentTask.title;
        let records = {};
        let users = [];
        let keys = [];
        let csv = 'id,name,role,permission,';

        let error = false;

        this.loading = true;
        await this.$axios.get(`/api/T/record/${task}`)
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
          this.loading = false;
          return
        }
        keys = Object.keys(records[Object.keys(records)[0]]);
        await this.$axios.get(`/api/T/task/${task}/user`)
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

        csv += keys.join(',') + '\n';
        for(let i in users) {
          let u = users[i];
          csv += `${u.id},${u.name},${u.role},${u.permission}`;
          for(let j in keys) {
            let k = keys[j];
            csv += `,${records[u.id] ? (records[u.id][k] ? records[u.id][k] : '') : ''}`
          }
          csv += '\n'
        }
        csv = '\ufeff' + csv;
        let blob = new Blob([csv], {type: 'text/plain;charset=utf-8'});
        FileSaver.saveAs(blob, title + task + '.csv');
        this.loading = false;
      }
    }
  }
</script>

<style scoped>

</style>

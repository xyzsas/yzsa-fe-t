<template>
  <a-layout style="margin-left: auto; margin-right: auto; min-width: 1056px;">
    <div style="background: #ffffff; margin: 16px 16px 0 16px; padding: 8px; font-size: 1.5em; max-width: 1024px;">
      {{ $store.state.pageTitle }}
    </div>
    <a-layout-content style="min-height: calc(100vh - 192px); padding: 16px;">
      <div style="background: #ffffff; padding: 16px; min-height: calc(100vh - 192px); max-width: 1024px;">

        <a-button type="dashed" block @click="openModal" style="margin-bottom: 16px;"><a-icon type="plus" />新建任务</a-button>

        <template v-if="loading">
          <div style="text-align: center"><a-spin /></div>
        </template>
        <template v-else>
          <div
            v-for="item in list"
            :key="item.id"
            style="
              text-align: center;
              border: 1px solid #ebedf0;
              border-radius: 2px;
              height: 48px;
              line-height: 48px;
              margin-bottom: 16px;
            "
          >
            <a-row>
              <a-col :span="5"><span>{{ item.id }}</span></a-col>
              <a-col :span="5"><span style="font-size: 1.4em;">{{ item.title }}</span></a-col>
              <a-col :span="5">
                <span :style="{color: item.start === 0 ? '#f5222d' : '#52c41a'}">
                  {{ item.start === 0 ? '未运行' : '运行中' }}
                </span>
              </a-col>
              <a-col :span="5">
                <div style="line-height: 24px" v-if="item.start !== 0">
                  从 {{ item.start | timeFormat }}
                  <br>
                  至 {{ item.end | timeFormat }}
                </div>
              </a-col>
              <a-col :span="4">
                <a-button @click="showDetails(item)">查看详情</a-button>
              </a-col>
            </a-row>
          </div>
        </template>

      </div>
    </a-layout-content>
    <a-layout-footer style="padding: 0; height: 32px; line-height: 32px; text-align: center;">
      YZSA © 2020 ITI
    </a-layout-footer>

    <a-modal
      title="新建任务"
      v-model="modalStat.visible"
      :confirm-loading="modalStat.loading"
      @ok="createTask"
      okText="确认"
      cancelText="取消"
    >
      <span>任务名称：</span>
      <a-input placeholder="任务名称" v-model="newTask.title" style="width: 300px; margin-bottom: 16px;"></a-input>
      <br>
      <span>任务类型：</span>
      <a-select defaultValue="notice" v-model="newTask.type" style="width: 300px;">
        <a-select-option v-for="(v, k) in taskType" :key="k" :value="k">{{ v }}</a-select-option>
      </a-select>
    </a-modal>

  </a-layout>
</template>

<script>
  import { Modal } from 'ant-design-vue';
  import utils from '../utils'

  export default {
    data() {
      return {
        list: [],
        loading: true,
        taskType: utils.task.type,
        newTask: {
          title: '',
          type: ''
        },
        modalStat: {
          visible: false,
          loading: false
        }
      }
    },
    mounted() {
      this.getList();
    },
    methods: {
      getList() {
        this.loading = true;
        this.axios.get('/api/T/task')
          .then(res => {
            this.list = res.data;
            this.loading = false;
          })
      },
      openModal() {
        this.newTask.type = '';
        this.newTask.title = '';
        this.modalStat.visible = true;
      },
      createTask() {
        this.modalStat.loading = true;
        if(this.newTask.title === '' || !this.taskType[this.newTask.type]) {
          Modal.error({
            title: '失败',
            content: '标题或类型不能为空'
          });
          this.modalStat.loading = false;
          this.modalStat.visible = false;
          return
        }
        this.$axios.post('/api/T/task', {
          'title': this.newTask.title,
          'type': this.newTask.type,
          'info': {}
        })
          .then(res => {
            Modal.success({
              title: '成功',
              content: '新建任务成功'
            });
            this.modalStat.loading = false;
            this.modalStat.visible = false;
            this.getList();
          })
          .catch(err => {
            this.modalStat.loading = false;
            this.modalStat.visible = false;
          })
      },
      showDetails(task) {
        this.$store.commit('selectTask', task);
        this.$router.push('/task');
      }
    },
    filters: {
      timeFormat: function (value) {
        return utils.time.formatTime(value);
      }
    }
  }
</script>

<template>
  <div>
    <h3 style="margin-bottom: 24px;">
      运行状态：
      <span :style="{color: running ? '#52c41a' : '#f5222d' }">
        {{ running ? '运行中' : '未运行' }}
      </span>
    </h3>
    <template v-if="running">
      <template v-if="ticker.stat">
        <a-card title="实时监控"  style="margin-bottom: 16px;">
          <h2>任务进度</h2>
          <a-progress :percent="timePercent" :showInfo="false" status="active" :strokeWidth="10"/>
          <div>
            <div style="float: left;">{{ task.start | timeFormat }}</div>
            <div style="float: right;">{{ task.end | timeFormat }}</div>
            <div style="clear: both;"></div>
          </div>
          <a-divider />
          <h2>已完成任务人数：{{ runtimeData.count }}</h2>
          <a-divider />
          <h2>
            实时信息
            <a-select @change="changeMode" v-model="mode">
              <a-select-option value="view">树形</a-select-option>
              <a-select-option value="preview">文本</a-select-option>
            </a-select>
          </h2>
          <div ref="jsonEditor"></div>
        </a-card>
        <a-button type="danger" style="width: 200px; margin-bottom: 16px;" :loading="ticker.closing" @click="ticker.closing = true">关闭实时监控</a-button>
      </template>
      <a-button v-else type="primary" style="width: 200px; margin-bottom: 16px;" @click="startTicker">开始实时监控</a-button>
      <br>
      <a-button @click="modalAddTemp.visible = true" style="margin-bottom: 16px; width: 200px;">添加临时权限</a-button>
      <br>
      <a-button @click="modalDeleteTemp.visible = true" style="margin-bottom: 16px; width: 200px;">删除临时权限</a-button>
      <br>
      <a-button @click="close" type="danger" style="width: 200px;">关闭任务</a-button>
    </template>
    <template v-else>
      <a-button @click="modalOpen.visible = true" type="primary" style="width: 200px;">开启任务</a-button>
    </template>

    <a-modal
      title="开启任务"
      v-model="modalOpen.visible"
      :confirm-loading="modalOpen.loading"
      @ok="open"
      okText="确认"
      cancelText="取消"
    >
      <span>开始时间：</span>
      <date-time ref="start" :key="'start'" style="margin-bottom: 16px;"></date-time>
      <span>结束时间：</span>
      <date-time ref="end" :key="'end'"></date-time>
    </a-modal>

    <a-modal
      title="添加临时权限"
      v-model="modalAddTemp.visible"
      :confirm-loading="modalAddTemp.loading"
      @ok="addTemp"
      okText="确认"
      cancelText="取消"
    >
      <a-input placeholder="用户ID" v-model="userId" style="margin-bottom: 16px;"></a-input>
      <br>
      <a-time-picker placeholder="权限有效时长(时:分:秒)" style="width: 200px;" @change="onDurationChange"></a-time-picker>
    </a-modal>

    <a-modal
      title="删除临时权限"
      v-model="modalDeleteTemp.visible"
      :confirm-loading="modalDeleteTemp.loading"
      @ok="deleteTemp"
      okText="确认"
      cancelText="取消"
    >
      <a-input placeholder="用户ID" v-model="userId" style="margin-bottom: 16px;"></a-input>
    </a-modal>

  </div>
</template>

<script>

  import { Modal } from 'ant-design-vue';
  import DateTime from "../../components/DateTime";
  import utils from '../../utils'

  const sleep = (timeoutMS) => new Promise((resolve) => {
    setTimeout(resolve, timeoutMS);
  });

  export default {
    components: {
      DateTime
    },
    data() {
      return {
        task: this.$store.state.currentTask,
        running: false,

        ticker: {
          stat: false,
          closing: false
        },

        modalOpen: {
          visible: false,
          loading: false
        },
        modalAddTemp: {
          visible: false,
          loading: false
        },
        modalDeleteTemp: {
          visible: false,
          loading: false
        },

        userId: '',
        duration: 0,

        timePercent: 0,
        runtimeData: {},

        mode: 'view',
        editor: null,
      }
    },
    mounted() {
      this.running = this.task.start !== 0;
    },
    methods: {
      async startTicker() {
        this.ticker.stat = true;

        await this.$nextTick();

        let container = this.$refs.jsonEditor;
        this.editor = new JSONEditor(container);
        this.editor.set(this.runtimeData.realTime);
        this.editor.setMode('view');
        this.editor.expandAll();

        this.tickerLoop();
      },
      async tickerLoop() {
        while(true) {
          if(this.ticker.closing) {
            this.ticker.stat = false;
            this.ticker.closing = false;
            break;
          }
          let currentTime = Math.floor(new Date().getTime() / 1000);
          if(currentTime < this.task.start) {
            this.timePercent = 0;
          } else if(currentTime > this.task.end) {
            this.timePercent = 100;
          } else {
            this.timePercent = (currentTime - this.task.start) / (this.task.end - this.task.start) * 100;
          }
          await this.$axios.get(`/api/T/task/${this.task.id}/runtime`)
            .then(res => {
              this.runtimeData = res.data;
              this.editor.set(this.runtimeData.realTime);
            })
            .catch(err => {
              this.ticker.closing = true;
            });
          await sleep(1000);
        }
      },
      changeMode() {
        this.editor.setMode(this.mode);
      },
      open() {
        this.modalOpen.loading = true;
        let start = this.$refs.start.getTimeStamp();
        let end = this.$refs.end.getTimeStamp();
        if(isNaN(start) || isNaN(end)) {
          Modal.error({
            title: '错误',
            content: '起止时间输入有误'
          });
          this.modalOpen.loading = false;
          this.modalOpen.visible = false;
          return;
        }
        this.$axios.put(`/api/T/task/${this.task.id}/open`, {
          'start': start,
          'end': end
        })
          .then(res => {
            Modal.success({
              title: '成功',
              content: '任务开启成功'
            });
            this.$router.push('/task');
          })
          .catch(err => {
            this.$router.push('/task');
          })
      },
      close() {
        let that = this;
        Modal.confirm({
          title: '确认危险操作',
          content: '确定关闭任务？运行时将无法找回！',
          okText: '确认',
          okType: 'danger',
          cancelText: '取消',
          onOk() {
            return new Promise(resolve => {
              that.$axios.put(`/api/T/task/${that.task.id}/close`)
                .then(res => {
                  Modal.success({
                    title: '成功',
                    content: '任务关闭成功'
                  });
                  that.$router.push('/task');
                  resolve();
                })
                .catch(err => {
                  that.$router.push('/task');
                  resolve();
                })
            });
          }
        })
      },
      onDurationChange(time, timeString) {
        let b = new Date('1970-1-1 0:0:0').getTime();
        let e = new Date('1970-1-1 ' + timeString).getTime();
        this.duration = Math.floor((e - b) / 1000);
      },
      addTemp() {
        this.modalAddTemp.loading = true;
        if(this.userId === '') {
          Modal.error({
            title: '错误',
            content: '用户ID不可为空'
          });
          this.modalAddTemp.loading = false;
          this.modalAddTemp.visible = false;
          return
        }
        if(this.duration === 0) {
          Modal.error({
            title: '错误',
            content: '有效期不可为空'
          });
          this.modalAddTemp.loading = false;
          this.modalAddTemp.visible = false;
          return
        }
        this.$axios.post(`/api/T/permission/${this.task.id}`, {
          'user': this.userId,
          'expiration': this.duration
        })
          .then(res => {
            Modal.success({
              title: '成功',
              content: '用户临时权限添加成功'
            });
            this.modalAddTemp.loading = false;
            this.modalAddTemp.visible = false;
          })
          .catch(err => {
            this.modalAddTemp.loading = false;
            this.modalAddTemp.visible = false;
          })
      },
      deleteTemp() {
        this.modalDeleteTemp.loading = true;
        if(this.userId === '') {
          Modal.error({
            title: '错误',
            content: '用户ID不可为空'
          });
          this.modalDeleteTemp.loading = false;
          this.modalDeleteTemp.visible = false;
          return
        }
        this.$axios.delete(`/api/T/permission/${this.task.id}/${this.userId}`)
          .then(res => {
            Modal.success({
              title: '成功',
              content: '用户临时权限删除成功'
            });
            this.modalDeleteTemp.loading = false;
            this.modalDeleteTemp.visible = false;
          })
          .catch(err => {
            this.modalDeleteTemp.loading = false;
            this.modalDeleteTemp.visible = false;
          })
      }
    },
    filters: {
      timeFormat: function (value) {
        return utils.time.formatTime(value);
      }
    }
  }
</script>

<style scoped>

</style>

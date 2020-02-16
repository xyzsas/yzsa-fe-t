<template>
  <div>
    <template v-if="uploaded">
      <a-progress :percent="100 * now / tot" status="active" :showInfo="false" :strokeWidth="12"/>
      <span>{{ now }} / {{ tot }}</span>
      <div style="margin-top: 16px; background-color: #f0f2f5; padding: 16px; height: 360px; overflow-y:scroll; overflow-x:scroll;">
        <ul style="list-style-type: none; padding: 0;">
          <li v-for="(item, index) in log" :key="index" :style="{color: logColor[item.type]}">{{ item.message }}</li>
        </ul>
      </div>
      <a-button v-if="now === tot" type="primary" @click="reset" style="margin-top: 16px;"><a-icon type="left" />返回</a-button>
    </template>
    <template v-else>
      <p>上传<b>UTF-8</b>编码，<b>csv</b>格式的电子表格，<b>不超过512KB</b>。</p>
      <p>每行为一个用户的信息，每列<b>分别</b>为ID(身份证)、姓名、角色、权限节点ID。<b>请不要添加表头。</b></p>
      <p style="color: #f5222d;"><b>请务必保证表格格式正确，否则可能会造成意料之外的错误！</b></p>
      <a-button type="primary" size="large" @click="onOpen" :loading="loading"><a-icon type="upload" />上传</a-button>
      <input type="file" id="file" accept=".csv" @change="onUpload" style="display: none;"/>
    </template>
  </div>
</template>

<script>
  const logColor = {
    'info': '#545456',
    'error': '#f5222d',
    'success': '#52c41a'
  };

  export default {
    data() {
      return {
        logColor,

        uploaded: false,
        loading: false,

        csv: '',

        now: 0,
        tot: 1,
        log: [
          {
            message: '开始上传用户',
            type: 'info'
          }
        ]
      }
    },
    methods: {
      reset() {
        this.uploaded = false;
        this.now = 0;
        this.tot = 1;
        this.log = [
          {
            message: '开始上传用户',
            type: 'info'
          }
        ];
      },
      onOpen() {
        document.getElementById("file").click();
      },
      onUpload: function (e) {
        this.loading = true;
        let file = e.target.files[0];
        let reader = new FileReader();
        reader.readAsText(file, 'utf-8');
        reader.onload = (e) => {
          this.loading = false;
          this.csv = e.target.result;
          this.uploaded = true;
          this.submit();
        };
      },
      async submit() {
        let rows = this.csv.split('\r\n');
        if(rows.length === 1) {
          rows = this.csv.split('\n');
        }
        this.tot = rows.length;
        if(rows[this.tot - 1] === '') {
          this.tot--;
        }
        for(let i = 0; i < this.tot; i++) {
          let col = rows[i].split(',');
          if(col.length !== 4) {
            this.log.push({
              message: `行${i + 1}：参数错误`,
              type: 'error'
            });
            this.now++;
            continue;
          }

          await this.$axios({
            url: '/api/A/user',
            method: 'post',
            data: {
              id: col[0],
              name: col[1],
              role: col[2],
              permission: col[3]
            },
            validateStatus(code) {
              return true;
            }
          })
            .then(res => {
              if(res.status !== 200) {
                this.log.push({
                  message: `行${i + 1}：${res.data}`,
                  type: 'error'
                });
              }
            });
          this.now++;
        }
        this.log.push({
          message: '完成',
          type: 'success'
        });
      }
    }
  }
</script>

<style scoped>

</style>

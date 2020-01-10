<template>
  <div>
    <a-input-group style="width: 360px">
      <a-input placeholder="原密码" v-model="oldPwd" style="margin-bottom: 16px;" type="password">
        <a-icon slot="prefix" type="unlock" />
      </a-input>
      <a-input placeholder="新密码" v-model="newPwd" style="margin-bottom: 16px;" type="password">
        <a-icon slot="prefix" type="lock" />
      </a-input>
      <a-input placeholder="确认密码" v-model="cfmPwd" style="margin-bottom: 16px;" type="password">
        <a-icon slot="prefix" type="lock" />
      </a-input>
      <a-button type="primary" style="width: 100%" @click="onSubmit">确认</a-button>
    </a-input-group>
  </div>
</template>

<script>
  import { Modal } from 'ant-design-vue'
  import utils from '../../utils'
  export default {
    data() {
      return {
        oldPwd: '',
        newPwd: '',
        cfmPwd: ''
      }
    },
    methods: {
      onSubmit() {
        if(this.newPwd !== this.cfmPwd) {
          Modal.error({
            title: "失败",
            content: "两次输入密码不一致"
          });
          return;
        }
        this.$axios.put("/api/U/pwd", {
          "oldPwd": this.oldPwd,
          "newPwd": this.newPwd
        })
          .then(() => {
            Modal.success({
              title: "成功",
              content: "密码修改成功，请重新登陆",
              onOk() {
                utils.general.logout();
              }
            });
          })
      }
    }
  }
</script>

<style scoped>

</style>

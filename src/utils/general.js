// 全局工具
import { Modal } from 'ant-design-vue';

export default {
  // 弹框提示 axios 请求错误
  catchError: function (error) {
    Modal.error({
      title: "失败",
      content: error.response.data,
      onOk: () => {
        if(error.response.status === 401) {
          // 身份验证错误
          this.logout();
        } else {
          // 跳回主页面
          this.Jump('/tasks/');
        }
      }
    })
  },
  // 登出
  logout: function () {
    window.axios.delete('/api/C/auth')
      .then(() => {
        delete window.sessionStorage["name"];
        delete window.sessionStorage["id"];
        delete window.sessionStorage["token"];
        this.Jump('/');
      });
  },
  // 跳转
  Jump: function (url) {
     window.location.href = url;
  }
}


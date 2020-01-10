import { Modal } from 'ant-design-vue';

export default {
  catchError: function (error) {
    Modal.error({
      title: "失败",
      content: error.response.data
    });
    if(error.response.status === 401) {
      this.logout();
    }
  },
  logout: function () {
    window.axios.delete('/api/C/auth')
      .then(() => {
        delete window.sessionStorage["name"];
        delete window.sessionStorage["id"];
        delete window.sessionStorage["token"];
        window.location.href = '/';
      });
  }
}

/* eslint-disable */
import Hashes from './hashes.min'

const SALT = 'Supported_by_ITI';


export default {
  HASH: function (msg, salt) {
    let a = new Hashes.SHA256().hex(msg + salt);
    return new Hashes.MD5().hex(a + salt);
  },
  Sleep: function (ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  },
  login: async function (username, password) {
    let random;
    await axios.get("http://localhost:5000/api/C/auth?id=" + username)
      .then(resp => {
        random = resp.data;
        console.log(resp);
      })
      .catch((err) => {
        console.log(err);
      });
    await axios.post("http://localhost:5000/api/C/auth", {
      id: username,
      token: random,
      password: this.HASH(this.HASH(password, SALT), random)
    })
      .then(resp => {
        window.sessionStorage["name"] = resp.data.name;
        window.sessionStorage["id"] = resp.data.id;
        window.sessionStorage["role"] = resp.data.role;
        console.log(resp);
      })
      .catch(err => {
        console.log(err.response);
      })
  }
}

<template>
  <div>
    <h1>用户列表</h1>
    <a-button v-if="permission.id !== 'admin'"type="dashed" block @click="openModal('new')" style="margin-bottom: 16px;"><a-icon type="plus" />添加用户</a-button>
    <template>
    	<div style="height: 56vh;">
    		<div
        v-for="(item, index) in list"
        v-if="index >= totRows * (page.curr - 1) && index < totRows * page.curr"
        :key="item.id"
        style="
          text-align: center;
          border: 1px solid #ebedf0;
          border-radius: 2px;
          height: 48px;
          line-height: 48px;
          margin-bottom: 14px;
        "
      	> 
	        <a-row>
	          <a-col :span="6"><span style="font-size: 1.4em;">{{ item.name }}</span></a-col>
	          <a-col :span="6">
	            <a-button @click="openModal('info', item)">修改信息</a-button>
	          </a-col>
	          <a-col :span="6">
	            <a-button @click="openModal('pwd', item)">修改密码</a-button>
	          </a-col>
	          <a-col :span="6">
	            <a-button disabled v-if="permission.id === 'admin'" @click="removeUser(item)">删除</a-button>
	            <a-button v-else style="color: red; border-color: red"@click="removeUser(item)">删除</a-button>
	          </a-col>
	        </a-row>
	      </div>
    	</div>
    	<template>
	    	<a-pagination style="display: flex; justify-content: center; " simple v-model="page.curr" :defaultCurrent="1" :total="page.tot" :defaultPageSize="1"/>
    	</template>

    </template>
    <a-modal
      title="新增用户"
      v-model="modalStat.new.visible"
      :confirm-loading="modalStat.new.loading"
      @ok="createUser"
      okText="确认"
      cancelText="取消"
    >
    	<table>
      	<tr>
        	<td><b>用户ID：</b></td>
        	<td><a-input placeholder="用户ID" v-model="newUser.id" style="width: 300px; "/></td>
      	</tr>
      	<br/>
      	<tr>
        	<td><b>用户名：</b></td>
        	<td><a-input placeholder="用户名" v-model="newUser.name" style="width: 300px; "/></td>
      	</tr>
      	<br/>
      	<tr>
        	<td><b>职位：</b></td>
        	<td><a-input placeholder="职位" v-model="newUser.role" style="width: 300px; "/></td>
      	</tr>
    	</table>
    </a-modal>

    <a-modal
      title="修改密码"
      v-model="modalStat.pwd.visible"
      :confirm-loading="modalStat.pwd.loading"
      @ok="changePwd"
      okText="确认"
      cancelText="取消"
    >
    	<table>
      	<tr>
        	<td><b>原密码：</b></td>
        	<td><a-input type="password" placeholder="原密码" v-model="pwd.old" style="width: 300px; "/></td>
      	</tr>
      	<br/>
      	<tr>
        	<td><b>新密码：</b></td>
        	<td><a-input type="password" placeholder="新密码" v-model="pwd.new" style="width: 300px; "/></td>
      	</tr>
      	<br/>
      	<tr>
        	<td><b>确认密码：</b></td>
        	<td><a-input type="password" placeholder="确认密码" v-model="pwd.confirm" style="width: 300px; "/></td>
      	</tr>
    	</table>
    </a-modal>
    <a-modal
      title="修改个人信息"
      v-model="modalStat.info.visible"
      :confirm-loading="modalStat.info.loading"
      @ok="changeInfo"
      okText="确认"
      cancelText="取消"
    >
    	<table>
      	<tr>
        	<td><b>新名字：</b></td>
        	<td><a-input placeholder="新名字" v-model="currUser.name" style="width: 300px; "/></td>
      	</tr>
    	</table>
    </a-modal>
  </div>
</template>

<script>

	import { Modal } from 'ant-design-vue';
  import utils from '../../utils'

  export default {
  	data() {
  		return {
  			utils,
  			permission: this.$store.state.currentPermission,
  			list: [],
  			currUser: {},
  			page: {
  				curr: 1,
  				tot: 1
  			},
  			totRows: 7,
  			newUser: {
  				id: "",
  				name: "",
  				role: '',
  			},
  			modalStat: {
  				new: {
  					visible: false,
          	loading: false
  				},
          pwd: {
						visible: false,
          	loading: false
          }, 
          info: {
          	visible: false,
          	loading: false
          }
        },
        pwd: {
        	old: '',
        	new: '',
        	confirm: ''
        }
  		}
  	},
  	async mounted() {
  		await this.$axios.get(`/api/A/user`, {
  			params: {
  				'permission': this.permission.id
  			}
  		})
  			.then( res => {
  				res.data !== null? this.list = res.data : this.list = []
  			})
  		const vh = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
  		this.totRows = Math.round(0.54 * vh / 63)
  		this.page.tot = (Math.floor(this.list.length / this.totRows) + 1)
  		if (this.list.length === this.totRows * (this.page.tot - 1)) this.page.tot --;
  	},
  	created() {
		  window.addEventListener("resize", this.calRows);
		},
		destroyed() {
		  window.removeEventListener("resize", this.calRows);
		},
  	methods: {
  		openModal(which, user) {
  			if (which === 'new') {
  				this.newUser.id = '';
        	this.newUser.name = '';
        	this.newUser.role = '';
        	this.modalStat.new.visible = true;
  			} else if (which === 'pwd') {
  				this.pwd.old = '';
  				this.pwd.new = '';
  				this.pwd.confirm = '';
  				this.modalStat.pwd.visible = true;
  				this.currUser = user;
  			} else {
  				this.modalStat.info.visible = true;
  				this.currUser = user;
  			}
      },
      reloadUser() {
      	this.$axios.get(`/api/A/user`, {
  				params: {
  					'permission': this.permission.id
	  			}
	  		})
	  			.then( res => {
	  				res.data !== null? this.list = res.data : this.list = []
  					this.page.tot = (Math.floor(this.list.length / this.totRows) + 1)
  					if (this.list.length < this.totRows * (this.page.tot - 1)) this.page.tot --;
	  			})
  		},
      async createUser() {
      	this.modalStat.new.loading = true;
      	if (!this.newUser.name || !this.newUser.id || !this.newUser.role) {
      		Modal.error({
      			'title': '失败',
      			'content': '用户名或ID或职位不能为空'
      		})
      		this.modalStat.new.loading = false;
      		return;
      	}

      	await this.$axios.post(`/api/A/user`, {
						'id': this.newUser.id,
      			'name': this.newUser.name,
      			'role': this.newUser.role,
      			'permission': this.permission.id
      	})
      		.then(res => {
      			Modal.success({
        			'title': '成功',
        			'content': `成功添加用户${this.newUser.name}`,
        		})
        		this.modalStat.new.loading = false;
        		this.modalStat.new.visible = false;
      		})
      		.catch(err => {
      			this.modalStat.new.loading = false;
        		this.modalStat.new.visible = false;
      		})
				this.reloadUser();
      }, 
      changeInfo() {
      	this.modalStat.info.loading = true;
      	if (!this.currUser || !this.currUser.name) {
      		Modal.error({
      			'title': '失败',
      			'content': '用户不存在或新名字为空'
      		})
      		this.modalStat.info.loading = false;
      		return;
      	}
      	this.$axios.put(`/api/A/user/${this.currUser.id}/name`, {
      		'name': this.currUser.name
      	})
      		.then( res => {
      			Modal.success({
      				'title': '成功',
      				'content': res.data
      			})
      			this.modalStat.info.loading = false;
        		this.modalStat.info.visible = false;
      		})
      		.catch( err => {
      			this.modalStat.pwd.loading = false;
      		})
      },
      changePwd() {
				this.modalStat.pwd.loading = true;
      	if (!this.pwd.new || !this.pwd.old || !this.pwd.confirm) {
      		Modal.error({
      			'title': '失败',
      			'content': '原密码或新密码或确认密码为空'
      		})
      		this.modalStat.pwd.loading = false;
      		return;
      	}

      	if (this.pwd.old === this.pwd.new) {
						Modal.error({
      			'title': '失败',
      			'content': '原密码不能与新密码相同'
      		})
      		this.modalStat.pwd.loading = false;
      		return;
      	}

      	if (this.pwd.new !== this.pwd.confirm) {
						Modal.error({
      			'title': '失败',
      			'content': '确认密码与新密码不符'
      		})
      		this.modalStat.pwd.loading = false;
      		return;
      	}

      	this.$axios.put(`/api/A/user/${this.currUser.id}/pwd`, {
          'oldPwd': this.pwd.old,
          'newPwd': this.pwd.new
        })
        	.then( res => {
        		Modal.success({
        			'title': '成功',
        			'content': '修改密码成功',
        		})
        		this.modalStat.pwd.loading = false;
        		this.modalStat.pwd.visible = false;
        	})
        	.catch( err => {
        		this.modalStat.pwd.loading = false;
        		this.pwd.old = '';
  					this.pwd.new = '';
  					this.pwd.confirm = '';
        	})
      }, 
      removeUser(user) {
      	this.$axios.delete(`/api/A/user/${user.id}`)
      		.then( res => {
      			Modal.success({
        			'title': '成功',
        			'content': `用户${user.name}删除成功`,
        		})
        		this.reloadUser();
      		})
      },
      calRows() {
      	const vh = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
  			this.totRows = Math.round(0.54 * vh / 63)
  			this.page.tot = (Math.floor(this.list.length / this.totRows) + 1)
      }
  	}
  }
</script>

<style scoped>

</style>

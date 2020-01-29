<template>
  <div>
  	<div style="display: inline-flex; width: 100%; align-items: baseline; justify-content: space-between;">
  		<div style="display: inline-flex; width: 100%; align-items: baseline;">
  			<h1 style="width: 150px;">运行管理</h1>
    		<h2 :style="{color: task.start === 0 ? '#f5222d' : '#52c41a'}"> {{ task.start === 0 ? '（已停止）' : '（正在运行）' }} </h2>
  		</div>
    	<a-button @click="end()">停止运行</a-button>
    </div>
    <table>
      <tr>
        <td><b>选择开始时间：</b></td>
        <td>
        	<a-date-picker
		      :disabledDate="disabledStartDate"
		      showTime
		      format="YYYY-MM-DD HH:mm:ss"
		      v-model="startValue"
		      placeholder="Start"
		      @openChange="handleStartOpenChange"
		    	/>
		  	</td>
      </tr>
      <br/>
      <tr>
        <td><b>选择结束时间：</b></td>
        <td>
          <a-date-picker
			      :disabledDate="disabledEndDate"
			      showTime
			      format="YYYY-MM-DD HH:mm:ss"
			      placeholder="End"
			      v-model="endValue"
			      :open="endOpen"
			      @openChange="handleEndOpenChange"
			    />
        </td>
      </tr>
    </table>
    <br/>
    <a-button @click="start()">运行任务</a-button><br/>
    <a-divider />
    <table>
    	<tr>
        <td><b>用户ID：</b></td>
        <td>
        	<a-input style="width: 220px" placeholder="请输入ID" v-model="user.id" ref="userNameInput">
        		<a-icon slot="prefix" type="user" />
        	</a-input>
		  	</td>
      </tr>
      <br/>
      <tr>
        <td><b>权限时长：</b></td>
        <td>
        	<a-time-picker placeholder="请选择添加时长" style="width: 220px" @change="onChange" :defaultOpenValue="moment('00:00:00', 'HH:mm:ss')" />
		  	</td>
      </tr>
    </table>
    <br/>
    <a-button @click="auth()">添加权限</a-button>
    <a-button @click="removeAuth()" style="margin-left: 120px;">删除权限</a-button>
  </div>
</template>

<script>

	import utils from "../../utils";
	import { Modal } from 'ant-design-vue';
	import moment from 'moment';

  export default {
  	data() {
      return {
        utils,
        startValue: null,
        endValue: null,
        endOpen: false,
        duration: 0,
        task: {
        	id: this.$store.state.currentTask.id,
        	start: this.$store.state.currentTask.start
        },
        user: {
        	id: '',
        	duration: 0
        }
      }
    },
    mounted() {
      
    },
    methods: {
    	// run the current task
      start: function() {
      	// err handling
      	if (!this.startValue || !this.endValue) {
      		Modal.error({
            title: '失败',
            content: '开始日期或结束日期不能为空'
          });
          return;
      	}
      	this.$axios.put(`/api/T/task/${this.task.id}/open`, {
      		'start': Math.trunc(this.startValue.valueOf() / 1000),
      		'end': Math.trunc(this.endValue.valueOf() / 1000)
      	})
      		.then( res => {
      			this.task.start = 1;
      			Modal.success({
      				title: "成功",
      				content: res.data,
      			})
      		})
      },
      // close the current task
      end: function() {
      	// task should start before end
      	if (this.task.start === 0) {
      		Modal.error({
      			title: '失败',
            content: '任务尚未开启'
      		})
      		return;
      	}
      	this.$axios.put(`/api/T/task/${this.task.id}/close`)
      		.then(res => {
      			this.task.start = 0;
      			Modal.success({
      				title: "成功",
      				content: res.data,
      			})
      		})
      },
      // give access right to a specific user
      auth: function() {
      	// task should start and input should not be empty
      	if (this.task.start === 0) {
      		Modal.error({
      			title: '失败',
            content: '任务尚未开启，仅可在运行中的任务添加权限'
      		})
      		return;
      	}
      	if (!this.user.id || !this.user.duration) {
      		Modal.error({
      			title: '失败',
            content: '用户ID或权限时间为空'
      		})
      		return;
      	}
      	this.$axios.post(`/api/T/permission/${this.task.id}`, {
      		'user': this.user.id,
      		'expiration': this.user.duration
      	})
      		.then(res => {
      			console.log(res)
      			Modal.success({
      				title: "成功",
      				content: `用户${this.user.id}添加权限成功`,
      			})
      		})
      },
      // remove access right from a user
      removeAuth: function() {
      	if (!this.user.id) {
      		Modal.error({
      			title: '失败',
            content: '用户ID为空'
      		})
      		return;
      	}
      	this.$axios.delete(`/api/T/permission/${this.task.id}/${this.user.id}`)
      		.then(res => {
      			Modal.success({
      				title: "成功",
      				content: `用户${this.user.id}删除权限成功`,
      			})
      		})
      }, 
      disabledStartDate(startValue) {
        const endValue = this.endValue;
        if (!startValue || !endValue) {
          return false;
        }

        return startValue.valueOf() >= endValue.valueOf();
      },
      disabledEndDate(endValue) {
        const startValue = this.startValue;
        if (!endValue || !startValue) {
          return false;
        }
        return startValue.valueOf() > endValue.valueOf();
      },
      handleStartOpenChange(open) {
        if (!open) {
          this.endOpen = true;
        }
      },
      handleEndOpenChange(open) {
        this.endOpen = open;
      },
      moment,
      onChange(time, timeString) {
      	let t = timeString.split(":");
      	this.user.duration = parseInt(t[0]) * 3600 + parseInt(t[1]) * 60 + parseInt(t[2]);
      },
    }
  }
</script>

<style scoped>

</style>

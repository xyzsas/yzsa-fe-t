<template>
  <div>
    <h1>任务记录</h1>
    <p>导出任务记录</p>
    {{data}}
  </div>
</template>


<script>
	import utils from '../../utils'
  export default {
  	data() {
      return {
        utils,
        data: {}
      }
    },
    mounted() {
      this.$axios.get(`/api/T/record/${this.$store.state.currentTask.id}`)
      	.then(res => {
      		this.data = res.data;
      		console.log(res.data)
      	})
    },
    methods: {
      
    }
  }
</script>

<style scoped>

</style>

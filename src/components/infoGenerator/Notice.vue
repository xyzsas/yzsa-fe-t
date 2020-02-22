<template>
  <div>
    <div style="margin-bottom: 16px;">
      阅读时间：
      <a-input placeholder="阅读时间" addonAfter="秒" v-model="readTime" type="number" />
    </div>
    <div>
      通知内容：
      <a-textarea placeholder="通知内容" :rows="8" v-model="content" />
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        readTime: '',
        content: ''
      }
    },
    methods: {
      setInfo(info) {
        this.readTime = info.readTime.toString();
        this.content = info.content;
      },
      getInfo() {
        return {
          readTime: parseInt(this.readTime),
          content: this.content
        }
      }
    }
  }
</script>

<style scoped>

</style>

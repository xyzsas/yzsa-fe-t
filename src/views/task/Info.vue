<template>
  <div>
    <a-select @change="changeMode" v-model="mode" style="margin: 10px;">
      <a-select-option value="tree">树形 tree</a-select-option>
      <a-select-option value="view">查看 view</a-select-option>
      <a-select-option value="form">表单 form</a-select-option>
      <a-select-option value="text">文本 text</a-select-option>
      <a-select-option value="preview">预览 preview</a-select-option>
    </a-select>
    <div ref="jsoneditor"></div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        editor: null,
        mode: "tree",
        data: {},
        example: {
          courses: {
            course1: 100,
            course2: 100,
            course3: 100
          }
        }
      }
    },
    mounted() {
      let container = this.$refs.jsoneditor;
      this.editor = new JSONEditor(container);
      this.editor.set(this.example);
    },
    methods: {
      changeMode: function() {
        this.editor.setMode(this.mode);
      },
      getData: function() {
        this.data = this.editor.get();
      }
    }
  }
</script>

<style scoped>

</style>

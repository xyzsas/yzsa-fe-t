<template>
  <div>
    <a-input placeholder="课程名称" v-model="name"  style="margin-bottom: 16px;"/>
    <a-input placeholder="课程名额" addonAfter="人" v-model="count" type="number" style="width: 150px; margin-bottom: 16px; margin-right: 16px;" />
    <a-button @click="add" type="primary">添加</a-button>
    <a-list size="small" bordered :dataSource="data">
      <a-list-item slot="renderItem" slot-scope="item, index">
        <a-list-item-meta><span slot="title" >{{ `${item.name} : ${item.count}` }}</span></a-list-item-meta>
        <div style="color: #f5222d; cursor: pointer;" @click="data.splice(index, 1)"><a-icon type="delete" /></div>
      </a-list-item>
    </a-list>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        data: [],

        name: '',
        count: ''
      }
    },
    methods: {
      add() {
        this.data.push({
          name: this.name,
          count: parseInt(this.count)
        })
      },
      setInfo(info) {
        this.data = [];
        for(let i in info) {
          this.data.push({
            name: i,
            count: info[i]
          })
        }
      },
      getInfo() {
        let res = {};
        for(let i in this.data) {
          let ci = this.data[i];
          res[ci.name] = ci.count;
        }
        return res;
      }
    }
  }
</script>

<style scoped>

</style>

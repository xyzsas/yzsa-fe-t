<template>
  <div>
    <a-date-picker placeholder="请选择日期" @change="onDateChange"></a-date-picker>
    <a-time-picker placeholder="请选择时间" @change="onTimeChange"></a-time-picker>
  </div>
</template>

<script>
  export default {
    name: "DateTime",
    data() {
      return {
        date: '',
        time: '',
      }
    },
    methods: {
      onDateChange(date, dateString) {
        this.date = dateString;
      },
      onTimeChange(date, dateString) {
        this.time = dateString;
      },
      getTimeStamp() {
        let timeStamp = new Date(this.date + ' ' + this.time).getTime();
        if(isNaN(timeStamp)) {
          return NaN;
        } else {
          return parseInt(timeStamp / 1000);
        }
      }
    }
  }
</script>

<template>
  <div>
    <h1>任务记录</h1>
    <a-button v-if="Object.keys(data).length > 0" @click="download()">下载任务记录</a-button>
    <b v-else>暂无任务记录</b>
  </div>
</template>


<script>
	import utils from '../../utils';
	import { Modal } from 'ant-design-vue';

  export default {
  	data() {
      return {
        utils,
        data: {},
        CSV: ''
      }
    },
    mounted() {
    	this.$axios.get(`/api/T/record/${this.$store.state.currentTask.id}`)
    		.then(res => {
    			this.data = res.data;
    		})
    },
    methods: {

      download: function() {
      	
      	let arrData = typeof this.data != 'object' ? JSON.parse(this.data) : this.data;
      	console.log(this.data)
      	// set file name
      	let fileName = this.$store.state.currentTask.title + '.csv';
      	let CSV = '';
      	for (let i = 0; i < Object.keys(arrData).length; i++) {
          let row = "";
            for (let index in arrData[i]) {
              row += '"' + arrData[i][index] + '",';
            }
            row.slice(0, row.length - 1);
 
            //add a line break after each row
            CSV += row + '\r\n';
        }
        if (CSV == '') {
          Modal.error({
          	title: '失败',
            content: '无效的数据'
          })
          return;
        }
        this.saveAs(fileName, CSV);
      },
      buildCSV: function(data) {

      },
      saveAs: function(fileName, csvData) {
		    var bw = this.browser();
		    if(!bw['edge'] ||  !bw['ie']) {
		      var alink = document.createElement("a");
		      alink.id = "linkDwnldLink";
		      alink.href = this.getDownloadUrl(csvData);
		      document.body.appendChild(alink);
		      var linkDom = document.getElementById('linkDwnldLink');
		      linkDom.setAttribute('download', fileName);
		      linkDom.click();
		      document.body.removeChild(linkDom);
		    }
		  },
      getDownloadUrl: function(csvData) {
      	let _utf = "\uFEFF";
      	if (window.Blob && window.URL && window.URL.createObjectURL) {
	        let csvData = new Blob([_utf + csvData], {
	            type: 'text/csv'
	        });
	        return URL.createObjectURL(csvData);
	    	}
	    	return 'data:attachment/csv;charset=utf-8,' + _utf + encodeURIComponent(csvData);
	    },
	    browser: function() {
		    var Sys = {};
		    var ua = navigator.userAgent.toLowerCase();
		    var s;
		    (s = ua.indexOf('edge') !== - 1 ? Sys.edge = 'edge' : ua.match(/rv:([\d.]+)\) like gecko/)) ? Sys.ie = s[1]:
		        (s = ua.match(/msie ([\d.]+)/)) ? Sys.ie = s[1] :
		        (s = ua.match(/firefox\/([\d.]+)/)) ? Sys.firefox = s[1] :
		        (s = ua.match(/chrome\/([\d.]+)/)) ? Sys.chrome = s[1] :
		        (s = ua.match(/opera.([\d.]+)/)) ? Sys.opera = s[1] :
		        (s = ua.match(/version\/([\d.]+).*safari/)) ? Sys.safari = s[1] : 0;
		    return Sys;
		  }
    }
  }
</script>

<style scoped>

</style>

import FileSaver from 'file-saver';

export default {
  dumpCSV(data, keys = undefined) { // 传入一个对象数组
    if(keys === undefined) {
      keys = Object.keys(data[0]);
    }
    let csv = '\ufeff';
    csv += keys.join(',') + '\n';
    for(let i = 0; i < data.length; i++) {
      for(let j = 0; j < keys.length; j++) {
        let k = keys[j];
        let v = data[i] ? (data[i][k] ? data[i][k] : '') : '';
        if(v instanceof Array) {
          v = v.join()
        }
        if(j !== 0) csv += ',';
        csv += `"${v.replace(/"/g, `""`)}"`
      }
      csv += '\n'
    }
    return csv;
  },
  downloadText(filename, content) {
    let blob = new Blob([content], {type: 'text/plain;charset=utf-8'});
    FileSaver.saveAs(blob, filename);
  }
}

const fs = require('fs');
const path = require('path');


const files = fs.readdirSync(path.resolve(__dirname, '../post/'), {encoding: 'utf-8'});


// 清空文件
files.forEach((item) => {
  if (item === 'README.md') {
    return;
  }
  fs.unlinkSync(path.resolve(__dirname, `../post/${item}`));
});

console.log(`删除成功！共清空${files.length - 1}个文件`);
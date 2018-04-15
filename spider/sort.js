const fs = require('fs');
const path = require('path');


const files = fs.readdirSync(path.resolve(__dirname, '../post/'), {encoding: 'utf-8'});

const datas = [];

// 读取所有数据
files.forEach((item) => {
  if (item === 'README.md') {
    return;
  }
  const file = fs.readFileSync(path.resolve(__dirname, `../post/${item}`));
  datas.push(...JSON.parse(file));
});


// 从高到低排序
datas.sort((a, b) => {
  return b.reply - a.reply;
});

// 去重
const result = {};
datas.forEach((item) => {
  if (!result[item.name]) {
    result[item.name] = {...item};
  }
});

// 输出
const output = path.resolve(__dirname, `../summary/${new Date().getTime()}.json`);
fs.writeFileSync(output, JSON.stringify(result, null, 2));

console.log('排序完成!');
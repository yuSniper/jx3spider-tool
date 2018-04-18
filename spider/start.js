const process = require('process');
const cheerio = require('cheerio');
const superagent = require('superagent');
const child_process = require('child_process');
const path = require('path');

const getPostNumber = (html) => {
  const $ = cheerio.load(html);
  const doms = $('.th_footer_l span');
  return doms.eq(0).text();
}

const getHtml = async (url) => {
  return new Promise((resolve) => {
    superagent
    .get(url)
    .end((err,pres) => {
      resolve(pres.text);
    });
  })
}

const start = async () => {
  const child_process_num = process.argv[2]; // 并发爬虫脚本个数
  if (!child_process_num) {
    console.log('输入并发脚本个数!');
  }
  const index = 'https://tieba.baidu.com/f?kw=%E5%89%91%E7%BD%913&ie=utf-8';
  const indexHtml =  await getHtml(index);
  const postNum = await getPostNumber(indexHtml);
  const pageSize = 50;
  const pageSum = Math.ceil(postNum / pageSize);  // 总页数

  const offset = Math.ceil(pageSum / child_process_num);

  for(let i = 0; i < child_process_num; i++) {
    const id = new Date().getTime();
    child_process.exec(`pm2 start ${path.resolve(__dirname, './spider.js')} --name jx3spider-${id} -- ${i * offset} ${(i+1) * offset}`);
  }
  console.log(`${child_process_num}个并发脚本启动!`);
}

start();


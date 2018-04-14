const cheerio = require('cheerio');
const fs = require('fs');
const http = require('http');
const superagent = require('superagent');
const path = require('path');

const KEY_WORD = ['818', '树洞'];

const getHtml = async (url) => {
  return new Promise((resolve) => {
    superagent
    .get(url)
    .end((err,pres) => {
      resolve(pres.text);
    });
  })
  
}

// 解析 - 首页帖子
const compile = async (html) => {
  const $ = cheerio.load(html);
  const doms = $('.threadlist_title .j_th_tit');
  const post = []; // 帖子对象数组 {name: '', url: ''};
  
  doms.each(function () {
    const dom = $(this);
    const postUrl = 'https://tieba.baidu.com';
    const url = postUrl + dom.attr('href');
    const name = dom.text();
    if (name.match(new RegExp(KEY_WORD.join('|')))) {
      post.push({name, url});
    }
  });

  return new Promise(async (resolve) => {
    const result = []; // 帖子对象数组 {name: '', url: '', reply: 1};
    const promiseArr = post.map((item) => {
      return new Promise(async (resolve) => {
        const postHtml = await getHtml(item.url);
        const reply = getRelyNumber(postHtml);
        result.push({...item, reply});
        resolve();
      })
    });

    Promise.all(promiseArr).then(() => {
      resolve(result);
    })
  });
}

// 获取帖子回复量
const getRelyNumber = (html) => {
  const $ = cheerio.load(html);
  const doms = $('.l_reply_num span');
  return doms.eq(0).text();
}


// 获取贴吧总帖子数
const getPostNumber = (html) => {
  const $ = cheerio.load(html);
  const doms = $('.th_footer_l span');
  return doms.eq(0).text();
}


const spider = async () =>{
  const index = 'https://tieba.baidu.com/f?kw=%E5%89%91%E7%BD%913&ie=utf-8';
  const indexHtml =  await getHtml(index);
  const postNum = await getPostNumber(indexHtml);
  const pageSize = 50;
  const pageSum = Math.ceil(postNum / pageSize);  // 总页数
  let temp = []; // 数据缓存数组
  const max = 1000; // 最多缓存帖子数，达到输出
  let fileCount = 1;
  let url = 'https://tieba.baidu.com/f?kw=%E5%89%91%E7%BD%913&ie=utf-8&pn='; // 翻页地址
  for (let i = 0; i < pageSum; i++) {
    console.log(`目前是第${i}页，总计${pageSum}页！`);
    const html = await getHtml(url + i * pageSize);
    const post = await compile(html);
    temp.push(...post);
    if (temp.length >= max) {
      const filename = (path.resolve(__dirname, `../post/${new Date().getTime()}.json`));
      // 输出缓存
      fs.writeFileSync(filename, JSON.stringify(temp, null, 2), {encoding: 'utf-8'});
      console.log(`输出文件${filename}, 这是本次程序输出的第${fileCount++}个`);
      // 清空数组
      temp = [];
    }
  }


  // 输出剩下的帖子
  const filename = (path.resolve(__dirname, `../post/${new Date().getTime()}.json`));
  fs.writeFileSync(filename, JSON.stringify(temp, null, 2), {encoding: 'utf-8'});
  console.log(`输出文件${filename}, 这是本次程序输出的第${fileCount++}个`);
  console.log('爬虫结束！');  
}


spider();
# 剑网3 帖子爬虫


## 贴吧
贴吧地址
```
https://tieba.baidu.com/f?kw=%E5%89%91%E7%BD%913&ie=utf-8
```

帖子名选择器
```
.threadlist_title .j_th_tit
```

翻页偏移量 - 50为一页
```
https://tieba.baidu.com/f?kw=剑网3&ie=utf-8&pn=100
```

帖子地址 - 5647381685  帖子id
```
https://tieba.baidu.com/p/5647381685
```

帖子回复数  - 第一个
```
.l_reply_num span
```

贴吧总帖子数 - 第一个
```
.th_footer_l span
```
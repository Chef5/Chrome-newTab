/*
 * @Author: Patrick-Jun 
 * @Date: 2021-07-13 21:35:38 
 * @Last Modified by: Patrick-Jun
 * @Last Modified time: 2021-07-15 11:33:46
 */

import { config } from './config.js';
import { time2cn } from './time2cn.js';

// 搜索
const doSearch = (type, keyword) => window.location.href = config.href[type] + keyword;

const vm = new Vue({
  el: '#vue-root', 
  data: {
    keyword: '', // 搜索的词
    showHot: false, // 是否显示热搜
    hotColor: ['#cc3939', '#de6b30', '#cc984f', '#aaa'],
    hot: [
      {
        id: 1,
        logo: './imgs/zhihu.png',
        name: '知乎热榜',
        time: '10分钟前',
        data: [], // { id, link, title, num }
      },
      {
        id: 3,
        logo: './imgs/weibo.png',
        name: '微博热搜',
        time: '10分钟前',
        data: [],
      },
      {
        id: 38,
        logo: './imgs/huxiu.png',
        name: '虎嗅',
        time: '10分钟前',
        data: [],
      },
    ],
    hitokoto: {
      id: '',
      hitokoto: 'Hello Patrick', // tips
      type: '',
      from: '', // from
      creator: '', // author
    },
  },
  computed: {
    authorInfo: function() {
      return [
        this.hitokoto.from ? `《${this.hitokoto.from}》` : '',
        this.hitokoto.creator ? `by ${this.hitokoto.creator}` : '',
      ].join('');
    },
  },
  methods: {
    // 搜索
    search: function(type) {
      doSearch(type, this.keyword);
    },
    // 获取全部热搜
    getHotAll: function() {
      axios.get(config.hot.all)
      .then(response => {
        if (response.status === 200 && response.data.data) {
          response.data.data.forEach(item => {
            // 知乎
            if (item.id === this.hot[0].id) {
              this.hot[0].time = time2cn(item.create_time);
              this.hot[0].data = item.data.map(h => ({
                id: h.id,
                link: h.link,
                title: h.title,
                num: h.extra || '',
              }));
            }
            // 微博
            if (item.id === this.hot[1].id) {
              this.hot[1].time = time2cn(item.create_time);
              this.hot[1].data = item.data.map(h => ({
                id: h.id,
                link: h.link,
                title: h.title,
                num: h.extra || '',
              }));
            }
            // 虎嗅
            if (item.id === this.hot[2].id) {
              this.hot[2].time = time2cn(item.create_time);
              this.hot[2].data = item.data.map(h => ({
                id: h.id,
                link: h.link,
                title: h.title,
                num: h.extra || '',
              }));
            }
          });
          this.showHot = true;
        }
      });
    },
    // 获取单个热搜
    getHotItem: function(id, index) {
      this.hot[index].time = 'loading...';
      this.hot[index].data = [];
      axios.get(config.hot.item + id)
      .then(response => {
        if (response.status === 200 && response.data.data) {
          this.hot[index].time = time2cn(response.data.data.time);
          this.hot[index].data = response.data.data.list.map(h => ({
            id: h.id || -1,
            link: h.link,
            title: h.title,
            num: h.extra || '',
          }));
        }
      });
    },
    // 获取随机一言
    getHitokoto: function() {
      axios.post(config.hitokoto.api, config.hitokoto.params)
      .then(response => {
        if (response.data.code === 200 && response.data.data) {
          this.hitokoto = response.data.data;
        }
      });
    },
    // 获取毒鸡汤
    getSoul: function() {
      axios.post(config.soul.api, config.soul.params)
      .then(response => {
        if (response.data.code === 200 && response.data.data) {
          this.hitokoto = {
            id: '',
            hitokoto: response.data.data.content,
            type: '',
            from: '心灵毒鸡汤',
            creator: '',
          };
        }
      });
    },
  }, 
  created: function() {
    // 1随机一言 0毒鸡汤
    Math.round(Math.random()) ? this.getHitokoto() : this.getSoul();
    // 获取热搜
    this.getHotAll();
  },
  mounted: function() {
  },
});

// 监听键盘事件
document.onkeydown = (event) => {
  let e = event || window.event || arguments.callee.caller.arguments[0];
  if (e && e.keyCode == 112) { // 按F1 
    event.preventDefault(); // 原F1是chrome帮助
    doSearch('google', vm.keyword)
  }
  if (e && e.keyCode == 113) { // 按F2 
    event.preventDefault();
    doSearch('bing', vm.keyword)
  }
  if (e && e.keyCode == 114 || e.keyCode == 13) { // 按F3和回车
    event.preventDefault();
    doSearch('baidu', vm.keyword)
  }
  if (e && e.keyCode == 115) { // 按F4
    event.preventDefault();
    doSearch('stack', vm.keyword)
  }
};

// 聚焦
document.getElementsByClassName('input')[0].focus();

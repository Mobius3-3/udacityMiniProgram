// pages/list/list.js

Page({
  
  data: {
    news:[],
    id: 0,
    content:[],
  },

  onLoad(options) {
    console.log('onLoad2')
    this.setData({
      id:options.id
    })
    this.getNews()
  },

  onPullDownRefresh() {
    this.getNews(()=>{
      wx.stopPullDownRefresh()
    })
  },

  getNews() {
    wx.request({
      url:'https://test-miniprogram.com/api/news/detail',
      data: {
        id: this.data.id
      },
      success: res => {
        let result = res.data.result
        this.setNews(result)
        // this.setWeekly(result)
      }
    })
    // complete: () => {
    //   callback && callback()
    // }
  },

  setNews(result) {
    let news = []

    if (result.source == '') {
      result.source = '未知'
    }
    let time = new Date(result.date)
    news.push({
      id: result.id,
      title: result.title,
      source: result.source,
      date: `${time.getHours()}:${time.getMinutes()}`,
      firstImage: result.firstImage,
      readCount: result.readCount,
      // id(=1时，是’划重点‘，从2开始)/type（p,strong,image）/text,
    });
    
    this.setData({
      news: news,
      id: result.id,
      content: result.content,
    });
  },


})
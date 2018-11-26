const navigatorTitle = [{ id: 0, title: '国内',api:'gn'},
  { id: 1, title: '国际',api:'gj'},
  { id: 2, title: '财经',api:'cj' },
  { id: 3, title: '娱乐',api:'yl' },
  { id: 4, title: '军事',api:'js' },
  { id: 5, title: '体育',api:'ty' },
  { id: 6, title: '其他',api:'other' }]

Page({

  data: {
    navigatorTitle: navigatorTitle,
    btnId:0,
    type:'gn',
    newsList:[],
    hotNews:[],
  },

  onLoad() {
    this.getList();
  },

  getList() {
    this.setData({
      type: navigatorTitle[this.data.btnId].api,
    });
    wx.request({
      url: 'https://test-miniprogram.com/api/news/list',
      data: {
        type: this.data.type,
      },
      success: res => {
        console.log(res)
        let result = res.data.result
        this.setNewsList(result)
        console.log(this.data.hotNews)
      },
      // 
    })
  },
  
  setNewsList(result) {
    let newsList = []
    let hotNews = []
    let length = result.length
    for (let i=1; i<length; i++) {
      if (result[i].source == '') {
        result[i].source = '未知'
      }
      let time = new Date(result[i].date)
      newsList.push({
        id:result[i].id,
        title:result[i].title,
        source:result[i].source,
        date: `${time.getHours()}:${time.getMinutes()}`,
        firstImage:result[i].firstImage,
      })
    }
    if (result[0].source == '') {
      result[0].source = '未知'
    }
    let time0 = new Date(result[0].date)
    hotNews.push({
      id: result[0].id,
      title: result[0].title,
      source: result[0].source,
      date: `${time0.getHours()}:${time0.getMinutes()}`,
      firstImage: result[0].firstImage,
    })
    this.setData({
      hotNews:hotNews,
      newsList:newsList,
    })
  },

  titleClick:function(e){
    let btnId = e.currentTarget.dataset.id;
    wx.setStorage({
      key:'itemId',
      data:btnId,
    });
    this.setData({
      btnId:btnId
    });
    this.getList()
  },

  onTapHot() {
    let ID = this.data.hotNews[0].id
    wx.showToast()
    wx.navigateTo({
      url: '/pages/list/list?id=' + ID,
    })
  },

  onTapNews:function(e) {
    let ID = e.currentTarget.dataset.id
    console.log(ID)
    wx.showToast()
    wx.navigateTo({
      url: '/pages/list/list?id=' + ID,
    })
  },

  onPullDownRefresh() {
    console.log("refresh executed!")
    this.getList(() => {
      wx.stopPullDownRefresh()
    })
  }

})

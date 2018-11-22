// pages/list/list.js
const dayMap = ['星期日','星期一','星期二', '星期三', '星期四', '星期五', '星期六']
Page({
  data: {
    forecast: [],
    city: "待定位"
  },

  onLoad(options) {
    console.log('onLoad2')
    this.setData({
      city:options.city
    })
    this.getNow()
  },
  onPullDownRefresh() {
    this.getNow(()=>{
      wx.stopPullDownRefresh()
    })
  },
  getNow() {
    wx.request({
      url:'https://test-miniprogram.com/api/weather/future',
      data: {
        time: new Date().getTime(),
        city: this.data.city
      },
      success: res => {
        let result = res.data.result
        this.setWeekly(result)
      }
    })
    complete: () => {
      callback && callback()
    }
  },

  setWeekly(result) {
    let forecast = []
    for (let i = 0; i < 7; i++) {
      let date = new Date()
      date.setDate(date.getDate() + i)
      forecast.push({
        day: dayMap[date.getDay()],
        date: `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`,
        temp: `${result[i].minTemp}-${result[i].maxTemp}`,
        iconPath: '/images/' + result[i].weather + '-icon.png',
      })
    }
    forecast[0].day = "今天"
    this.setData({
      forecast: forecast
    })
  },

})
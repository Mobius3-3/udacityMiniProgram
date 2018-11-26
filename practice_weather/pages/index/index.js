const weatherMap = {
  'sunny': '晴天',
  'cloudy': '多云',
  'overcast': '阴',
  'lightrain': '小雨',
  'heavyrain': '大雨',
  'snow': '雪',
}

const QQMapWX = require('../../libs/qqmap-wx-jssdk.js')

const weatherColorMap = {
  'sunny': '#cbeefd',
  'cloudy': '#deeef6',
  'overcast': '#c6ced2',
  'lightrain': '#bdd5e1',
  'heavyrain': '#c5ccd0',
  'snow': '#aae1fc'
}

const unprompt = 0
const unauthorized = 1
const authorized = 2

Page({
  data: {
    nowTemp: 0,
    nowWeather: "",
    nowWeatherBackground: "",
    forecast: [],
    todayTemp: "",
    todayDate: "",
    city:'未定位',
    authorizedType: unprompt,
  },
  onLoad() {
    console.log('onLoad')
    this.qqmapsdk = new QQMapWX({
      key: 'EAXBZ-33R3X-AA64F-7FIPQ-BY27J-5UF5B'
    })
    wx.getSetting({
    success: res => {
      let auth = res.authSetting['scope.userLocation']
      let authorizedType = auth ? authorized
        : (auth === false) ? unauthorized  : unprompt
      this.setData({
        authorizedType: authorizedType,
      })
      if (auth)
        this.getLocation()
      else  
        this.getNow()
    },

    fail: () => {
      this.getNow()
    }
    })
  },

  getNow(callback) {
    wx.request({
      url: 'https://test-miniprogram.com/api/weather/now',
      data: {
        city: this.data.city,
      },
      success: res => {
        console.log(res)
        let result = res.data.result
        this.setNow(result)
        this.setHourly(result)
        this.setToday(result)
      },
      // 
      complete: () => {
        // 若&&前面为假，就不会执行后面的句子
        callback && callback()  
      }
    })
  },
 setNow(result) {
    let temp = result.now.temp
      let weather = result.now.weather
      console.log(temp, weather)
      this.setData({
        nowTemp: temp +'°',
      nowWeather: weatherMap[weather],
      nowWeatherBackground: "/images/" + weather + "-bg.png"
    })
      wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: weatherColorMap[weather],
    })
  },
  setHourly(result) {
    let hourlyForecast = result.forecast
    let forecast = []
    let newHour = new Date().getHours()
    for (let i = 0; i < 8; i++) {
      forecast.push({
        time: (i * 3 + newHour) % 8 + ":00",
        iconPath: '/images/' + hourlyForecast[i].weather + '-icon.png',
        temp: hourlyForecast[i].temp + '°'
      })
    }
    forecast[0].time = "now"
    this.setData({
      forecast: forecast
    })
  },
  setToday(result) {
    let date = new Date()
    this.setData({
      todayTemp: `${result.today.minTemp}° - ${result.today.maxTemp}°`,
      todayDate: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} 今天`
    })
  },
  onTapDayWeather() {
    wx.showToast()
    wx.navigateTo({
      url:'/pages/list/list?city='+this.data.city,
    })
  },
  onTapLocation() {

      this.getLocation()
  },

  getLocation() {
    wx.getLocation({
      success: res => {
        this.setData({
          authorizedType: authorized,
        })
        this.qqmapsdk.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          success: res => {

            let city = res.result.address_component.city
            this.setData({
              city: city,
            })
            this.getNow()
          },
          fail: (err) =>{
            console.log('qqmapsdk.reverseGeocoder')
          }
        })
      },
        fail: (err) => {
          console.log(err);
          this.setData({
            authorizedType: unauthorized,
          });
          console.log(this.data.authorizedType)
        },
      })
    },
  
  onPullDownRefresh() {
    console.log("refresh executed!")
    this.getNow(() => {
      wx.stopPullDownRefresh()
    })
  }
})

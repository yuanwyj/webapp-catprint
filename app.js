//app.js
App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var that = this
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    //获取位置信息
    wx.getLocation({
      type: 'wgs84',
      success: function(res) {
        let location = res.latitude + ',' + res.longitude
        wx.setStorageSync('location', location)
      }
    })
    // 获取Cookie
    wx.request({
      url: 'https://www.aimiaoyin.com/print/?m=admin&c=login&a=getsession',
      header:{'Content-Type':'application/x-www-form-urlencoded'},
      method: 'GET',
      success: function(res) {
        if(res.data) {
          if( wx.getStorageSync('PHPSESSID') ) {
            //console.log("已登陆")
          } else {
            wx.setStorageSync('PHPSESSID', res.data)
          }
        }
      }
    })
  },
  getUserInfo:function(cb){
    var that = this
    if(this.globalData.userInfo){
      typeof cb == "function" && cb(this.globalData.userInfo)
    }else{
      //调用登录接口
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      })
    }
  },
  globalData:{
    userInfo:null
  },

})
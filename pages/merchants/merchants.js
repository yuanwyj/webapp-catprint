// pages/merchants/merchants.js
Page({
  data:{
    merchants: [],
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    let that = this
    //获取店家列表
    wx.request({
      url: 'https://www.aimiaoyin.com/print/?m=admin&c=business&a=businessList&l=118.07039,24.6055&d=100000',
      data: {},
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
          'Content-Type':'application/x-www-form-urlencoded',
            "Cookie": wx.getStorageSync('PHPSESSID')
      },
      success: function(res){
        if(res.data.code == 200) {
          that.setData({
            merchants: res.data.data
          })
        }
      },
      fail: function(res) {
        // fail
      },
      complete: function(res) {
        // complete
      }
    })
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  }
})
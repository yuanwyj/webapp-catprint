// pages/order/order.js
Page({
  data:{
    orderList: {},
    color: ''
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    var that = this 
    // 获取订单列表
    wx.request({
      url: 'https://www.aimiaoyin.com/print/?m=admin&c=Goods&a=queryOrder',
      data: {
        month: 1
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        "Content-Type": "application/x-www-form-urlencoded", 
        "Cookie": wx.getStorageSync('PHPSESSID')
        
      }, // 设置请求的 header
      success: function(res){
        // success
        console.log(res)
        if(res.data.code == 200) {
          that.setData({
            orderList: res.data.data
          })
        } else(
          console.log("获取订单失败")
        )
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
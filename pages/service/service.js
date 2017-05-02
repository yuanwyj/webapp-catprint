Page({
    data: {
        sevice:[]
    },
    // 页面跳转
    pathTocloudpage: function() {
        wx.navigateTo({
            url: '../files/files'
        })      
    },
    pathToOrderpage: function() {
        wx.navigateTo({
            url: '../order/order'
        })      
    },
    pathToGetOrderpage: function() {
        // wx.navigateTo({
        //     url: '../product/product'
        // })    
        wx.scanCode({
            success: (res) => {
                console.log(res)
            }
        }) 
    },
    onLoad: function(){
    }
})
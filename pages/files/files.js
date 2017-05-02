// pages/files/files.js
let app = getApp()
Page({
  data:{
      fileList: [],
      printFormDisplay: false,
      fileListDisplay: true,
      printFile: '',
      single: "background: #fff",
      double: "background: olivedrab;color: #fff",
      black: "background: #fff",
      color_full: "background: olivedrab;color: #fff",
      printInfo: {                                        //打印颜色单双面信息
          black_white: 'black',
          single_double: 'single',
          copies_num:1
      },
      nominus: "color: #000",
      noplus: "color: #000"
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    var that = this
    // 获取用户文件列表
    wx.request({
        url: 'https://www.aimiaoyin.com/print/?m=admin&c=goods&a=getMobileList&p=1',
        header: {
            'Content-Type':'application/x-www-form-urlencoded',
             "Cookie": wx.getStorageSync('PHPSESSID')
        },
        success: function(res) {
            if(res.data.code == 200) {
                
                that.setData({
                    fileList: res.data.data
                })
            } else if( res.data.code == 211 ) {
                wx.switchTab({
                  url: '../user/user',
                  success: function(res){
                    // success
                  },
                  fail: function(res) {
                    // fail
                  },
                  complete: function(res) {
                    // complete
                  }
                })
            } else {
                console.log("获取失败")
            }
        }
    })  
  },
  //设置打印页数 减
  minus: function(){
    let that = this
    if(that.data.printInfo.copies_num <= 1) {
      that.setData({
        nominus: "color: #aaa" 
      })
    } else {
      that.setData({
        printInfo:{
          black_white: that.data.printInfo.black_white,
          single_double: that.data.printInfo.single_double,
          copies_num: parseInt( that.data.printInfo.copies_num ) - 1      
        },
        nominus: "color: #000"
      })
    }
  },
  //设置打印页数 加 
  plus: function() {
    let that = this
    if(that.data.printInfo.copies_num >= 99) {
      that.setData({
        noplus:"color: #aaa"
      })
    } else {
      that.setData({
        printInfo:{
          black_white: that.data.printInfo.black_white,
          single_double: that.data.printInfo.single_double,
          copies_num: parseInt( that.data.printInfo.copies_num ) + 1      
        },
        noplus: "color: #000"
      })     
    }
  },
  //输入打印页数
  copienum: function(e) {
    let that = this
    console.log(e.detail.value)
    that.setData({
      printInfo:{
        black_white: that.data.printInfo.black_white,
        single_double: that.data.printInfo.single_double,
        copies_num: e.detail.value 
      },
      noplus: "color: #000"
    })      
  },
  //文件打印彩色黑白选择
  selColor: function() {
    let that = this
    if(that.data.printInfo.black_white == 'black') {
        that.setData({
          black: "background: olivedrab;color: #fff",
          color_full: "background: #fff",
          printInfo: {
            black_white: 'color_full',
            single_double: that.data.printInfo.single_double,
            copies_num: that.data.printInfo.copies_num  
          }
        })
    } else {
      that.setData({
          black: "background: #fff",
          color_full: "background: olivedrab;color:#fff" ,
          printInfo: {
            black_white: 'black',
            single_double: that.data.printInfo.single_double,
            copies_num: that.data.printInfo.copies_num    
          }      
      })
    }
  },
  // 文件打印单双页选择
  selSingle: function() {
    let that = this
    if(that.data.printInfo.single_double == 'single') {
        that.setData({
          single: "background: olivedrab;color:#fff",
          double: "background: #fff",
          printInfo: {
            single_double: 'double',
            black_white: that.data.printInfo.black_white,
            copies_num: that.data.printInfo.copies_num    
          }
        })
    } else {
      that.setData({
          single: "background: #fff",
          double: "background: olivedrab;color:#fff" ,
          printInfo: {
            single_double: 'single',
            black_white: that.data.printInfo.black_white,
            copies_num: that.data.printInfo.copies_num    
          }      
      })
    }
  },
//文件删除
  delFile: function(event) {
    let that = this
    let dataid  = event.currentTarget.dataset.idx
    let idemid = event.currentTarget.dataset.index
    let oll_List = that.data.fileList
    // 用户选择是否删除 模态框
    wx.showModal({
      title: '删除文件提示',
      content: '确定永久删除该文件?',
      success: function(res) {
        if (res.confirm) {
          // 发送删除文件请求
          wx.request({
            url: 'https://www.aimiaoyin.com/print/?m=admin&c=goods&a=deleteFile&f='+event.currentTarget.dataset.itemid,
            data: {},
            method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            header: {
                'Content-Type':'application/x-www-form-urlencoded',
                  "Cookie": wx.getStorageSync('PHPSESSID')
            },
            success: function(res){
              // success
              if(res.data.code == 200) {
                oll_List[dataid].splice(idemid,1);
                that.setData({
                  fileList: oll_List
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
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

//文件预览
  preview: function(event) {
    wx.request({
      url: 'https://www.aimiaoyin.com/print/?m=admin&c=goods&a=filePreview&f='+event.currentTarget.dataset.itemid,
      data: {},
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
            'Content-Type':'application/x-www-form-urlencoded',
             "Cookie": wx.getStorageSync('PHPSESSID')        
      }, // 设置请求的 header
      success: function(res){
        // success
        if( res.data.code == 200 ) {  //返回文件下载地址
            wx.downloadFile({
              url: res.data.data.url,
              // type: 'image', // 下载资源的类型，用于客户端识别处理，有效值：image/audio/video
              // header: {}, // 设置请求的 header
              success: function(res){
                // success

                wx.openDocument({
                  filePath: res.tempFilePath,
                  success: function(res){
                    // success
                    console.log(res)
                  },
                  fail: function(res) {
                    // fail
                  },
                  complete: function(res) {
                    // complete
                  }
                })
              },
              fail: function(res) {
                // fail
              },
              complete: function(res) {
                // complete
              }
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
  uploadfile: function() {
    wx.uploadFile({
      url: 'https://www.aimiaoyin.com',
      filePath:'filePath',
      name:'name',
      // header: {}, // 设置请求的 header
      // formData: {}, // HTTP 请求中其他额外的 form data
      success: function(res){
        // success
      },
      fail: function(res) {
        // fail
      },
      complete: function(res) {
        // complete
      }
    })
  },

// 文件打印
  doprint: function(event) {
    let that = this
    that.setData({
      fileListDisplay: false,
      printFormDisplay: true,
      printFile: event.currentTarget.dataset.file
    })
  },
  // 关闭文件打印模态框
  closePrintForm: function() {
    let that = this
    that.setData({
      fileListDisplay: true,
      printFormDisplay: false,
      printFile: ''
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
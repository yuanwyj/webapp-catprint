// pages/user/user.js
let app = getApp()
Page({
  data:{
    formData: {                                              //登陆表单信息
      username: '',
      password: ''
    },
    loginForm: false,
    imgUrls: [                                                //登陆成功顶部轮播图
      '/images/wode1.png',
      '/images/wode2.png',
      '/images/wode3.png',
      '/images/wode4.png'
    ],
    indicatorDots: false,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    showEditForm: false,        
    btntext: '编辑',
    detailMsg: {                                              //用户编辑的详细信息
      nickname: '',
      sex: '',
      schoolId: '',                                           //学校id
      univsId: ''                                             //专业id
    },
    oll_School_List: [],                                      //学校列表（包括id、name）
    school: [],                                               //学校列表（只包含name）
    oll_academy: [],                                          //专业列表（包含id、name）
    academy: [],  //专业                                      //专业列表 (根据学校id通过接口获取)
    academy_index: 0, 
    index: 0,
    school_code: ''                                             //已选择的学校代码
  },
  //用户编辑信息表单显示隐藏
  showEditMsgForm: function() {
    var that = this
    if(that.data.showEditForm) {
      // 提交表单
      wx.request({
        url: 'https://www.aimiaoyin.com/print/?m=admin&c=index&a=editInfo',
        data: that.data.detailMsg,
        method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        header: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Cookie": wx.getStorageSync('PHPSESSID') 
        },
        success: function(res){
          // success
          //用户数据保存在本地localstorage
          if(res.data.code == 202) {
            that.setData({
              showEditForm: !that.data.showEditForm,
              btntext: '编辑'
            })         
          } else if( res.data.code == 200 ) {
            that.setData({
              showEditForm: !that.data.showEditForm,
              btntext: '编辑'
            })             
          } else {
            console.log("信息保存失败")
          }
        },
        fail: function(res) {
          // fail
        },
        complete: function(res) {
          // complete
        }
      })
    } else {
      that.setData({
        showEditForm: !that.data.showEditForm,
        btntext: '保存'
      })
    }
  },
  //院校选择
  pickScool: function() {
    var that = this
    wx.request({
      url: 'https://www.aimiaoyin.com/print/?m=admin&c=user&a=schoolinfo&t=1',
      data: {},
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Cookie": wx.getStorageSync('PHPSESSID')      
      }, // 设置请求的 header
      success: function(res){
        // success
        let school_arr = res.data.data
        let new_arr = []
        school_arr.forEach(function(e,index,array) {
          new_arr.push(e.name)
        },this)
        that.setData({
          oll_School_List: school_arr,
          school: new_arr
        })
      },
      fail: function(res) {
        // fail
      },
      complete: function(res) {
        // complete
      }
    })
  },
  // 修改选择学校 
  bindPickerChange: function(e) {
    let that = this
    let ele = e.detail.value

    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      detailMsg: {
            nickname: e.detail.value,
            sex: that.data.detailMsg.sex,
            schoolId: that.data.oll_School_List[ele].id,
            univsId:  that.data.detailMsg.univsId
      },
      index: ele
    })
    // 获取院校id

    // 专业选择
    wx.request({
      url: 'https://www.aimiaoyin.com/print/?m=admin&c=user&a=schoolmajor',
      data: {
        uid: that.data.oll_School_List[ele].id
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Cookie": wx.getStorageSync('PHPSESSID')       
      }, // 设置请求的 header
      success: function(res){
        // success
        let department_arr = res.data.data
        let new_darr = []
        department_arr.forEach(function(e,index,array) {
          new_darr.push(e.name)
        },this)
        that.setData({
          oll_academy: department_arr,
          academy: new_darr
        })
      },
      fail: function(res) {
        // fail
      },
      complete: function(res) {
        // complete
      }
    })
  },

  //专业修改 
  bindPickeracademyChange: function(e) {
    let that = this
    let ele = e.detail.value

    console.log('picker发送选择改变，携带值为', e.detail.value)
    that.setData({
      detailMsg: {
            nickname: e.detail.value,
            sex: that.data.detailMsg.sex,
            schoolId: that.data.detailMsg.schoolId,
            univsId:   that.data.oll_academy[ele].id
      },
      academy_index: ele
    })   
  },
  //昵称输入绑定
  bindNicknameInput:function(e) {
        this.setData({
          detailMsg: {
            nickname: e.detail.value,
            sex: this.data.detailMsg.sex,
            schoolId: this.data.detailMsg.schoolId,
            univsId:  this.data.detailMsg.univsId
          }
        })
  },
  //性别选择绑定
  radioChangeSex: function(e) {
    this.setData({
      detailMsg: {
            nickname: this.data.detailMsg.nickname,
            sex: e.detail.value,
            schoolId: this.data.detailMsg.schoolId,
            univsId: this.data.detailMsg.univsId
      }
    })
  },
  //上传头像
  uploadFace: function() {
    wx.chooseImage({
      success: function(res) {
        var tempFilePaths = res.tempFilePaths
        console.log(tempFilePaths)
        wx.uploadFile({
          url: 'https://www.aimiaoyin.com/print/?m=admin&c=index&a=editInfo', 
          filePath: tempFilePaths[0],
          header: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Cookie": wx.getStorageSync('PHPSESSID')
          },
          name: 'face',
          success: function(res){
            console.log("成功")
            //do something
          }
        })
      }
    })   
  },
  //登陆表单信息提交
  formSubmit: function(e) {
    let that = this  
    // 判断提交信息并||提交表单
    if(e.detail.value.username.length==0||e.detail.value.password.length==0) {
      wx.showToast({
        title: '信息不能为空',
        image: '/images/warn.png',
        duration: 1000
      })
    } else {
      this.setData({
        formData: e.detail.value
      })
      wx.request({
        url: 'https://www.aimiaoyin.com/print/?m=admin&c=login&a=userLogin',
        data: e.detail.value,
        method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        header: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Cookie": wx.getStorageSync('PHPSESSID')
        },
        success: function(res){
          // success
          //用户数据保存在本地localstorage
          console.log(res)
          if(res.data.code == 200) {
            wx.setStorageSync('currentUser', res.data.data)
            that.setData({
              loginForm: true
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
    }
  },
  // 退出登录
  loginout: function() {
    var that = this
    wx.request({
      url: 'https://www.aimiaoyin.com/print/?m=admin&c=login&a=userLogout',
      data: {},
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        "Cookie": wx.getStorageSync('PHPSESSID')
      }, // 设置请求的 header
      success: function(res){
        // success
        if(res.data.code == 200) {
          that.setData({
            loginForm: false
          })
          try {
              wx.clearStorageSync()
          } catch(e) {
            // Do something when catch error
            console.log("清楚缓存失败")
          }
        }
      },
      fail: function(res) {
        // fail
      },
      complete: function(res) {
        // complete
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
            console.log("已登陆")
          } else {
            wx.setStorageSync('PHPSESSID', res.data)
          }
        }
      }
    }) 
  
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    var that = this
    try {
      const value = wx.getStorageSync('currentUser')
      if (value) {
          // Do something with return value
          that.setData({
            loginForm: true
          })
      }
    } catch (e) {
      // Do something when catch error
      //未登录
    }

    that.pickScool()
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
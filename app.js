const initData = require('./data')
// app.js
App({
  onLaunch () {
    // 数据初始化在这里，就可以统一index页面加载数据时的逻辑
    for (const key in initData) {
      // 不能通过||的值正是应该被返回的值（false，null）
      let data = wx.getStorageSync(key)
      if (data === '') {
        data = initData[key]
      }
      wx.setStorageSync(key, data)
    }
  },

  onHide () {
    this.onAppHide()
  },

  onSettingsChange () {
    console.log('Error: should be set in index.js')
  },
})

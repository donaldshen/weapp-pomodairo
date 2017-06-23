// pages/settings/settings.js
const app = getApp()
const initData = require('../../data')

Page({
  data: {
    target: 8,
    workInterval: 25,
    breakInterval: 5,
  },
  onLoad() {
    this.setData({
      target: wx.getStorageSync('target'),
      workInterval: wx.getStorageSync('workInterval'),
      breakInterval: wx.getStorageSync('breakInterval'),
    })
  },
  targetChange: function (e) {
    this.onChange({ target: e.detail.value})
  },
  workChange: function (e) {
    this.onChange({ workInterval: e.detail.value })
  },
  breakChange: function (e) {
    this.onChange({ breakInterval: e.detail.value })
  },
  onChange(settings) {
    this.setData(settings)
    app.onSettingsChange(settings)
  },
  // reset() {
  //   for (const key in initData) {
  //     wx.setStorageSync(key, initData[key])
  //   }
  // }
})
// pages/index/addTask/addTask.js
const app = getApp()
Page({
  addTask(e) {
    const task = e.detail.value.task
    if (task) {
      wx.showToast({
        title: '添加成功',
        icon: 'success'
      })
      app.onAddTask(task)
      // wx.navigateBack({})
    } else {
      wx.showToast({
        title: '请输入任务名',
        icon: 'loading'
      })
    }
  }
})
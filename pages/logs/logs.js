Page({
  data: {
    logs: null,
    max: 0
  },
  onShow() {
    let max = 0, logs = wx.getStorageSync('logs')
    logs = logs.map(log => {
      let num = 0
      for (const name in log.tasks) {
        num += log.tasks[name]
      }
      log.text = Array(num).fill('🍅').join('')
      max = Math.max(max, num)
      return log
    })
    this.setData({
      logs,
      max
    })
  },

  showDetail(e) {
    const item = e.currentTarget.dataset.item
    let url = `detail/detail?date=${item.date}`
    for (const task in item.tasks) {
      url += `&${task}=${item.tasks[task]}`
    }

    wx.navigateTo({
      url: encodeURI(url)
    })
  }
})
// index.js
// 获取应用实例
const app = getApp()
const voiceUrl = require('../../config.js').voiceUrl

function formatTime (time) {
  time = Math.floor(time / 1000)
  const minute = Math.floor(time / 60)
  const second = time % 60
  return (minute < 10 ? '0' : '') + minute + (second < 10 ? ':0' : ':') + second
}

Page({
  // 初始数据在data.js。这里数据只表类型
  data: {
    workInterval: 25,
    breakInterval: 5,
    isRunning: false,
    isWorking: true,

    // 计算时间流逝
    pass: 0,
    restartTime: null,

    tasks: ['工作', '学习'],
    index: 0,

    // 下一天会重置completed
    today: null,
    target: 8,
    completed: 0,

    // 动画参数
    timerText: '',
    leftDeg: -45,
    rightDeg: 135,
  },

  // life cycle
  onLoad () {
    const d = this.data

    // 挂载同步状态的函数到app上
    const {onHide} = app
    app.onHide = function () {
      Object.keys(d).forEach((key) => {
        wx.setStorage({key, data: d[key]})
      })
      onHide.apply(app)
    }
    app.onSettingsChange = (settings) => {
      this.setData(settings)
    }
    app.onAddTask = (task) => {
      if (!d.tasks.includes(task)) {
        d.tasks.push(task)
        this.setData({
          tasks: d.tasks,
        })
      }
    }

    // 恢复上一次进入后台时的状态
    for (const key in d) {
      // put the variable in square brackets in order to evaluate it
      this.setData({ [key]: wx.getStorageSync(key) })
    }

    const now = Date.now(), today = new Date().toLocaleDateString()
    // 如果退出前在运行，则要根据流逝的时间校正当前的状态
    if (d.isRunning) {
      const endTime = d.today === today ? now : Date.parse(d.today) + 24 * 60 * 60 * 1000
      let totalPass = d.pass + endTime - d.restartTime,
        endFunc = () => this.interval() <= totalPass
      if (d.completed < d.target) {
        endFunc = () => d.completed < d.target && this.interval() <= totalPass
      }

      while (endFunc()) {
        totalPass -= this.interval()
        if (d.isWorking) {
          this.addToLogs()
          this.setData({ completed: d.completed + 1 })
        }
        this.setData({ isWorking: !d.isWorking })
        console.log(totalPass)
      }

      if (d.today === today && d.completed < d.target) {
        this.setData({
          pass: totalPass,
          restartTime: now,
        })
      } else {
        this.setData({
          pass: 0,
          restartTime: null,
          isRunning: false,
          isWorking: true,
        })
        console.log(d)
      }
    }

    if (d.today !== today) {
      this.setData({ completed: 0 })
    }

    setInterval(this.loop, 100)
  },

  // event handler
  toggleTimer () {
    const d = this.data
    if (d.isWorking) {
      this.setData({ isRunning: !d.isRunning })
      if (d.isRunning) {
        this.setData({ restartTime: Date.now() })
      } else {
        this.setData({
          pass: this.exactPass(),
          restartTime: null,
        })
      }
    } else {
      // 跳过休息
      this.setData({ pass: this.interval() })
    }
  },

  navigateToAddPage () {
    wx.navigateTo({
      url: 'addTask/addTask',
    })
  },

  pickTask (e) {
    this.setData({ index: e.detail.value })
  },

  // computed propertyies
  restTime () {
    const pass = this.exactPass(), interval = this.interval()
    return {
      time: interval - pass,
      progress: pass / interval,
    }
  },

  exactPass () {
    let d = this.data, pass = d.pass
    if (d.restartTime) {
      pass += Date.now() - d.restartTime
    }
    return pass
  },

  interval () {
    const d = this.data
    return (d.isWorking ? d.workInterval : d.breakInterval) * 60 * 1000
  },

  // auxiliary method
  loop () {
    const d = this.data, now = new Date()
    // watch the midnight moment
    const today = now.toLocaleDateString()
    if (today !== d.today) {
      this.setData({
        today,
        completed: 0,
      })
    }
    // update stat if running
    if (d.isRunning) {
      if (this.restTime().time <= 0) {
        this.setData({
          isWorking: !d.isWorking,
          pass: 0,
          restartTime: Date.now(),
        })
        if (!d.isWorking) {
          wx.playBackgroundAudio({
            dataUrl: `${voiceUrl}kill_bill.mov`,
          })
          this.setData({
            completed: d.completed + 1,
          })
          this.addToLogs()

          if (d.completed === d.target) {
            this.setData({
              isRunning: false,
              isWorking: true,
              pass: 0,
              restartTime: null,
            })
            wx.showToast({
              title: '今天任务完成',
              icon: 'success',
              duration: 3000,
            })
          }
        } else {
          wx.playBackgroundAudio({
            dataUrl: `${voiceUrl}elegant.mov`,
          })
        }
      }
    }

    this.refreshClock()
  },

  refreshClock () {
    const rest = this.restTime()
    const t = rest.time
    const p = rest.progress
    const animateLeft = rest.progress < 0.5
    this.setData({
      timerText: formatTime(t),
      leftDeg: (animateLeft ? -45 - p * 360 : -225),
      rightDeg: (animateLeft ? 135 : 135 - (p - 0.5) * 360),
    })
  },

  addToLogs () {
    const d = this.data
    const taskName = d.tasks[d.index] || 'default'
    const logs = wx.getStorageSync('logs')
    const today = d.today
    if (!logs[0] || logs[0].date !== today) {
      logs.unshift({
        date: today,
        tasks: {},
        completed: false,
      })
    }
    const tasks = logs[0].tasks
    tasks[taskName] = tasks[taskName] || 0
    tasks[taskName] += 1
    let total = 0
    for (const t in tasks) {
      total += tasks[t]
    }
    if (total >= d.target) {
      logs[0].completed = true
    }
    wx.setStorageSync('logs', logs)
  },
})

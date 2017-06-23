# 微信小程序——番茄钟

## Build
直接用微信web开发者工具打开后编译即可。  
如果需要背景音乐，则需要服务器支持（不支持本地音频）。  
可以参考腾讯云[解决方案](https://www.qcloud.com/solution/la)

## Model
```
Timer {
  isRunning: bool, // 时钟是否在运行
  isWorking: bool, // 工作状态还是休息状态
  // 下面这两个状态是理解时钟的关键。
  // 实际流逝的时间exactPass =  pass + Date.now() - d.restartTime
  pass: Number, // 上次暂停前已消逝的时间
  restartTime: Number/null, // null指示现在处于暂停；number是上次恢复/启动任务的时间
}
```

## TODO：
- [x]提示音
- [ ]addTask用CheckBox展示已有的任务名
- [ ]增加数据分析
- [ ]改名
- [ ]设定期望完成时间，提醒自己的剩余时间

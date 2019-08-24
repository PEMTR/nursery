"use strict"


// package
// @package
const cluster = require("cluster")


// 绑定进程事件
// 检查进程ID
// 避免重复广播给自身
// @params {string} pid
// @params {any} msg
// @private
const Broad = work => {
  work.on("error", console.error)
  work.on("message", msg => {
    for (let id in cluster.workers) {
      let _work = cluster.workers[id]
      (id !== work.id) && _work.send(msg)
    }
  })
}


// 主进程
if (cluster.isMaster) {
  
  // fork子进程
  // 按指定数生产
  let _forks = Number(process.argv[3])
  for (let i = 0; i < _forks; i ++) {
    Broad(cluster.fork())
  }
  
  // 绑定集群退出事件
  // 每当有子进程退出时
  // 都将重新启动新进程
  cluster.on("exit", _ => {
    Broad(cluster.fork())
  })
} else {
  
  // fork进程
  // 启动指定服务入口
  let _model = process.argv[2]
  require("./service/" + _model + ".js")
}


// 有无自动退出
if (typeof process.argv[4] === "string") {
  setTimeout(_ => {
    process.exit(0)
  }, Number(process.argv[4]) || 20000)
}
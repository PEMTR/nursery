"use strict"


// package
// @package
const child_process = require("child_process")
const util = require("util")


// 每隔半小时检查
// 检查是否达到指定时段
setInterval(function () {
  if ((new Date()).getHours() !== 0) {
    return false
  }
  
  // 运行数据库备份
  // 备份业务数据库
  let _temp = "mongodump --host %s --username %s --password %s --db %s --out %s"
  let _args = [ "127.0.0.1:27017", "nursery", "6FlBWz4C4ScUb+UFNCLrGbveFk426Wa3Sh91aJRGhKQ=", "nursery", "/root/dump" ]
  child_process.exec(util.format(_temp, ..._args))
}, 1000 * 60 * 30)
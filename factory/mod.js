"use strict"


// package
// @package
const logs = require("./use/logs")


// 工厂类
// @class
module.exports = class Factory {
  
  // @new
  // @params {super class} 依赖总线
  constructor (crate) {
    this.logs = new logs(crate)
  }
}
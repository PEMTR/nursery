"use strict"


// package
// @package
const { Client } = require("@elastic/elasticsearch")
const logs = require("./use/logs")


// 接口类
// @class
module.exports = class Interface {
  constructor (crate) {
    this.Logs = new logs(crate)
  }
}
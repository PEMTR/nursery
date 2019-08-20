"use strict"


// package
// @package
const mongo = require("./use/mongo/mod")


// 模型类
// @class
module.exports = class Device {
  constructor (crate) {
    this.Mongo = new mongo(crate)
  }
}
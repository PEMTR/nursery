"use strict"


// package
// @package
const mongo = require("./use/mongo/mod")


// 模型类
// @class
module.exports = class Core {
  constructor (crate) {
    this.mongo = new mongo(crate)
  }
}
"use strict"


// package
// @package
const mongo = require("./mongo/mod")
const redis = require("./redis/mod")
const graph = require("./graph/mod")


// 模型类
// @class
module.exports = class Interface {
  constructor (crate) {
    this.mongo = new mongo(crate)
    this.redis = new redis(crate)
    this.graph = new graph(crate)
  }
}
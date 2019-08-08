"use strict"


// package
// @package
const mongo = require("./use/mongo/mod")
const redis = require("./use/redis/mod")
const graph = require("./use/graph/mod")


// 模型类
// @class
module.exports = class Interface {
  constructor (crate) {
    this.mongo = new mongo(crate)
    this.redis = new redis(crate)
    this.graph = new graph(crate)
  }
}
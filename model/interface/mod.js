"use strict"


// package
// @package
const mongo = require("./use/mongo/mod")
const redis = require("./use/redis/mod")
const resolver = require("./use/resolver/mod")


// 模型类
// @class
module.exports = class Interface {
  constructor (crate) {
    this.Mongo = new mongo(crate)
    this.Redis = new redis(crate)
    this.Resolver = new resolver(crate)
  }
}
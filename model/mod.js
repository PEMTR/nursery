"use strict"


// package
// @package
const mongo = require("./use/mongo/mod")
const redis = require("./use/redis/mod")
const graphql = require("./use/graphql/mod")


// 模型类
// @class
module.exports = class Model {
  
  // @new
  // @params {super class} 依赖总线
  constructor (crate) {
    this.mongo = new mongo(crate)
    this.redis = new redis(crate)
    this.graphql = new graphql(crate)
  }
}
"use strict"


// package
// @package
const mongo = require("./mongo/mod")
const redis = require("./redis/mod")
const graphql = require("./graphql/mod")


// 模型类
// @class
module.exports = class Api {
  constructor (crate) {
    this.mongo = new mongo(crate)
    this.redis = new redis(crate)
    this.graphql = new graphql(crate)
  }
}
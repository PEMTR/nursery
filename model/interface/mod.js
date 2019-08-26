"use strict"


// package
// @package
const mongo = require("./use/mongo/mod")
const resolver = require("./use/resolver/mod")


// 模型类
// @class
module.exports = class Interface {
  constructor (crate) {
    this.Mongo = new mongo(crate)
    this.Resolver = new resolver(crate)
  }
}
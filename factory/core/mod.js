"use strict"


// package
// @package
const queue = require("./queue/mod")


// 核心类
// @class
module.exports = class Core {
  constructor (crate) {
    this.Queue = new queue(crate)
  }
}
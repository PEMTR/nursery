"use strict"


// package
// @package
const queue = require("./queue/mod")


// 存储类
// @class
module.exports = class Disk {
  constructor (crate) {
    this.Queue = new queue(crate)
  }
}
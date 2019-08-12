"use strict"


// package
// @package
const achievement = require("./use/achievement")
const animation = require("./use/animation")


// 缓存类
// @class
module.exports = class Quasipaa {
  constructor (crate) {
    this.Achievement = new achievement(crate)
    this.Animation = new animation(crate)
  }
}